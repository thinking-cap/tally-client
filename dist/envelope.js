"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEnvelope = buildEnvelope;
/** Estimate a ContextLengthBucket from raw character count (~4 chars/token). */
function contextBucket(chars) {
    const approxTokens = chars / 4;
    if (approxTokens < 2000)
        return 'small';
    if (approxTokens < 8000)
        return 'medium';
    if (approxTokens < 32000)
        return 'large';
    return 'xlarge';
}
/** Estimate an EstimatedTokensBucket from output character count. */
function tokenBucket(chars) {
    const approxTokens = chars / 4;
    if (approxTokens < 500)
        return 'small';
    if (approxTokens < 2000)
        return 'medium';
    if (approxTokens < 8000)
        return 'large';
    return 'xlarge';
}
/** Derive a complexity score 0–1 from context size and turn depth. */
function complexityScore(contextChars, turnCount) {
    const tokenFraction = Math.min((contextChars / 4) / 32000, 1);
    const turnFraction = Math.min(turnCount / 20, 1);
    return Math.round((tokenFraction * 0.7 + turnFraction * 0.3) * 100) / 100;
}
/**
 * Build a SemanticEnvelope from observable Tapestry/Garment metrics.
 * All fields can be inferred — nothing is required.
 */
function buildEnvelope(opts = {}) {
    const ctx = opts.contextChars ?? 0;
    const out = opts.estimatedOutputChars ?? 4000; // ~1k tokens default
    const turns = opts.turnCount ?? 1;
    const tools = opts.toolCount ?? 0;
    const mutating = opts.hasMutatingTools ?? false;
    const structureType = tools > 0 ? 'tool-call-heavy' :
        turns > 3 ? 'multi-step' :
            out > 8000 ? 'long-form' : 'qa';
    const tags = [...(opts.capabilityTags ?? [])];
    if (tools > 0)
        tags.push('function_calling');
    if (mutating)
        tags.push('mutating_tools');
    return {
        schema_version: '1.0',
        task_type: opts.taskType ?? 'agentic',
        complexity_score: complexityScore(ctx, turns),
        context_length_bucket: contextBucket(ctx),
        estimated_tokens_bucket: tokenBucket(out),
        structure_type: structureType,
        determinism_required: opts.determinismRequired ?? false,
        capability_tags: tags,
    };
}
//# sourceMappingURL=envelope.js.map