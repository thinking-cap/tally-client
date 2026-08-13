import type { TallyConfig, RouteRequest, RouteResponse, TelemetryEvent, StreamTelemetryEvent, QualityFeedback } from './types';
export declare const SDK_VERSION = "0.1.0";
export declare class TallyClient {
    private apiUrl;
    private apiKey;
    private timeout;
    constructor(config?: TallyConfig);
    private headers;
    /**
     * Ask Tally which model to use for this request shape.
     * Throws on network error or non-2xx response.
     */
    route(req: RouteRequest): Promise<RouteResponse>;
    /**
     * Safe version — returns undefined instead of throwing.
     * Always use this in production so Tally never blocks your model call.
     */
    routeSafe(req: RouteRequest): Promise<RouteResponse | undefined>;
    /**
     * Report a completed model call to Tally. Fire-and-forget — never awaited,
     * never throws, never slows down your response path.
     */
    report(event: TelemetryEvent): void;
    /**
     * Report a single streaming lifecycle event (start / chunk / complete / error).
     * Fire-and-forget — identical contract to report().
     *
     * Tally is NOT in the transport path. Call this from your streaming loop
     * if you want chunk-level observability. If you don't call it, that's fine —
     * Tally will never know the difference and your stream is unaffected.
     *
     * Typical usage:
     *   tally.reportStream({ stream_id: turnId, phase: 'start',    model_used })
     *   // for each chunk:
     *   tally.reportStream({ stream_id: turnId, phase: 'chunk',    model_used, chunk_index: i, elapsed_ms })
     *   tally.reportStream({ stream_id: turnId, phase: 'complete', model_used, tokens_input, tokens_output, duration_ms })
     */
    reportStream(event: StreamTelemetryEvent): void;
    /**
     * Attach a late quality judgment to already-reported events — the "a human
     * reviewed it and didn't like the result" path. Addressed by event id,
     * external_call_id, or session_id (all events sharing it are scored).
     * Human ('user') scores override system-evaluator scores server-side; the
     * next aggregation tick moves routing. Fire-and-forget like report().
     *
     *   tally.reportQuality({ session_id: `${tenantId}:${activityId}`,
     *                         quality_score: 0.1, quality_slugs: ['incorrect'] })
     */
    reportQuality(feedback: QualityFeedback): void;
}
//# sourceMappingURL=client.d.ts.map