// --- Common Types ---

/**
 * Represents the Unlayer design JSON structure.
 * Replace with a more specific interface if the structure is known or becomes available.
 * Using `Record<string, any>` for now as a placeholder.
 */
export type DesignJsonObject = Record<string, any>;

/** Display mode for designs/templates */
export type DisplayMode = 'email' | 'web' | 'popup';

/** Generic success response structure */
export interface SuccessResponse {
  success: boolean;
}

// --- Export API Types ---

/** Request body for POST /export/html */
export interface ExportHtmlRequest {
  design: DesignJsonObject;
  displayMode: DisplayMode;
  mergeTags?: Record<string, any>;
  customJS?: string[];
}

/** Data structure for successful POST /export/html response */
export interface ExportHtmlResponseData {
  html: string;
  chunks: {
    body: string;
    css: string;
    js: string;
    fonts: string[];
  };
}

/** Full response for POST /export/html */
export interface ExportHtmlResponse extends SuccessResponse {
  data: ExportHtmlResponseData;
}

/** Request body for POST /export/image */
export interface ExportImageRequest {
  design: DesignJsonObject;
  displayMode: DisplayMode;
  mergeTags?: Record<string, any>;
  customJS?: string[];
  /** Generate image of the full page. Defaults to true in API. */
  fullPage?: boolean;
}

/** Data structure for successful POST /export/image response */
export interface ExportImageResponseData {
  /** URL of the exported image */
  url: string;
}

/** Full response for POST /export/image */
export interface ExportImageResponse extends SuccessResponse {
  data: ExportImageResponseData;
}

/** Request body for POST /export/pdf */
export interface ExportPdfRequest {
  design: DesignJsonObject;
  displayMode: DisplayMode;
  mergeTags?: Record<string, any>;
  customJS?: string[];
}

/** Data structure for successful POST /export/pdf response */
export interface ExportPdfResponseData {
  /** URL of the exported PDF */
  url: string;
}

/** Full response for POST /export/pdf */
export interface ExportPdfResponse extends SuccessResponse {
  data: ExportPdfResponseData;
}

/** Request body for POST /export/zip */
export interface ExportZipRequest {
  design: DesignJsonObject;
  displayMode: DisplayMode;
  mergeTags?: Record<string, any>;
  customJS?: string[];
}

/** Data structure for successful POST /export/zip response */
export interface ExportZipResponseData {
  /** URL of the exported ZIP archive */
  url: string;
}

/** Full response for POST /export/zip */
export interface ExportZipResponse extends SuccessResponse {
  data: ExportZipResponseData;
}


// --- Templates API Types ---

/** Query parameters for GET /templates */
export interface ListTemplatesParams {
  /** Current page. Default: 1, Min: 1 */
  page?: number;
  /** Number of templates to fetch per page. Default: 10, Min: 1 */
  perPage?: number;
  /** Should the result include design json (1) or not (0). Default: 1 */
  includeDesign?: 0 | 1;
}

/** Individual Template structure (as returned by list and get) */
export interface Template {
  /** Template ID */
  id: string;
  /** Template name */
  name: string;
  /**
   * Template design JSON.
   * Only included in list responses if includeDesign=1.
   * Always included in get responses.
   */
  design?: DesignJsonObject;
  /** Template display mode */
  displayMode: DisplayMode;
  /** Template updated at (ISO 8601 date string) */
  updatedAt: string;
  /** Template created at (ISO 8601 date string) */
  createdAt: string;
}

/** Full response for GET /templates */
export interface ListTemplatesResponse extends SuccessResponse {
  data: Template[];
  // Note: The OpenAPI spec doesn't explicitly define pagination fields (like totalPages, totalItems)
  // in the response schema, although the parameters suggest pagination. Add them here if the
  // actual API response includes them.
  // Example:
  // total_pages?: number;
  // current_page?: number;
  // per_page?: number;
  // total_items?: number;
}

/** Full response for GET /templates/{id} */
export interface GetTemplateResponse extends SuccessResponse {
  /** Contains the specific template details, including the design JSON. */
  data: Template;
}

// --- Template Render API Types ---

/** AMP Validation structure */
export interface AmpValidation {
  status: string;
  errors: unknown[];
}

/** AMP details structure */
export interface AmpDetails {
  enabled: boolean;
  format: string;
  validation?: AmpValidation;
}

/** Rendered template chunks structure */
export interface TemplateChunks {
  body: string;
  css: string;
  js: string;
  fonts: string[];
  tags: string[];
}

/** Data structure for successful GET /templates/{id}/render response */
export interface RenderTemplateHtmlResponseData {
    html: string;
    chunks: TemplateChunks;
    amp?: AmpDetails;
}

/** Full response for GET /templates/{id}/render */
export interface RenderTemplateHtmlResponse extends SuccessResponse {
    data: RenderTemplateHtmlResponseData;
} 