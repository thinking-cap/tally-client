export { TallyClient, SDK_VERSION } from './client';
export { buildEnvelope }           from './envelope';
export type {
  TallyConfig,
  SemanticEnvelope, TaskType, StructureType,
  ContextLengthBucket, EstimatedTokensBucket,
  ToolDescriptor, ToolType, ToolComplexity,
  RouteRequest, RouteResponse,
  TelemetryEvent, TrustLevel, OutcomeSignal,
} from './types';
export type { EnvelopeOpts } from './envelope';
