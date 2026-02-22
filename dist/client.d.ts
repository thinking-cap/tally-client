import type { TallyConfig, RouteRequest, RouteResponse, TelemetryEvent } from './types';
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
}
//# sourceMappingURL=client.d.ts.map