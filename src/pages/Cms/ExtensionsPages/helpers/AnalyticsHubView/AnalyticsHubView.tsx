import { useState, useEffect, type FC } from 'react';
import { Badge, BearIcons, Button, Card, Flex, Typography } from '@forgedevstack/bear';

interface EndpointMetric {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requests: number;
  avgLatencyMs: number;
  successRate: number;
  cacheHitRatio: number;
}

const ENDPOINT_METRICS: EndpointMetric[] = [
  { path: '/api/articles', method: 'GET', requests: 58240, avgLatencyMs: 14, successRate: 99.98, cacheHitRatio: 92.4 },
  { path: '/api/pages', method: 'GET', requests: 34120, avgLatencyMs: 16, successRate: 100.0, cacheHitRatio: 94.1 },
  { path: '/api/content-types', method: 'GET', requests: 18950, avgLatencyMs: 11, successRate: 99.95, cacheHitRatio: 88.6 },
  { path: '/api/media', method: 'GET', requests: 15400, avgLatencyMs: 22, successRate: 99.90, cacheHitRatio: 96.8 },
  { path: '/api/articles', method: 'POST', requests: 8620, avgLatencyMs: 38, successRate: 99.85, cacheHitRatio: 0.0 },
  { path: '/api/settings', method: 'GET', requests: 7520, avgLatencyMs: 9, successRate: 100.0, cacheHitRatio: 99.2 },
];

const RECENT_REQUESTS_INITIAL = [
  { id: 'req-1', timestamp: 'Just now', method: 'GET', path: '/api/articles', status: 200, latency: '12ms', ip: '192.168.1.***' },
  { id: 'req-2', timestamp: '2s ago', method: 'GET', path: '/api/pages/about', status: 200, latency: '16ms', ip: '10.0.4.***' },
  { id: 'req-3', timestamp: '5s ago', method: 'POST', path: '/api/articles', status: 201, latency: '42ms', ip: '172.16.0.***' },
  { id: 'req-4', timestamp: '8s ago', method: 'GET', path: '/api/media', status: 200, latency: '24ms', ip: '192.168.1.***' },
  { id: 'req-5', timestamp: '12s ago', method: 'GET', path: '/api/content-types', status: 200, latency: '9ms', ip: '10.0.2.***' },
];

