export type TaskType = 'classification' | 'reasoning' | 'creative' | 'code' | 'math' | 'retrieval' | 'synthesis' | 'agentic';
export type ContextLengthBucket = 'small' | 'medium' | 'large' | 'xlarge';
export type EstimatedTokensBucket = 'small' | 'medium' | 'large' | 'xlarge';
export type StructureType = 'qa' | 'multi-step' | 'tool-call-heavy' | 'long-form';
export type ToolType = 'read_only' | 'mutating' | 'streaming' | 'external_api';
export type ToolComplexity = 'low' | 'medium' | 'high';
export type TrustLevel = 'certified' | 'private';
export type OutcomeSignal = 'compliant' | 'escalated' | 'failed';
export interface SemanticEnvelope {
    schema_version: string;
    task_type: TaskType;
    complexity_score: number;
    context_length_bucket: ContextLengthBucket;
    estimated_tokens_bucket: EstimatedTokensBucket;
    structure_type: StructureType;
    determinism_required: boolean;
    capability_tags: string[];
}
export interface ToolDescriptor {
    name: string;
    type: ToolType;
    complexity: ToolComplexity;
}
export interface RouteRequest {
    semantic_envelope: SemanticEnvelope;
    available_models: string[];
    available_tools?: ToolDescriptor[];
    constraints?: {
        estimatedInputTokens?: number;
        maxLatencyMs?: number;
        requiredModalities?: string[];
        policyTags?: string[];
    };
}
export interface RouteResponse {
    recommended_model: string;
    exploration_flag: boolean;
    confidence_score: number;
    decision_trace: string;
}
export interface TelemetryEvent {
    id: string;
    semantic_envelope: SemanticEnvelope;
    available_tools?: ToolDescriptor[];
    model_used: string;
    tokens_input: number;
    tokens_output: number;
    duration_ms: number;
    success: boolean;
    tool_calls_made?: number;
    tool_errors?: number;
    retry_count?: number;
    outcome_signal?: OutcomeSignal;
    rule_violation_flag?: boolean;
    violation_type?: string;
}
export interface TallyConfig {
    /** Tally API base URL. Defaults to TALLY_API_URL env var or http://localhost:5000 */
    apiUrl?: string;
    /** Bearer token. Defaults to TALLY_API_KEY env var */
    apiKey?: string;
    /** Request timeout in ms. Defaults to 3000. Tally should never block your main call. */
    timeoutMs?: number;
}
//# sourceMappingURL=types.d.ts.map