import { reportApiError } from './errorBus';
import { resolveApiErrorMode } from './errorMode';
import { beginApiLoading, endApiLoading } from './loadingBus';
import { EMPTY_STRING } from '@const/strings.const';
import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_NETWORK_STATUS,
  NETWORK_ERROR_MESSAGE,
} from './requestWithError.const';
import type { ApiErrorPayload, RequestWithErrorOptions } from './http.types';
import { reasonFromCaught, requestUrl, snippet } from './requestWithError.utils';

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
      const payload: ApiErrorPayload = {
        mode: resolveApiErrorMode(options?.mode),
        message: options?.message || `${DEFAULT_ERROR_MESSAGE} (${response.status})`,
        code: options?.code,
        href: options?.href,
        url,
        status: response.status,
        reason: response.statusText || DEFAULT_ERROR_MESSAGE,
        response: body,
      };
      if (options?.onError) {
        options.onError(payload);
      } else {
        reportApiError(payload);
      }
    }
    return response;
  } catch (error) {
    let reason = NETWORK_ERROR_MESSAGE;
    if (error instanceof Error) {
      reason = reasonFromCaught(error);
    }
    const payload: ApiErrorPayload = {
      mode: resolveApiErrorMode(options?.mode),
      message: options?.message || NETWORK_ERROR_MESSAGE,
      code: options?.code,
      href: options?.href,
      url,
      status: HTTP_NETWORK_STATUS,
      reason,
      response: EMPTY_STRING,
    };
    if (options?.onError) {
      options.onError(payload);
    } else {
      reportApiError(payload);
    }
    return new Response(null, { status: HTTP_NETWORK_STATUS, statusText: reason });
  } finally {
    if (!options?.silent) {
      endApiLoading();
    }
  }
};