export const AnalyticsHubView: FC = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [liveRequests, setLiveRequests] = useState(RECENT_REQUESTS_INITIAL);

  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const endpoints = ['/api/articles', '/api/pages', '/api/media', '/api/content-types', '/api/settings'];
      const methods: ('GET' | 'POST')[] = ['GET', 'GET', 'GET', 'POST'];
      const randomPath = endpoints[Math.floor(Math.random() * endpoints.length)];
      const randomMethod = methods[Math.floor(Math.random() * methods.length)];
      const randomLatency = Math.floor(Math.random() * 25) + 8;
      
      const newReq = {
        id: `req-${Date.now()}`,
        timestamp: 'Just now',
        method: randomMethod,
        path: randomPath,
        status: randomMethod === 'POST' ? 201 : 200,
        latency: `${randomLatency}ms`,
        ip: `192.168.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 200)}`,
      };

      setLiveRequests((prev) => [newReq, ...prev.slice(0, 5)]);
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const volumePoints = timeframe === '24h'
    ? [22, 35, 18, 45, 60, 78, 92, 110, 145, 160, 180, 195, 210, 185, 170, 155, 140, 130, 115, 95, 80, 65, 45, 30]
    : timeframe === '7d'
    ? [840, 920, 1150, 1420, 1680, 1350, 1020]
    : [28, 32, 35, 40, 42, 45, 48, 52, 55, 59, 62, 65, 68, 70, 74, 78, 82, 85, 89, 93, 96, 99, 102, 105, 108, 112, 116, 120, 124, 128];

  const maxVolume = Math.max(...volumePoints);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="info" className="bg-[var(--bear-primary-500,#1E3A8A)] text-white font-semibold text-xs px-2.5 py-0.5">
                API Traffic &amp; Analytics Hub
              </Badge>
              <Badge variant="outline" className="text-emerald-400 border-emerald-800 text-xs">
                ● Live Monitoring Active
              </Badge>
            </div>
            <Typography variant="h2" className="text-2xl font-bold text-white mb-1">
              API Requests &amp; Content Insights
            </Typography>
            <Typography variant="body2" className="text-gray-300 max-w-2xl text-sm">
              Real-time telemetry, response latency percentiles, headless request volumes, and publishing activity across all sites.
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-800/80 p-1 rounded-lg border border-slate-700 flex items-center">
              {(['24h', '7d', '30d'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              variant={isLiveStreaming ? 'outline' : 'primary'}
              className="text-xs flex items-center gap-1.5 border-slate-700 text-gray-200"
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            >
              {isLiveStreaming ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <BearIcons.PlayIcon size={12} />
                  <span>Resume Stream</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <Typography variant="caption" className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
            Total Requests ({timeframe})
          </Typography>
          <div className="flex items-baseline gap-2">
            <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-0">
              142,850
            </Typography>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +14.2%
            </span>
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">Avg 20.4k requests / day</span>
        </Card>

        <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <Typography variant="caption" className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
            Average Latency (P50)
          </Typography>
          <div className="flex items-baseline gap-2">
            <Typography variant="h2" className="text-2xl font-bold text-blue-900 mb-0 font-mono">
              16.4ms
            </Typography>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              -3.8ms
            </span>
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">P95: 42ms · P99: 89ms</span>
        </Card>

        <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <Typography variant="caption" className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
            Success Rate (2xx)
          </Typography>
          <div className="flex items-baseline gap-2">
            <Typography variant="h2" className="text-2xl font-bold text-emerald-700 mb-0">
              99.98%
            </Typography>
            <span className="text-xs text-gray-400">14 errors</span>
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">Zero 5xx server downtime</span>
        </Card>

        <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <Typography variant="caption" className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1 block">
            Global Edge Cache Hit
          </Typography>
          <div className="flex items-baseline gap-2">
            <Typography variant="h2" className="text-2xl font-bold text-cyan-700 mb-0">
              93.4%
            </Typography>
            <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">
              Fast Edge
            </span>
          </div>
          <span className="text-[11px] text-gray-400 block mt-1">Offloading 133k queries</span>
        </Card>
      </div>

      {/* Traffic Chart & Content Cadence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* API Traffic Volume Bar Chart (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <Typography variant="h3" className="text-sm font-bold text-gray-900 mb-0">
                  API Request Volume &amp; Throughput
                </Typography>
                <span className="text-xs text-gray-400">Aggregated requests over {timeframe}</span>
              </div>
              <Badge variant="info" className="bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold">
                Peak: {(maxVolume).toLocaleString()} req
              </Badge>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-48 flex items-end gap-1.5 pt-8 pb-2 px-2">
              {volumePoints.map((val, idx) => {
                const heightPercent = Math.max(12, Math.round((val / maxVolume) * 100));
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer"
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-sm z-10 font-mono">
                      {val.toLocaleString()} reqs
                    </div>
                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t transition-all ${
                        idx === volumePoints.length - 1
                          ? 'bg-[var(--bear-primary-500,#1E3A8A)]'
                          : 'bg-blue-200 hover:bg-blue-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 border-t border-gray-100 pt-2 px-1">
              <span>{timeframe === '24h' ? '00:00 UTC' : timeframe === '7d' ? 'Monday' : 'Day 1'}</span>
              <span>{timeframe === '24h' ? '12:00 UTC' : timeframe === '7d' ? 'Thursday' : 'Day 15'}</span>
              <span>{timeframe === '24h' ? 'Current' : timeframe === '7d' ? 'Today' : 'Day 30'}</span>
            </div>
          </Card>

          {/* Endpoint Breakdown Table */}
          <Card variant="outlined" padding="none" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <Typography variant="h3" className="text-sm font-bold text-gray-900 mb-0">
                Top Endpoint Performance Breakdown
              </Typography>
              <span className="text-xs text-gray-400">Live REST &amp; GraphQL Telemetry</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4">Method &amp; Path</th>
                    <th className="py-2.5 px-4">Calls</th>
                    <th className="py-2.5 px-4">Avg Latency</th>
                    <th className="py-2.5 px-4">Success</th>
                    <th className="py-2.5 px-4">Edge Cache</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {ENDPOINT_METRICS.map((ep, i) => (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-mono flex items-center gap-2">
                        <Badge
                          variant="info"
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            ep.method === 'POST' ? 'bg-amber-600 text-white' : 'bg-blue-800 text-white'
                          }`}
                        >
                          {ep.method}
                        </Badge>
                        <span className="font-semibold text-gray-900">{ep.path}</span>
                      </td>
                      <td className="py-2.5 px-4 font-mono">{ep.requests.toLocaleString()}</td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-blue-900">{ep.avgLatencyMs}ms</td>
                      <td className="py-2.5 px-4 text-emerald-600 font-semibold">{ep.successRate}%</td>
                      <td className="py-2.5 px-4 font-mono text-gray-500">{ep.cacheHitRatio}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Real-Time Live Feed & Publishing Cadence (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Live Request Stream */}
          <Card variant="outlined" padding="md" className="bg-slate-950 border border-slate-800 rounded-xl shadow-sm text-gray-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Typography variant="h3" className="text-xs font-bold text-white uppercase tracking-wider mb-0">
                  Live Request Stream
                </Typography>
              </div>
              <Badge variant="outline" className="text-[10px] text-gray-400 border-slate-700">
                WebSocket
              </Badge>
            </div>

            <div className="flex flex-col gap-2 font-mono text-[11px]">
              {liveRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between animate-fadeIn"
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className={req.method === 'POST' ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
                      {req.method}
                    </span>
                    <span className="text-gray-300 truncate max-w-[130px]" title={req.path}>
                      {req.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-emerald-400 font-semibold">{req.latency}</span>
                    <span className="text-[10px] text-gray-500">{req.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Publishing Velocity & Cadence */}
          <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <Typography variant="h3" className="text-sm font-bold text-gray-900 mb-3">
              Content Publishing Cadence
            </Typography>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs text-gray-700 mb-1">
                  <span>Articles &amp; Guides</span>
                  <strong className="text-gray-900">48%</strong>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--bear-primary-500,#1E3A8A)] h-full rounded-full" style={{ width: '48%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-700 mb-1">
                  <span>Standard Pages</span>
                  <strong className="text-gray-900">24%</strong>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-700 mb-1">
                  <span>Blog Releases</span>
                  <strong className="text-gray-900">18%</strong>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-700 mb-1">
                  <span>Custom Documents</span>
                  <strong className="text-gray-900">10%</strong>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
