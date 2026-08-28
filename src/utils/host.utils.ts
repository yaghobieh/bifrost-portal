import { LOOPBACK_HOSTS, RETIRED_CMS_API_HOST } from '@const/hosts.const';

const LOOPBACK_HOST_SET = new Set<string>(LOOPBACK_HOSTS);

const trimUrl = (value: string): string => value.replace(/\/$/, '');

export const isLoopbackHost = (host: string): boolean => LOOPBACK_HOST_SET.has(host);

export const hostFromUrl = (value: string): string => {
  try {
    return new URL(value).hostname;
  } catch {
    return '';
  }
};

export const isLoopbackUrl = (value: string): boolean => isLoopbackHost(hostFromUrl(value));

export const isRetiredApiHost = (host: string): boolean => host === RETIRED_CMS_API_HOST;

export const isRetiredApiUrl = (value: string): boolean => isRetiredApiHost(hostFromUrl(value));

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
      if (!env || isLoopbackUrl(env) || isRetiredApiUrl(env)) {
        return origin;
      }
      return trimUrl(env);
    }
  }
  if (env && !isRetiredApiUrl(env)) {
    return trimUrl(env);
  }
  return trimUrl(localFallback);
};

export const resolveApiBase = (envValue: string): string => {
  const env = envValue.trim();
  if (!env || isLoopbackUrl(env) || isRetiredApiUrl(env)) {
    return '';
  }
  const origin = browserOrigin();
  if (origin && !isLoopbackHost(hostFromUrl(origin))) {
    return '';
  }
  return trimUrl(env);
};
