const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

const trimUrl = (value: string): string => value.replace(/\/$/, '');

export const isLoopbackHost = (host: string): boolean => LOOPBACK_HOSTS.has(host);

export const hostFromUrl = (value: string): string => {
  try {
    return new URL(value).hostname;
  } catch {
    return '';
  }
};

export const isLoopbackUrl = (value: string): boolean => isLoopbackHost(hostFromUrl(value));

export const browserOrigin = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
};

export const resolvePublicOrigin = (envValue: string, localFallback: string): string => {
  const env = envValue.trim();
  const origin = browserOrigin();
  if (origin) {
    const host = hostFromUrl(origin);
    if (host && !isLoopbackHost(host)) {
      if (!env || isLoopbackUrl(env)) return origin;
      return trimUrl(env);
    }
  }
  if (env) return trimUrl(env);
  return trimUrl(localFallback);
};

export const resolveApiBase = (envValue: string): string => {
  const env = envValue.trim();
  if (env && !isLoopbackUrl(env)) return trimUrl(env);
  return '';
};
