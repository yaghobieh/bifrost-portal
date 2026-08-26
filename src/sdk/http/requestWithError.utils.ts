import { TYPE_STRING } from '@const/strings.const';
import { NETWORK_ERROR_MESSAGE, RESPONSE_SNIPPET_MAX } from './requestWithError.const';

export const requestUrl = (input: RequestInfo | URL): string => {
  if (typeof input === TYPE_STRING) {
    return input as string;
  }
  if (input instanceof URL) {
    return input.href;
  }
  if (input instanceof Request) {
    return input.url;
  }
  return String(input);
};

export const snippet = (value: string): string => {
  if (value.length > RESPONSE_SNIPPET_MAX) {
    return value.slice(0, RESPONSE_SNIPPET_MAX);
  }
  return value;
};

export const reasonFromCaught = (error: Error | string): string => {
  if (error instanceof Error) {
    if (error.message) {
      return error.message;
    }
    return NETWORK_ERROR_MESSAGE;
  }
  if (error) {
    return error;
  }
  return NETWORK_ERROR_MESSAGE;
};
