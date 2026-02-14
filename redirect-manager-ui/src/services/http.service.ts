import { AuthService } from './auth.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export class HttpService {
  /**
   * Validates and retrieves the authentication token
   * @throws Error if no token is found
   */
  private static getAuthToken(): string {
    const token = AuthService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return token;
  }

  /**
   * Creates headers with authentication token
   */
  private static getAuthHeaders(token: string): HeadersInit {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Handles 401 unauthorized errors by refreshing the token and retrying the request
   * @throws Error with the appropriate message
   */
  private static async handle401WithTokenRefresh(response: Response, originalRequest: () => Promise<Response>): Promise<Response> {
    if (response.status === 401) {
      try {
        // Try to refresh the token
        await AuthService.refresh();
        // If refresh successful, retry the original request
        return await originalRequest();
      } catch {
        // If refresh fails, then we are truly unauthorized
        AuthService.removeToken();
        throw new Error('Unauthorized. Please login again.');
      }
    }
    
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  /**
   * Parses error message from response
   */
  private static async getErrorMessage(response: Response): Promise<string> {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    return error.message || `HTTP error! status: ${response.status}`;
  }

  /**
   * Determines if an HTTP status code should trigger a retry
   * @param status HTTP status code
   * @returns true if the error should be retried
   */
  private static isRetriableError(status: number): boolean {
    // Don't retry on 40x errors (except 401 which is handled separately)
    if (status >= 400 && status < 500 && status !== 401) {
      return false;
    }

    // Don't retry on 500 Internal Server Error
    if (status === 500) {
      return false;
    }

    // Retry on other errors like:
    // - 502 Bad Gateway
    // - 503 Service Unavailable
    // - 504 Gateway Timeout
    return true;
  }

  /**
   * Waits for a delay with exponential backoff
   */
  private static async waitWithBackoff(attempt: number, initialDelay: number, errorMessage: string, maxRetries: number): Promise<void> {
    const delay = initialDelay * Math.pow(2, attempt);
    console.warn(`Request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`, errorMessage);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Handles response and determines if retry should continue
   * @returns Object with shouldContinue flag and optional response
   */
  private static async handleResponse(
    response: Response,
    makeRequest: () => Promise<Response>,
    attempt: number,
    maxRetries: number
  ): Promise<{ shouldContinue: boolean; response?: Response; error?: Error }> {
    if (response.ok) {
      return { shouldContinue: false, response };
    }

    if (response.status === 401) {
      const refreshedResponse = await this.handle401WithTokenRefresh(response, makeRequest);
      return { shouldContinue: false, response: refreshedResponse };
    }

    const errorMessage = await this.getErrorMessage(response);
    const error = new Error(errorMessage);

    // Don't retry on non-retriable errors or last attempt
    if (!this.isRetriableError(response.status) || attempt === maxRetries) {
      return { shouldContinue: false, error };
    }

    return { shouldContinue: true, error };
  }

  /**
   * Executes a request with automatic retry on 401 errors and transient failures
   * @param makeRequest Function that creates and executes the request
   * @param maxRetries Maximum number of retry attempts (default: 3)
   * @param initialDelay Initial delay in ms before first retry (default: 1000)
   * @returns Response object
   * @throws Error if request fails after all retries
   */
  private static async executeWithRetry(
    makeRequest: () => Promise<Response>,
    maxRetries: number = 3,
    initialDelay: number = 1000
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await makeRequest();
        const result = await this.handleResponse(response, makeRequest, attempt, maxRetries);

        if (!result.shouldContinue) {
          if (result.response) {
            return result.response;
          }
          lastError = result.error || new Error('Request failed');
          break;
        }

        lastError = result.error || new Error('Request failed');
        await this.waitWithBackoff(attempt, initialDelay, lastError.message, maxRetries);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        if (attempt === maxRetries) {
          break;
        }

        await this.waitWithBackoff(attempt, initialDelay, lastError.message, maxRetries);
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  static async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    const makeRequest = async () => {
      const token = this.getAuthToken();
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }
      return fetch(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders(token),
        credentials: 'include',
      });
    };

    const response = await this.executeWithRetry(makeRequest);
    return response.json();
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    const makeRequest = async () => {
      const token = this.getAuthToken();
      return fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(data),
        credentials: 'include',
      });
    };

    const response = await this.executeWithRetry(makeRequest);
    return response.json();
  }

  static async put<T>(endpoint: string, data: unknown): Promise<T> {
    const makeRequest = async () => {
      const token = this.getAuthToken();
      return fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(data),
        credentials: 'include',
      });
    };

    const response = await this.executeWithRetry(makeRequest);
    return response.json();
  }

  static async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const makeRequest = async () => {
      const token = this.getAuthToken();
      return fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(data),
        credentials: 'include',
      });
    };

    const response = await this.executeWithRetry(makeRequest);
    return response.json();
  }

  static async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    const makeRequest = async () => {
      const token = this.getAuthToken();
      return fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(token),
        body: data ? JSON.stringify(data) : undefined,
        credentials: 'include',
      });
    };

    const response = await this.executeWithRetry(makeRequest);

    // DELETE might return empty response
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }
}
