import axios, { AxiosError } from 'axios';

/** Custom Error class for Unlayer API errors */
export class UnlayerApiError extends Error {
  public readonly statusCode?: number;
  public readonly responseData?: unknown;
  public readonly requestData?: unknown;
  public readonly isUnlayerApiError = true; // Type guard property

  constructor(message: string, statusCode?: number, responseData?: unknown, requestData?: unknown) {
    super(message);
    this.name = 'UnlayerApiError';
    this.statusCode = statusCode;
    this.responseData = responseData;
    this.requestData = requestData;
    // Maintains proper stack trace in V8 environments (Node.js, Chrome) if available
    // Check if Error.captureStackTrace exists before calling it
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, UnlayerApiError);
    }
  }
}

/**
 * Type guard to check if an error is an instance of UnlayerApiError.
 * @param error - The error to check.
 * @returns True if the error is an UnlayerApiError, false otherwise.
 */
export function isUnlayerApiError(error: unknown): error is UnlayerApiError {
    return typeof error === 'object' && error !== null && (error as UnlayerApiError).isUnlayerApiError === true;
}

/**
 * Parses AxiosError and throws a standardized UnlayerApiError.
 * This function guarantees to throw, indicated by the `never` return type.
 * @param error - The error caught from an Axios request.
 */
export function handleApiError(error: AxiosError | Error): never {
  // Check if it's an AxiosError first
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded with a status code outside the 2xx range
      const { status, data } = error.response;
      // Attempt to get a meaningful message from the response data or fallback
      let errorMessage = 'Unknown error';
      if (typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string') {
        errorMessage = data.message;
      } else if (typeof data === 'string' && data) {
        errorMessage = data;
      }
      const message = `Unlayer API Error: Status ${status} - ${errorMessage}`;
      throw new UnlayerApiError(message, status, data, error.config?.data);
    } else if (error.request) {
      // Request was made but no response was received
      throw new UnlayerApiError(
        'Unlayer API Error: No response received from server. Check network connectivity and API endpoint.',
        undefined,
        undefined,
        error.config?.data
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new UnlayerApiError(
        `Unlayer API Error: Request setup failed - ${error.message}`
      );
    }
  } else {
    // If it's not an AxiosError, re-throw it as a generic UnlayerApiError or just re-throw
    // Decide on the best strategy: wrap it or let the original error propagate.
    // Wrapping provides consistency but might obscure the original error type.
    // For now, wrap it for consistency.
    throw new UnlayerApiError(`Unlayer API Error: An unexpected error occurred - ${error.message}`);
  }
}