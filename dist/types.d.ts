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
/** MCP structural telemetry block — v2.0 SDK and above. */
export interface McpTelemetry {
    /** Was the MCP output schema valid? */
    output_schema_valid?: boolean;
    /** Number of schema auto-repairs performed. */
    schema_repair_count?: number;
    /** Number of tool call schema errors. */
    tool_call_schema_errors?: number;
    /** True if a protocol invariant was violated. */
    invariant_violation_flag?: boolean;
    /** True if the MCP schema version didn't match the expected version. */
    schema_version_mismatch?: boolean;
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
    /** Provider ID from the Tally provider registry. */
    provider_id?: string;
    /** MCP structural telemetry — include when tool calls were made (v2.0+). */
    mcp_telemetry?: McpTelemetry;
    /** Failure classification for unsuccessful calls. */
    failure_class?: 'structural' | 'cognitive' | 'economic' | 'timeout';
    /** Session ID for grouping multi-turn conversations. */
    session_id?: string;
}
export type StreamPhase = 'start' | 'chunk' | 'complete' | 'error';
interface StreamTelemetryBase {
    /** Ties all events for one stream together. Use your turn ID or a fresh UUID. */
    stream_id: string;
    phase: StreamPhase;
    model_used: string;
    session_id?: string;
    provider_id?: string;
}
/** Emitted once when streaming begins. */
export interface StreamStartEvent extends StreamTelemetryBase {
    phase: 'start';
    /** Optional — attach the routing envelope if you have it at stream start. */
    semantic_envelope?: SemanticEnvelope;
}
/** Emitted per chunk. chunk_index is 0-based. */
export interface StreamChunkEvent extends StreamTelemetryBase {
    phase: 'chunk';
    chunk_index: number;
    /** Per-chunk token count. Not all providers expose this; omit if unavailable. */
    tokens_this_chunk?: number;
    /** Wall-clock ms since stream started. */
    elapsed_ms: number;
}
/** Emitted once when streaming completes successfully. */
export interface StreamCompleteEvent extends StreamTelemetryBase {
    phase: 'complete';
    tokens_input: number;
    tokens_output: number;
    duration_ms: number;
    /** Total chunks received during this stream. */
    chunk_count?: number;
}
/** Emitted if streaming terminates with an error. */
export interface StreamErrorEvent extends StreamTelemetryBase {
    phase: 'error';
    error_class?: 'timeout' | 'network' | 'rate_limit' | 'model_error' | 'unknown';
    elapsed_ms: number;
}
export type StreamTelemetryEvent = StreamStartEvent | StreamChunkEvent | StreamCompleteEvent | StreamErrorEvent;
export interface TallyConfig {
    /** Tally API base URL. Defaults to TALLY_API_URL env var or http://localhost:5000 */
    apiUrl?: string;
    /** Bearer token. Defaults to TALLY_API_KEY env var */
    apiKey?: string;
    /** Request timeout in ms. Defaults to 3000. Tally should never block your main call. */
    timeoutMs?: number;
}
export {};
//# sourceMappingURL=types.d.ts.map