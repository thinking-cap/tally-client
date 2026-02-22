import type { TallyConfig, RouteRequest, RouteResponse, TelemetryEvent } from './types';

export const SDK_VERSION = '0.1.0';

export class TallyClient {
  private apiUrl:   string;
  private apiKey:   string | undefined;
  private timeout:  number;

  constructor(config?: TallyConfig) {
    this.apiUrl  = config?.apiUrl    ?? process.env['TALLY_API_URL'] ?? 'http://localhost:5000';
    this.apiKey  = config?.apiKey    ?? process.env['TALLY_API_KEY'];
    this.timeout = config?.timeoutMs ?? 3_000;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) h['Authorization'] = `Bearer ${this.apiKey}`;
    return h;
  }

  /**
   * Ask Tally which model to use for this request shape.
   * Throws on network error or non-2xx response.
   */
  async route(req: RouteRequest): Promise<RouteResponse> {
    const r = await fetch(`${this.apiUrl}/route`, {
      method:  'POST',
      headers: this.headers(),
      body:    JSON.stringify(req),
      signal:  AbortSignal.timeout(this.timeout),
    });
    if (!r.ok) {
      const body = await r.text().catch(() => '');
      throw new Error(`Tally /route ${r.status}: ${body}`);
    }
    return r.json() as Promise<RouteResponse>;
  }

  /**
   * Safe version — returns undefined instead of throwing.
   * Always use this in production so Tally never blocks your model call.
   */
  async routeSafe(req: RouteRequest): Promise<RouteResponse | undefined> {
    try {
      return await this.route(req);
    } catch (err) {
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
  report(event: TelemetryEvent): void {
    const body = JSON.stringify({
      ...event,
      protocol_version: '1.0',
      sdk_version:      SDK_VERSION,
      trust_level:      'private',
    });
    fetch(`${this.apiUrl}/telemetry`, {
      method:  'POST',
      headers: this.headers(),
      body,
    }).catch(() => {
      // Silent — telemetry loss is acceptable, blocking user is not
    });
  }
}
