import { reportApiError } from './errorBus';
import { resolveApiErrorMode } from './errorMode';
import { beginApiLoading, endApiLoading } from './loadingBus';
import { EMPTY_STRING } from '@const/strings.const';
import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_NETWORK_STATUS,
  HTTP_SPA_FALLBACK_STATUS,
  NETWORK_ERROR_MESSAGE,
  SPA_FALLBACK_MESSAGE,
} from './requestWithError.const';
import type { ApiErrorPayload, RequestWithErrorOptions } from './http.types';
import { isHtmlResponse, reasonFromCaught, requestUrl, snippet } from './requestWithError.utils';

const reportOrNotify = (
  options: RequestWithErrorOptions | undefined,
  payload: ApiErrorPayload,
): void => {
  if (options?.onError) {
    options.onError(payload);
    return;
  }
  reportApiError(payload);
};

export const requestWithError = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  options?: RequestWithErrorOptions,
): Promise<Response> => {
  const url = requestUrl(input);
  if (!options?.silent) {
    beginApiLoading();
  }
  try {
    const response = await fetch(input, init);
    if (!response.ok) {
      const body = snippet(await response.clone().text().catch(() => EMPTY_STRING));
      reportOrNotify(options, {
        mode: resolveApiErrorMode(options?.mode),
        message: options?.message || `${DEFAULT_ERROR_MESSAGE} (${response.status})`,
        code: options?.code,
        href: options?.href,
        url,
        status: response.status,
        reason: response.statusText || DEFAULT_ERROR_MESSAGE,
        response: body,
      });
      return response;
    }
    const preview = snippet(await response.clone().text().catch(() => EMPTY_STRING));
    if (isHtmlResponse(response, preview)) {
      reportOrNotify(options, {
        mode: resolveApiErrorMode(options?.mode),
        message: options?.message || SPA_FALLBACK_MESSAGE,
        code: options?.code,
        href: options?.href,
        url,
        status: HTTP_SPA_FALLBACK_STATUS,
        reason: SPA_FALLBACK_MESSAGE,
        response: preview,
      });
      return new Response(null, {
        status: HTTP_SPA_FALLBACK_STATUS,
        statusText: SPA_FALLBACK_MESSAGE,
      });
    }
    return response;
  } catch (error) {
    let reason = NETWORK_ERROR_MESSAGE;
    if (error instanceof Error) {
      reason = reasonFromCaught(error);
    }
    reportOrNotify(options, {
      mode: resolveApiErrorMode(options?.mode),
      message: options?.message || NETWORK_ERROR_MESSAGE,
      code: options?.code,
      href: options?.href,
      url,
      status: HTTP_NETWORK_STATUS,
      reason,
      response: EMPTY_STRING,
    });
    return new Response(null, { status: HTTP_NETWORK_STATUS, statusText: reason });
  } finally {
    if (!options?.silent) {
      endApiLoading();
    }
  }
};
