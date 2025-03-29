# Unlayer TypeScript Client (`@zerokurns/unlayer-ts-client`)

[![npm version](https://badge.fury.io/js/%40zerokurns%2Funlayer-ts-client.svg)](https://badge.fury.io/js/%40zerokurns%2Funlayer-ts-client)
[![GitHub Repo stars](https://img.shields.io/github/stars/zerokurns/unlayer-ts-client?style=social)](https://github.com/zerokurns/unlayer-ts-client)
<!-- Add other badges if you set up CI/Coverage: e.g., Travis, Codecov -->

A TypeScript client library for interacting with the [Unlayer Cloud API (v2)](https://docs.unlayer.com/reference/api-overview).

Provides typed methods for managing templates and exporting designs as HTML, Images, PDFs, or ZIP archives.

## Features

*   Fully typed requests and responses based on the Unlayer API v2 OpenAPI specification.
*   Async/await interface for all API calls.
*   Handles authentication (Basic Auth with API Key) automatically.
*   Provides specific error types (`UnlayerApiError`) for easier error handling.
*   Written in TypeScript, with generated type definitions.

## Installation

```bash
npm install @zerokurns/unlayer-ts-client
# or
yarn add @zerokurns/unlayer-ts-client
```

*(Note: Make sure you have Node.js installed.)*

## Usage

### Initialization

Import the client and instantiate it with your Unlayer Project API Key.

```typescript
import { UnlayerClient, isUnlayerApiError } from '@zerokurns/unlayer-ts-client';

const apiKey = 'YOUR_UNLAYER_PROJECT_API_KEY'; // Replace with your actual key
const unlayer = new UnlayerClient(apiKey);

// You can optionally provide a custom base URL or timeout
// const unlayerCustom = new UnlayerClient(apiKey, 'https://custom.api.endpoint/v2', 30000);
```

### Examples

All methods return Promises.

#### List Templates

```typescript
import { UnlayerClient, isUnlayerApiError } from '@zerokurns/unlayer-ts-client'; // Import needed if in separate file

async function listMyTemplates() {
  try {
    const params = { page: 1, perPage: 20, includeDesign: 0 }; // Optional params
    const response = await unlayer.listTemplates(params);

    if (response.success) {
      console.log(`Found ${response.data.length} templates:`);
      response.data.forEach(template => {
        console.log(`- ${template.name} (ID: ${template.id})`);
      });
    } else {
      console.error('API call failed, but no error was thrown.');
    }
  } catch (error) {
    if (isUnlayerApiError(error)) {
      console.error(`Unlayer API Error (${error.statusCode}): ${error.message}`,
                    `Response Data:`, error.responseData);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

listMyTemplates();
```

#### Get a Specific Template

```typescript
import { UnlayerClient, isUnlayerApiError } from '@zerokurns/unlayer-ts-client'; // Import needed

async function getMyTemplate(templateId: string) {
  try {
    const response = await unlayer.getTemplate(templateId);
    if (response.success) {
      console.log('Template Name:', response.data.name);
      console.log('Design JSON:', response.data.design); // Design JSON is included
    }
  } catch (error) {
    // ... (error handling as above)
    console.error('Error getting template:', error);
  }
}

getMyTemplate('your_template_id'); // Replace with a real ID
```

#### Render Template HTML

```typescript
import { UnlayerClient, isUnlayerApiError } from '@zerokurns/unlayer-ts-client'; // Import needed

async function renderMyTemplate(templateId: string) {
  try {
    const response = await unlayer.renderTemplateHtml(templateId);
    if (response.success) {
      console.log('Rendered HTML:');
      console.log(response.data.html);
      console.log('CSS:', response.data.chunks.css);
      // ... access other chunks/amp details
    }
  } catch (error) {
    // ... (error handling as above)
    console.error('Error rendering template:', error);
  }
}

renderMyTemplate('your_template_id');
```

#### Export Design to HTML

```typescript
import { UnlayerClient, isUnlayerApiError, DesignJsonObject, DisplayMode } from '@zerokurns/unlayer-ts-client';

async function exportDesignHtml(design: DesignJsonObject) {
  try {
    const response = await unlayer.exportHtml({
      design: design, // Your Unlayer design JSON object
      displayMode: 'email', // or 'web' or 'popup'
      // mergeTags: { firstName: 'John' } // Optional merge tags
    });
    if (response.success) {
      console.log('Exported HTML:', response.data.html);
    }
  } catch (error) {
    // ... (error handling as above)
    console.error('Error exporting HTML:', error);
  }
}

const myDesign: DesignJsonObject = { /* ... your design JSON ... */ };
exportDesignHtml(myDesign);
```

#### Export Design to Image (PNG)

```typescript
import { UnlayerClient, isUnlayerApiError, DesignJsonObject, DisplayMode } from '@zerokurns/unlayer-ts-client';

async function exportDesignImage(design: DesignJsonObject) {
  try {
    const response = await unlayer.exportImage({
      design: design,
      displayMode: 'email',
      // fullPage: false // Optional, defaults to true
    });
    if (response.success) {
      console.log('Exported Image URL:', response.data.url);
    }
  } catch (error) {
    // ... (error handling as above)
    console.error('Error exporting image:', error);
  }
}

const myDesign: DesignJsonObject = { /* ... your design JSON ... */ };
exportDesignImage(myDesign);
```

*(Examples for `exportPdf` and `exportZip` follow the same pattern as `exportImage`.)*

### Error Handling

The client throws an `UnlayerApiError` for API-related errors (e.g., invalid API key, bad request, server errors). You can use the `isUnlayerApiError` type guard to check for this specific error type.

```typescript
import { isUnlayerApiError } from '@zerokurns/unlayer-ts-client';

try {
  // await unlayer.someMethod(...)
} catch (error) {
  if (isUnlayerApiError(error)) {
    // Access specific properties:
    console.error('Status Code:', error.statusCode);
    console.error('API Message:', error.message);
    console.error('Response Data:', error.responseData);
  } else {
    // Handle other unexpected errors (network issues, etc.)
    console.error('Non-API Error:', error);
  }
}
```

Input validation errors (e.g., missing required ID, invalid pagination parameters) will throw a standard `Error` before an API call is made.

## API Reference

This client covers the following Unlayer Cloud API v2 endpoints:

*   **Templates**
    *   `listTemplates(params?)`: `GET /templates`
    *   `getTemplate(id)`: `GET /templates/{id}`
    *   `renderTemplateHtml(id)`: `GET /templates/{id}/render`
*   **Exports**
    *   `exportHtml(payload)`: `POST /export/html`
    *   `exportImage(payload)`: `POST /export/image`
    *   `exportPdf(payload)`: `POST /export/pdf`
    *   `exportZip(payload)`: `POST /export/zip`

For detailed parameter and response structures, please refer to the TypeScript types exported by the library (e.g., `ListTemplatesParams`, `ListTemplatesResponse`, `ExportHtmlRequest`, `ExportHtmlResponse`, etc.) or the [Official Unlayer API Documentation](https://docs.unlayer.com/reference/api-overview).

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/zerokurns/unlayer-ts-client.git
cd unlayer-ts-client
npm install
```

**Available Scripts:**

*   `npm run lint`: Lint the code using ESLint.
*   `npm run test`: Run unit tests using Jest.
*   `npm run build`: Compile TypeScript to JavaScript in the `dist` folder.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/zerokurns/unlayer-ts-client).

## License

[MIT](./LICENSE) 