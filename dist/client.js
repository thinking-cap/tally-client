"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TallyClient = exports.SDK_VERSION = void 0;
exports.SDK_VERSION = '0.1.0';
class TallyClient {
    constructor(config) {
        this.apiUrl = config?.apiUrl ?? process.env['TALLY_API_URL'] ?? 'http://localhost:5000';
        this.apiKey = config?.apiKey ?? process.env['TALLY_API_KEY'];
        this.timeout = config?.timeoutMs ?? 3000;
    }
    headers() {
        const h = { 'Content-Type': 'application/json' };
        if (this.apiKey)
            h['Authorization'] = `Bearer ${this.apiKey}`;
        return h;
    }
    /**
     * Ask Tally which model to use for this request shape.
     * Throws on network error or non-2xx response.
     */
    async route(req) {
        const r = await fetch(`${this.apiUrl}/route`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify(req),
            signal: AbortSignal.timeout(this.timeout),
        });
        if (!r.ok) {
            const body = await r.text().catch(() => '');
            throw new Error(`Tally /route ${r.status}: ${body}`);
        }
        return r.json();
    }
    /**
     * Safe version — returns undefined instead of throwing.
     * Always use this in production so Tally never blocks your model call.
     */
    async routeSafe(req) {
        try {
            return await this.route(req);
        }
        catch (err) {
            if (process.env['NODE_ENV'] !== 'test') {
                console.warn('[tally] route failed (using fallback):', err instanceof Error ? err.message : err);
            }
            return undefined;
        }
    }
    /**
     * Report a completed model call to Tally. Fire-and-forget — never awaited,
     * never throws, never slows down your response path.
     */
    report(event) {
        const body = JSON.stringify({
            ...event,
            protocol_version: '1.0',
            sdk_version: exports.SDK_VERSION,
            trust_level: 'private',
        });
        fetch(`${this.apiUrl}/telemetry`, {
            method: 'POST',
            headers: this.headers(),
            body,
        }).catch(() => {
            // Silent — telemetry loss is acceptable, blocking user is not
        });
    }
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
    reportStream(event) {
        fetch(`${this.apiUrl}/telemetry/stream`, {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify({ ...event, sdk_version: exports.SDK_VERSION }),
        }).catch(() => {
            // Silent — telemetry loss is acceptable, blocking user is not
        });
    }
}
exports.TallyClient = TallyClient;
//# sourceMappingURL=client.js.map