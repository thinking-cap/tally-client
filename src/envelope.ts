import type {
  SemanticEnvelope, TaskType, StructureType,
  ContextLengthBucket, EstimatedTokensBucket,
} from './types';

export interface EnvelopeOpts {
  /** Total characters of context (messages + system prompt) — used to estimate token bucket */
  contextChars?:       number;
  /** Estimated output chars or tokens — used to estimate output bucket */
  estimatedOutputChars?: number;
  /** Number of conversation turns so far */
  turnCount?:          number;
  /** Number of tools available */
  toolCount?:          number;
  /** Whether any tools are mutating (write operations) */
  hasMutatingTools?:   boolean;
  /** Override task type (default: 'agentic') */
  taskType?:           TaskType;
  /** Whether deterministic output is required */
  determinismRequired?: boolean;
  /** Extra capability tags (e.g. ['json_output', 'function_calling']) */
  capabilityTags?:     string[];
}

/** Estimate a ContextLengthBucket from raw character count (~4 chars/token). */
function contextBucket(chars: number): ContextLengthBucket {
  const approxTokens = chars / 4;
  if (approxTokens < 2_000)  return 'small';
  if (approxTokens < 8_000)  return 'medium';
  if (approxTokens < 32_000) return 'large';
  return 'xlarge';
}

/** Estimate an EstimatedTokensBucket from output character count. */
function tokenBucket(chars: number): EstimatedTokensBucket {
  const approxTokens = chars / 4;
  if (approxTokens < 500)   return 'small';
  if (approxTokens < 2_000) return 'medium';
  if (approxTokens < 8_000) return 'large';
  return 'xlarge';
}

/** Derive a complexity score 0–1 from context size and turn depth. */
function complexityScore(contextChars: number, turnCount: number): number {
  const tokenFraction = Math.min((contextChars / 4) / 32_000, 1);
  const turnFraction  = Math.min(turnCount / 20, 1);
  return Math.round((tokenFraction * 0.7 + turnFraction * 0.3) * 100) / 100;
}

/**
 * Build a SemanticEnvelope from observable Tapestry/Garment metrics.
 * All fields can be inferred — nothing is required.
 */
export function buildEnvelope(opts: EnvelopeOpts = {}): SemanticEnvelope {
  const ctx     = opts.contextChars         ?? 0;
  const out     = opts.estimatedOutputChars ?? 4_000; // ~1k tokens default
  const turns   = opts.turnCount            ?? 1;
  const tools   = opts.toolCount            ?? 0;
  const mutating = opts.hasMutatingTools    ?? false;

  const structureType: StructureType =
    tools > 0 ? 'tool-call-heavy' :
    turns > 3 ? 'multi-step'      :
    out > 8_000 ? 'long-form'     : 'qa';

  const tags: string[] = [...(opts.capabilityTags ?? [])];
  if (tools > 0)   tags.push('function_calling');
  if (mutating)    tags.push('mutating_tools');

  return {
    schema_version:          '1.0',
    task_type:               opts.taskType ?? 'agentic',
    complexity_score:        complexityScore(ctx, turns),
    context_length_bucket:   contextBucket(ctx),
    estimated_tokens_bucket: tokenBucket(out),
    structure_type:          structureType,
    determinism_required:    opts.determinismRequired ?? false,
    capability_tags:         tags,
  };
}
