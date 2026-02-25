// ─── Semantic Envelope ────────────────────────────────────────────────────────
// Structural shape of a request — no content, no embeddings.

export type TaskType =
  | 'classification' | 'reasoning' | 'creative' | 'code'
  | 'math' | 'retrieval' | 'synthesis' | 'agentic';

export type ContextLengthBucket   = 'small' | 'medium' | 'large' | 'xlarge';
export type EstimatedTokensBucket = 'small' | 'medium' | 'large' | 'xlarge';
export type StructureType = 'qa' | 'multi-step' | 'tool-call-heavy' | 'long-form';
export type ToolType      = 'read_only' | 'mutating' | 'streaming' | 'external_api';
export type ToolComplexity = 'low' | 'medium' | 'high';
export type TrustLevel    = 'certified' | 'private';
export type OutcomeSignal = 'compliant' | 'escalated' | 'failed';

export interface SemanticEnvelope {
  schema_version:          string;           // "1.0"
  task_type:               TaskType;
  complexity_score:        number;           // 0.0 – 1.0
  context_length_bucket:   ContextLengthBucket;
  estimated_tokens_bucket: EstimatedTokensBucket;
  structure_type:          StructureType;
  determinism_required:    boolean;
  capability_tags:         string[];
}

export interface ToolDescriptor {
  name:       string;
  type:       ToolType;
  complexity: ToolComplexity;
}

// ─── Route ────────────────────────────────────────────────────────────────────

export interface RouteRequest {
  semantic_envelope: SemanticEnvelope;
  available_models:  string[];
  available_tools?:  ToolDescriptor[];
  constraints?: {
    estimatedInputTokens?: number;
    maxLatencyMs?:         number;
    requiredModalities?:   string[];
    policyTags?:           string[];
  };
}

export interface RouteResponse {
  recommended_model: string;
  exploration_flag:  boolean;
  confidence_score:  number;
  decision_trace:    string;
}

// ─── Telemetry ────────────────────────────────────────────────────────────────

/** MCP structural telemetry block — v2.0 SDK and above. */
export interface McpTelemetry {
  /** Was the MCP output schema valid? */
  output_schema_valid?:       boolean;
  /** Number of schema auto-repairs performed. */
  schema_repair_count?:       number;
  /** Number of tool call schema errors. */
  tool_call_schema_errors?:   number;
  /** True if a protocol invariant was violated. */
  invariant_violation_flag?:  boolean;
  /** True if the MCP schema version didn't match the expected version. */
  schema_version_mismatch?:   boolean;
}

export interface TelemetryEvent {
  id:                   string;           // UUID — idempotency key
  semantic_envelope:    SemanticEnvelope;
  available_tools?:     ToolDescriptor[];
  model_used:           string;
  tokens_input:         number;
  tokens_output:        number;
  duration_ms:          number;
  success:              boolean;
  tool_calls_made?:     number;
  tool_errors?:         number;
  retry_count?:         number;
  outcome_signal?:      OutcomeSignal;
  rule_violation_flag?: boolean;
  violation_type?:      string;
  /** Provider ID from the Tally provider registry. */
  provider_id?:         string;
  /** MCP structural telemetry — include when tool calls were made (v2.0+). */
  mcp_telemetry?:       McpTelemetry;
  /** Failure classification for unsuccessful calls. */
  failure_class?:       'structural' | 'cognitive' | 'economic' | 'timeout';
  /** Session ID for grouping multi-turn conversations. */
  session_id?:          string;
}

// ─── Client config ────────────────────────────────────────────────────────────

export interface TallyConfig {
  /** Tally API base URL. Defaults to TALLY_API_URL env var or http://localhost:5000 */
  apiUrl?:    string;
  /** Bearer token. Defaults to TALLY_API_KEY env var */
  apiKey?:    string;
  /** Request timeout in ms. Defaults to 3000. Tally should never block your main call. */
  timeoutMs?: number;
}
