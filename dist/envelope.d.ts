import type { SemanticEnvelope, TaskType } from './types';
export interface EnvelopeOpts {
    /** Total characters of context (messages + system prompt) — used to estimate token bucket */
    contextChars?: number;
    /** Estimated output chars or tokens — used to estimate output bucket */
    estimatedOutputChars?: number;
    /** Number of conversation turns so far */
    turnCount?: number;
    /** Number of tools available */
    toolCount?: number;
    /** Whether any tools are mutating (write operations) */
    hasMutatingTools?: boolean;
    /** Override task type (default: 'agentic') */
    taskType?: TaskType;
    /** Whether deterministic output is required */
    determinismRequired?: boolean;
    /** Extra capability tags (e.g. ['json_output', 'function_calling']) */
    capabilityTags?: string[];
}
/**
 * Build a SemanticEnvelope from observable Tapestry/Garment metrics.
 * All fields can be inferred — nothing is required.
 */
export declare function buildEnvelope(opts?: EnvelopeOpts): SemanticEnvelope;
//# sourceMappingURL=envelope.d.ts.map