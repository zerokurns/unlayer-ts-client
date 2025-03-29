import axios, { AxiosInstance, AxiosError, Method } from 'axios';
import * as T from './types';
import { handleApiError } from './errors';

/**
 * Main client for interacting with the Unlayer Cloud API v2.
 */
export class UnlayerClient {
  private readonly apiKey: string;
  private readonly httpClient: AxiosInstance;

  /**
   * Creates an instance of the Unlayer API client.
   * @param apiKey - Your Unlayer Project API Key.
   * @param baseURL - Optional base URL for the API (defaults to production v2 URL).
   * @param timeout - Optional request timeout in milliseconds (defaults to 60000).
   */
  constructor(
    apiKey: string,
    baseURL: string = 'https://api.unlayer.com/v2',
    timeout: number = 60000 // Default timeout of 60 seconds
  ) {
    if (!apiKey) {
      throw new Error('Unlayer API key is required.');
    }
    this.apiKey = apiKey;

    // Encode API Key for Basic Auth (APIKey + ':')
    // We use Buffer for Node.js environments. For browser environments, btoa would be needed.
    // Consider adding a check or separate builds if browser support is primary.
    const encodedApiKey = Buffer.from(`${this.apiKey}:`).toString('base64');

    this.httpClient = axios.create({
      baseURL: baseURL,
      headers: {
        'Authorization': `Basic ${encodedApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: timeout,
    });

    // Optional: Add interceptors for logging or advanced error handling
    // this.httpClient.interceptors.request.use(config => {
    //   console.log('Starting Request', config);
    //   return config;
    // });
    // this.httpClient.interceptors.response.use(response => {
    //   console.log('Response:', response.status, response.data);
    //   return response;
    // });
  }

  /**
   * Private helper method to make requests and handle errors.
   * @param method - HTTP method ('get', 'post').
   * @param path - API endpoint path (e.g., '/templates').
   * @param params - Query parameters for GET requests.
   * @param data - Request body data for POST requests.
   * @returns Promise resolving to the API response data.
   */
  private async request<R>(method: Method, path: string, params?: unknown, data?: unknown): Promise<R> {
      try {
          const response = await this.httpClient.request<R>({
              method,
              url: path,
              params: params, // Axios handles query params serialization
              data: data     // Axios handles JSON body serialization for objects
          });
          // The API consistently wraps responses in { success: boolean, data: ... }
          // We might want to return response.data directly as the types expect this structure.
          return response.data;
      } catch (error) {
          // Use the centralized error handler which will throw an UnlayerApiError
          handleApiError(error as AxiosError | Error);
          // This line is unreachable due to handleApiError always throwing, but satisfies TypeScript
          throw error;
      }
  }

  // --- Export Methods ---

  /**
   * Export a design to HTML format.
   * Corresponds to `POST /export/html`
   * @param payload - The export options and design JSON.
   * @returns The exported HTML and associated chunks.
   * @throws {UnlayerApiError} If the API request fails.
   * @see https://docs.unlayer.com/reference/export-html # Replace with actual docs link if available
   */
  async exportHtml(payload: T.ExportHtmlRequest): Promise<T.ExportHtmlResponse> {
    return this.request<T.ExportHtmlResponse>('post', '/export/html', undefined, payload);
  }

  /**
   * Export a design to image (PNG) format.
   * Corresponds to `POST /export/image`
   * @param payload - The export options and design JSON.
   * @returns An object containing the URL of the generated image.
   * @throws {UnlayerApiError} If the API request fails.
   * @see https://docs.unlayer.com/reference/export-image # Replace with actual docs link if available
   */
  async exportImage(payload: T.ExportImageRequest): Promise<T.ExportImageResponse> {
    return this.request<T.ExportImageResponse>('post', '/export/image', undefined, payload);
  }

  /**
   * Export a design to PDF format.
   * Corresponds to `POST /export/pdf`
   * @param payload - The export options and design JSON.
   * @returns An object containing the URL of the generated PDF.
   * @throws {UnlayerApiError} If the API request fails.
   * @see https://docs.unlayer.com/reference/export-pdf # Replace with actual docs link if available
   */
  async exportPdf(payload: T.ExportPdfRequest): Promise<T.ExportPdfResponse> {
    return this.request<T.ExportPdfResponse>('post', '/export/pdf', undefined, payload);
  }

  /**
   * Export a design as a ZIP archive containing HTML and assets.
   * Corresponds to `POST /export/zip`
   * @param payload - The export options and design JSON.
   * @returns An object containing the URL of the generated ZIP archive.
   * @throws {UnlayerApiError} If the API request fails.
   * @see https://docs.unlayer.com/reference/export-zip # Replace with actual docs link if available
   */
  async exportZip(payload: T.ExportZipRequest): Promise<T.ExportZipResponse> {
    return this.request<T.ExportZipResponse>('post', '/export/zip', undefined, payload);
  }

  // --- Template Methods ---

  /**
   * Get a list of available templates, optionally paginated.
   * Corresponds to `GET /templates`
   * @param params - Query parameters for pagination and design inclusion.
   * @returns An object containing a list of templates.
   * @throws {UnlayerApiError} If the API request fails.
   * @see https://docs.unlayer.com/reference/list-templates # Replace with actual docs link if available
   */
  async listTemplates(params?: T.ListTemplatesParams): Promise<T.ListTemplatesResponse> {
    // Basic validation for pagination params
    if (params?.page !== undefined && params.page < 1) {
        throw new Error('Parameter \'page\' must be >= 1.');
    }
    if (params?.perPage !== undefined && params.perPage < 1) {
        throw new Error('Parameter \'perPage\' must be >= 1.');
    }
    return this.request<T.ListTemplatesResponse>('get', '/templates', params);
  }

  /**
   * Get a specific template by its ID.
   * Corresponds to `GET /templates/{id}`
   * @param id - The ID of the template to retrieve.
   * @returns The specific template details including the design JSON.
   * @throws {UnlayerApiError} If the API request fails.
   * @throws {Error} If the template ID is not provided.
   * @see https://docs.unlayer.com/reference/get-template # Replace with actual docs link if available
   */
  async getTemplate(id: string): Promise<T.GetTemplateResponse> {
    if (!id) {
        throw new Error('Template ID is required.');
    }
    return this.request<T.GetTemplateResponse>('get', `/templates/${id}`);
  }

  /**
   * Render the HTML for a specific template.
   * Corresponds to `GET /templates/{id}/render`
   * @param id - The ID of the template to render.
   * @returns The rendered HTML, chunks, and AMP details.
   * @throws {UnlayerApiError} If the API request fails.
   * @throws {Error} If the template ID is not provided.
   * @see https://docs.unlayer.com/reference/render-template-html # Replace with actual docs link if available
   */
  async renderTemplateHtml(id: string): Promise<T.RenderTemplateHtmlResponse> {
      if (!id) {
          throw new Error('Template ID is required.');
      }
      return this.request<T.RenderTemplateHtmlResponse>('get', `/templates/${id}/render`);
  }
} 