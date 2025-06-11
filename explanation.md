# Glosa Electrónica "Cargo Claro" - Detailed System Explanation

## 1. High-Level Overview

The project, named "Cargo Claro," is a **Next.js web application** meticulously designed as a **"glosa electrónica para agencias aduanales"** (electronic customs declaration review system for customs agencies). Its primary mission is to automate, streamline, and enhance the accuracy of reviewing and validating customs documents (such as "pedimentos," invoices, COVEs - Comprobante de Valor Electrónico) for import and export operations in Mexico.

The system aims to serve as a compliance ai workflow for customs brokers:
*   Facilitating the upload of diverse customs documents.
*   Intelligently extracting structured data from various formats, including complex XML CFDI files and PDFs.
*   Accurately classifying the type of each uploaded document.
*   Performing a comprehensive suite of validations. This includes cross-referencing data points (e.g., weights, declared values, number of packages) between different documents and verifying compliance with Mexican customs regulations (NOMS - Normas Oficiales Mexicanas, aranceles/tariffs, identificadores/identifiers as per Anexo 22).
*   Securely storing the detailed results of each analysis, including the context data used for every validation step, for user review, reporting, and auditing.
*   Potentially leveraging AI/Large Language Models (LLMs) to augment processes like document classification, data extraction, and risk analysis.

## 2. Technologies Used

The application is constructed using a modern, robust, and type-safe technology stack:

*   **Frontend Framework**: Next.js (v15) utilizing the App Router, with React (v19) for building the user interface and TypeScript for type safety.
    *   **UI Styling**: Tailwind CSS for utility-first styling, PostCSS for CSS transformations, Radix UI for accessible, unstyled primitive components (like tabs, dialogs), and Lucide Icons for a comprehensive icon set.
    *   **Theming**: `next-themes` enables light/dark mode functionality.
    *   **Client-side Server State Management**: TanStack Query (React Query) is employed for efficient data fetching, caching, optimistic updates, and synchronization of server state on the client.
*   **Backend/API**:
    *   **API Layer**: tRPC facilitates the creation of fully type-safe APIs, ensuring seamless data contracts between the frontend and backend.
    *   **Server-side Logic**: Implemented using Next.js API Routes, Server Components, and Server Actions.
*   **Database**:
    *   **Database System**: Neon, a serverless Postgres platform, providing scalability and managed database services.
    *   **ORM (Object-Relational Mapper)**: Drizzle ORM is used for database interactions, schema definition (in `db/schema.ts`), and migrations (`drizzle-kit`).
*   **Authentication & Authorization**: Clerk handles user authentication (sign-up, sign-in, session management) and user management. It's configured with Mexican Spanish localizations (`esMX`).
*   **File Handling**:
    *   **Uploads**: `uploadthing` for managing file uploads to a storage provider.
    *   **XML Processing**: `fast-xml-parser` for parsing XML documents, particularly important for CFDI (Comprobante Fiscal Digital por Internet - Mexican electronic invoices) and Pedimento XMLs.
    *   **PDF Processing**: `pdf-lib` for manipulating and potentially extracting data from PDF documents.
*   **AI & Observability**:
    *   **AI SDKs**: The presence of `@ai-sdk/anthropic`, `@ai-sdk/google`, and `@ai-sdk/openai` indicates planned or existing integrations with LLMs from these providers.
    *   **LLM Tracing & Debugging**: `langfuse` and `langfuse-vercel` are used for tracing the execution of LLM-augmented processes, providing observability into AI interactions.
    *   **General Observability**: OpenTelemetry (via `@opentelemetry/*` and `@vercel/otel`) is integrated for collecting metrics, logs, and traces, aiding in performance monitoring and debugging.
*   **Development & Tooling**:
    *   **Language**: TypeScript throughout the stack.
    *   **Code Quality (Linting/Formatting)**: BiomeJS for maintaining consistent code style and identifying potential issues.
    *   **Dependency & Export Analysis**: Knip helps identify unused files, dependencies, and exports.
    *   **Testing**:
        *   Vitest for unit and integration testing.
        *   Playwright for end-to-end testing, simulating user interactions in a browser environment. Setup includes fixtures (`lib/playwright/fixture.ts`) and global setup (`lib/playwright/global.setup.ts`).
    *   **Schema Declaration & Validation**: Zod for declaring and validating data schemas, with `zod-form-data` for handling HTML form data.
    *   **Deployment**: Likely deployed on Vercel, inferred from Vercel-specific packages (`@vercel/otel`, `langfuse-vercel`) and common Next.js deployment practices.
    *   **Environment Variables**: Managed via `@t3-oss/env-nextjs` (see `lib/env/client.ts` and `lib/env/server.ts`) for type-safe environment variable access.
    *   **Utility Libraries**:
        *   `moment`: For date and time manipulation.
        *   `neverthrow`: For robust functional error handling, making success and failure paths explicit.
        *   `clsx`, `tailwind-merge`: Utilities for conditional class name generation with Tailwind CSS.

## 3. Detailed Project Structure and Key Modules

The project adheres to a well-organized structure, leveraging Next.js App Router conventions:

### 3.1. `app/` - Core Application Logic

*   **`app/layout.tsx`**: The root layout for the entire application. It defines the main `<html>` and `<body>` structure and wraps children with global context providers:
    *   `ClerkProvider`: For authentication.
    *   `QueryClientProvider` (from `app/shared/components/providers/query-client-provider.tsx`): For TanStack Query.
    *   `ThemeComponent` (from `app/shared/components/providers/theme-component.tsx`): For `next-themes`.
*   **`app/styles/globals.css`**: Global CSS styles and Tailwind CSS base styles/directives.
*   **`app/not-found.tsx`**: Custom page for 404 errors.

*   **`app/(dashboard)/` - Authenticated User Dashboard**: This route group contains all pages and components accessible after user login.
    *   **`app/(dashboard)/layout.tsx`**: Defines the main dashboard structure, typically including:
        *   `Sidebar` (from `app/(dashboard)/components/sidebar.tsx`): For navigation within the dashboard.
        *   `Header` (from `app/(dashboard)/components/Header/header.tsx`): Contains user profile information (via `profile-menu.tsx`) and potentially notifications.
        *   `Main` (from `app/(dashboard)/components/main.tsx`): A wrapper for the primary content area of each dashboard page.
    *   **`app/(dashboard)/home/` - Dashboard Home Page**:
        *   `page.tsx`: The main landing page after login.
        *   `components/`:
            *   `Header/gloss-form.tsx`: The UI form used by users to initiate a new "glosa" by selecting and uploading document files.
            *   `DailyGlossesGraph/index.tsx`: A component to display a graph of "glosa" activity over time.
            *   `GlossHistory/index.tsx`: Likely a table or list view of previously processed "glosas."
            *   `my-info.tsx`: Displays user-specific information.
            *   `summary.tsx`: Shows summary statistics related to the user's "glosa" activities.
    *   **`app/(dashboard)/gloss/` - Glosa Management & Viewing**:
        *   `page.tsx`: Likely displays a table of all "glosas" (using `app/(dashboard)/gloss/components/GlossTable/`).
        *   `components/GlossTable/`: Contains components for a sortable, filterable data table:
            *   `columns.tsx`: Defines the columns for the "glosas" table.
            *   `data-table.tsx`: The generic data table component.
        *   **`app/(dashboard)/gloss/[id]/analysis/` - Detailed Glosa Analysis View**:
            *   `page.tsx`: The main page for displaying the detailed analysis of a specific "glosa" (identified by `[id]`).
            *   `components/`:
                *   `Analysis/detailed.tsx`: Renders the core validation results, showing sections, individual validation steps, their status (pass/fail), and the context data used for each check. This is where the user sees the detailed breakdown of the glosa.
                *   `Analysis/styles.css`: Specific styles for the detailed analysis view.
                *   `documents.tsx`: A component to display the uploaded documents associated with the "glosa," potentially using the `components/pdf-carousel/pdf-carousel-viewer.tsx` for PDF viewing.
                *   `pediment-analysis-n-finish.tsx`, `saved-n-finish.tsx`: Components providing user actions like marking analysis as complete or saving progress.
    *   **`app/(dashboard)/test/`**: Contains test files, including sample PDFs (`A-66151 COVE.pdf`, etc.) and a test script (`glosa.test.ts`), likely for Playwright or Vitest.

*   **`app/shared/` - Shared Application Resources**:
    *   **`components/`**: Globally shared React components.
        *   `cards/generic-card.tsx`: A reusable card component.
        *   `loading-bar.tsx`: A visual indicator for loading states.
        *   `modal.tsx`: A base modal component (likely used with `app/shared/hooks/use-modal.tsx`).
        *   `providers/`: Client-side context providers (`QueryClientProvider`, `ThemeComponent`).
    *   **`hooks/`**: Shared custom React Hooks (e.g., `use-modal.tsx` for managing modal states).
    *   **`icons/`**: A collection of custom SVG icon components.
    *   **`interfaces/`**: Shared TypeScript type definitions and interfaces.
    *   **`utils/`**: Shared utility functions (e.g., `app/shared/utils/today-is.ts`).
    *   **`app/shared/services/customGloss/` - Core Business Logic for "Glosa Electrónica"**: This is the engine of the application.
        *   **`controller.ts`**: The central orchestrator for the entire "glosa" process. It defines tRPC mutations (like `analysis`) that manage the workflow from file upload to saving results.
        *   **`upload-files.ts`**: Service responsible for handling the actual file uploads (likely integrating with `uploadthing`).
        *   **`classification/`**:
            *   `classification.ts`: Logic to determine the type of each uploaded document (Pedimento, Factura, COVE, etc.). May involve heuristics or AI.
            *   `create-expediente-without-data.ts`: Creates an initial data structure for the "expediente" (case file) based on classified documents, before full data extraction.
        *   **`extract-and-structure/`**: Modules for extracting data from different document types and transforming it into a consistent JSON structure.
            *   `cfdi/`: Logic for CFDI XMLs (`extract-and-structure-cfdi.ts`, `xml-parser.ts`, `xml-to-json.ts`).
            *   `cove/`: Logic for COVE documents (`extract-and-structure-cove.ts`).
            *   `packing-list/`: Logic for Packing Lists (`extract-and-structure-packing-list.ts`).
            *   `pedimento/`: Logic for Pedimento documents (`extract-and-structure-pedimento.ts`).
            *   `index.ts`: Likely exports the main extraction function that delegates to type-specific extractors.
            *   **`schemas/`**: Defines the Zod schemas for the structured JSON output of each document type (e.g., `cfdi.ts`, `cove.ts`, `pedimento.ts`). This ensures data consistency.
        *   **`glosa/` - Core Validation and Equivalence Logic**:
            *   `impo.ts` & `expo.ts`: Orchestrate the validation sequences for import and export operations, respectively. They call specific validation step modules.
            *   `validation-result.ts`: A utility or class for standardizing the structure of validation results.
            *   `exchange-rate.ts`: Service to fetch or calculate exchange rates if needed for value conversions.
            *   `tax-finder.ts`: Service to determine applicable taxes or tariffs.
            *   **`anexo-22/`**: Contains modules corresponding to appendices of "Anexo 22" of the "Reglas Generales de Comercio Exterior." These are critical for Mexican customs operations as they define official catalogs (e.g., customs office codes, identifiers, units of measure).
                *   `apendice-2.ts` (Claves de Pedimento), `apendice-10.ts` (Identificadores a Nivel Pedimento), etc. These modules likely load or embed data from `public/assets/jsons/anexo_22/` or define logic based on these appendices.
            *   **`cove/validation_steps_impo/` & `cove/validation_steps_expo/`**: Contain individual validation functions for COVE documents, broken down by logical sections (e.g., `1.datos-generales.ts`, `3.validacion-mercancias.ts`).
            *   **`pedimento/validation_steps_impo/` & `pedimento/validation_steps_expo/`**: Contain individual validation functions for Pedimento documents, structured by sections of the Pedimento (e.g., `1.numero-de-pedimento.ts`, `6.datos-de-factura.ts`, `9.partidas.ts`, `identificadores.ts`). This is where much of the detailed cross-document validation logic resides.

### 3.2. `components/` - Top-Level Reusable UI Components (More Complex)

*   **`cove/`**:
    *   `cove-viewer.tsx`: A sophisticated component to render the structured data extracted from a COVE document in a user-friendly way.
    *   `first-page.tsx`, `merchandise-page.tsx`, `recipient-page.tsx`: Sub-components for different sections of the COVE viewer.
    *   `utils/highlight-styles.ts`: Utilities to apply dynamic styling, possibly for highlighting discrepancies or important fields.
*   **`pdf-carousel/`**:
    *   `pdf-carousel-viewer.tsx`: A component to display multiple PDF documents in a carousel or tabbed interface, allowing users to switch between them easily.
*   **`pedimento/`**:
    *   `pedimento-viewer.tsx`: A comprehensive component for displaying the structured data of a Pedimento.
    *   Multiple sub-components for different Pedimento sections (e.g., `pedimento-header.tsx`, `pedimento-importador.tsx`, `pedimento-partidas.tsx`, `identificadores/identificadores-table.tsx`).
    *   `utils/highlight-styles.ts`: Similar to COVE viewer, for highlighting data.

### 3.3. `db/` - Database Configuration

*   **`schema.ts`**: Defines all database tables, columns, types (like `pgEnum`), and relations using Drizzle ORM syntax. This is the single source of truth for the database structure.
*   **`index.ts`**: Initializes and exports the Drizzle client instance, configured to connect to the Neon database.
*   **`reset.ts`**: A script (runnable with `tsx`) to clear or reset the database to a default state, useful for development and testing.

### 3.4. `lib/` - General Libraries and Utilities

*   **`env/`**:
    *   `client.ts` & `server.ts`: Use `@t3-oss/env-nextjs` to define and validate environment variables for client-side and server-side use, ensuring type safety.
*   **`playwright/`**: Configuration and utilities for Playwright end-to-end tests.
*   **`trpc.ts`**: Initializes and configures the tRPC server and client procedures.
*   **`utils.ts`**: General utility functions shared across the application (e.g., the `cn` function for conditional class names from `shadcn/ui`).
*   **`vitest/utils.ts`**: Utilities or custom matchers for Vitest unit tests.

### 3.5. `public/` - Static Assets

*   Various PDF files for testing (e.g., `PEDIMENTO.pdf`, `ANOTHER_PEDIMENT.PDF`).
*   **`assets/fonts/`**: Font files (e.g., NotoEmoji).
*   **`assets/images/`**: Image assets like logos (`logo.webp`).
*   **`assets/jsons/`**:
    *   `VICTOR_RESPONSE.json`: A sample JSON response, possibly for testing or mock data.
    *   **`anexo_22/`**: Contains JSON files representing data from various appendices of "Anexo 22" (e.g., `10_identificadores_nivel_pedimento.json`, `1_encabezado_principal_de_pedimento.json`). This static data is crucial for validating Pedimento fields against official customs catalogs. It's likely loaded and used by the services in `app/shared/services/customGloss/glosa/anexo-22/`.
*   `favicon.ico`.

### 3.6. Configuration Files (Root Level)

*   `next.config.ts`: Next.js configuration.
*   `package.json`: Project dependencies, scripts (including `pnpm qa:fix`, `pnpm dev`, `db:push`, etc.).
*   `tsconfig.json`: TypeScript compiler options.
*   `drizzle.config.ts`: Configuration for Drizzle Kit (for migrations).
*   `biome.json`: Biome linter/formatter configuration.
*   `middleware.ts`: Defines request middleware, primarily for Clerk authentication.

## 4. Authentication Flow

*   User authentication is managed by **Clerk**, providing robust sign-up, sign-in, and session management.
*   The **`middleware.ts`** file, using `clerkMiddleware`, acts as a gatekeeper for most routes.
*   The `await auth.protect()` call within the middleware ensures that any attempt to access a protected route without a valid session redirects the user to Clerk's hosted sign-in page.
*   The configuration `matcher` in `middleware.ts` specifies which routes are subject to this protection, effectively securing the entire dashboard (`/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)`) and all API/tRPC routes (`/(api|trpc)(.*)`).
*   Upon successful authentication, Clerk makes user information (like `userId`) available in the server-side context (e.g., to tRPC procedures and Server Components), enabling personalized data access and operations.

## 5. Core "Glosa Electrónica" Process (Enhanced Detail)

The primary business logic resides within the `analysis` tRPC mutation in `app/shared/services/customGloss/controller.ts`. This is an intricate, multi-step process:

1.  **File Submission (UI -> Controller)**: The user initiates a "glosa" via the `app/(dashboard)/home/components/Header/gloss-form.tsx` by selecting and uploading customs documents. These files are sent to the `analysis` tRPC mutation.
2.  **Langfuse Tracing**: The process is wrapped in a `Langfuse` trace (`Glosa de Pedimento`) for end-to-end observability of this complex operation, including any AI/LLM steps.
3.  **Document Classification (`app/shared/services/customGloss/classification/classification.ts`)**:
    *   Each uploaded file is analyzed to determine its type (Pedimento XML, Pedimento PDF, COVE XML, Factura PDF, Packing List PDF, NOM certificate, etc.). This might involve checking file names, MIME types, or even content analysis (potentially with AI).
    *   A Langfuse event `Classification` is logged.
4.  **Initial Record ("Expediente") Creation (`app/shared/services/customGloss/classification/create-expediente-without-data.ts`)**:
    *   Based on the document classifications, an in-memory data structure (the "expediente") is created. This structure acts as a container for the documents and their future extracted data. It's "without data" initially, meaning it only knows about the files and their types.
5.  **Data Extraction and Structuring (`app/shared/services/customGloss/extract-and-structure/index.ts` and sub-modules)**:
    *   This is a critical phase where content is extracted from each document and transformed into a standardized JSON format defined by Zod schemas in `app/shared/services/customGloss/extract-and-structure/schemas/`.
    *   **CFDI (XML)**: `xml-to-json.ts` and `extract-and-structure-cfdi.ts` handle parsing of CFDI XMLs.
    *   **COVE (XML/PDF)**: `extract-and-structure-cove.ts` processes COVE documents.
    *   **Packing List (PDF/Other)**: `extract-and-structure-packing-list.ts`.
    *   **Pedimento (XML/PDF)**: `extract-and-structure-pedimento.ts`.
    *   The `Pedimento` and `COVE` types imported in `db/schema.ts` (from `@/shared/services/customGloss/extract-and-structure/schemas`) indicate that the fully structured JSON for these key documents is stored directly in the database.
    *   A Langfuse event `Extract and Structure` is logged.
6.  **Operation Type Validation (Controller)**:
    *   The system inspects the extracted Pedimento data to find `tipoDeOperacion` (e.g., "IMP" for Import, "EXP" for Export).
    *   It explicitly blocks unsupported operations: "TRA" (Tránsito - Transit) and "Pedimentos complementarios."
7.  **Core Glosa Logic (`app/shared/services/customGloss/glosa/impo.ts` or `expo.ts`)**:
    *   Depending on the operation type, either `glosaImpo` or `glosaExpo` is invoked. These are the main orchestrators for all validation steps.
    *   They systematically call specialized validation functions organized by document section and customs regulations:
        *   **Pedimento Validations**: Modules within `app/shared/services/customGloss/glosa/pedimento/validation_steps_impo/` (or `_expo/`) are triggered. These cover:
            *   Basic Pedimento data: `1.numero-de-pedimento.ts`, `2.tipo-operacion.ts`.
            *   Dates, exchange rates, values: `4.operacion-monetaria.ts` (may use `exchange-rate.ts`).
            *   Weights: `5.peso-neto.ts`.
            *   Invoice data within Pedimento: `6.datos-de-factura.ts`.
            *   Transport data: `7.datos-del-transporte.ts`.
            *   Line items ("Partidas"): `9.partidas.ts` (may use `tax-finder.ts` for tariff calculations).
            *   Identifiers: `identificadores.ts` (crucially uses `anexo-22/apendice-10.ts` and data from `public/assets/jsons/anexo_22/10_identificadores_nivel_pedimento.json`).
            *   Other `Anexo 22` appendices (e.g., `apendice-2.ts` for "Claves de Pedimento") are consulted as needed.
        *   **COVE Validations**: Modules from `app/shared/services/customGloss/glosa/cove/validation_steps_impo/` (or `_expo/`) validate COVE data against itself and potentially against Pedimento/Factura data.
        *   **Cross-Document Validations**: Logic within these steps compares data across multiple documents (e.g., ensuring gross/net weight, package counts, values are consistent between a Factura, Packing List, and the Pedimento declaration).
    *   Each validation step generates a result using a standardized format (likely from `validation-result.ts`), indicating pass/fail, messages, and the context data used.
    *   A Langfuse event `Validation Steps` is logged.
8.  **File Upload to Persistent Storage (`app/shared/services/customGloss/upload-files.ts`)**:
    *   The original document files (referenced in `expedienteWithoutData`) are uploaded to a cloud storage solution via `uploadthing`. The URLs are stored.
9.  **Saving Results to Database (Controller & Drizzle ORM)**:
    *   A main `CustomGloss` record is inserted into the database. This record holds the overall summary, `userId`, importer name, and, significantly, the full JSON of the extracted `Pedimento` and `COVE` (as per `json().$type<Pedimento>()` in `db/schema.ts`).
    *   `CustomGlossFile` records are batch-inserted for each uploaded file, storing its name, cloud URL, and the `documentType` determined during classification.
    *   The detailed validation output from `glosaImpo`/`glosaExpo` (the `gloss` variable in `controller.ts`) is then meticulously saved:
        *   **`CustomGlossTab`**: For each logical section of the analysis (e.g., "Datos de Factura," "Validación de Partidas").
        *   **`CustomGlossTabValidationStep`**: For every single validation rule checked (e.g., "Valor Comercial Factura vs. Pedimento Coincide"). This stores the rule name, description, `isCorrect` status, and any `llmAnalysis` text.
        *   **`CustomGlossTabContext` & `CustomGlossTabContextData`**: This is crucial for auditability. For each `ValidationStep`, these tables store the exact source data points used in the validation (e.g., "Factura Folio ABC, Campo: TotalValor, Valor: 1000.00 USD"; "Pedimento XYZ, Campo: ValorUSD, Valor: 1000.00 USD"). `origin` would be the document name/ID, and `type` could be `PROVIDED`, `INFERRED`, etc.
        *   **`CustomGlossTabValidationStepActionToTake`**: If a validation fails, any suggested corrective actions are stored here.
        *   **`CustomGlossTabValidationStepResources`**: Links to relevant legal articles or documentation for a validation.
    *   A `removeNullBytes` utility is used to sanitize data before database insertion, preventing potential issues.
10. **Response to UI**: The `controller.ts` returns `{ success: true, glossId: newCustomGloss.id }` or an error object. The `glossId` is then used by the UI to navigate to the detailed analysis page (`app/(dashboard)/gloss/[id]/analysis/`).

**User Interaction with Results**:
*   Users view the detailed analysis in `app/(dashboard)/gloss/[id]/analysis/page.tsx`.
*   They can interact with the `Analysis/detailed.tsx` component to see each validation.
*   They can view uploaded documents via `Analysis/documents.tsx` (possibly using `components/pdf-carousel/pdf-carousel-viewer.tsx` or the specialized `components/pedimento/pedimento-viewer.tsx` and `components/cove/cove-viewer.tsx` which can highlight fields).
*   The `markTabAsVerifiedByTabIdNCustomGlossID` tRPC mutation allows users to mark sections of the glosa as reviewed and verified.

## 6. Database Model (`db/schema.ts`)

The Drizzle ORM schema defines a relational database structure designed for detailed tracking of the "glosa" process:

*   **`CustomGloss`**: The central record for each glosa instance. Includes `userId`, `importerName`, overall `operationStatus` (`IN_PROGRESS`, `DONE`), and importantly, `cove: json().$type<Cove>()` and `pedimento: json().$type<Pedimento>()` which store the full structured JSON of these key documents.
*   **`CustomGlossFile`**: Linked to `CustomGloss`, stores `name`, `url` (from `uploadthing`), and classified `documentType`.
*   **`CustomGlossAlert`**: For system-generated alerts or anomalies related to a glosa.
*   **`CustomGlossTab`**: Represents a major section in the glosa report (e.g., "Encabezado Pedimento," "Partidas"). Fields include `name`, `isCorrect` (overall status of the tab), `isVerified` (user-marked).
*   **`CustomGlossTabValidationStep`**: The most granular level. Details each specific check: `name`, `description`, `isCorrect` (pass/fail), `llmAnalysis` (if AI provided input), `fraccion` (tariff code if applicable), and `parentStepId` (for hierarchical validations).
*   **`CustomGlossTabContext`**: Stores the source of a piece of data used in a validation (e.g., which document it came from - `origin`). `type` indicates if it was `PROVIDED` directly, `INFERRED`, or `EXTERNAL`.
*   **`CustomGlossTabContextData`**: Key-value pairs for the actual data points used in `CustomGlossTabContext` (e.g., `name`: "ValorAduana", `value`: "12345.67").
*   **`CustomGlossTabValidationStepActionToTake`**: Suggested actions for failed validations.
*   **`CustomGlossTabValidationStepResources`**: Links to external resources (laws, regulations) relevant to a validation step.
*   **Enums**: `OperationStatus`, `CustomGlossType`, `CustomGlossTabContextType` for standardized choices.
*   **Relations**: Drizzle `relations` are defined to establish clear foreign key relationships and enable efficient querying of related data (e.g., a `CustomGloss` has many `CustomGlossTab`s, a `CustomGlossTab` has many `CustomGlossTabValidationStep`s). Cascade deletes are configured for data integrity.

## 7. User Interface (Dashboard - Enhanced Detail)

The primary user interaction occurs within the `app/(dashboard)/` route group:

*   **Main Layout (`app/(dashboard)/layout.tsx`)**:
    *   `Sidebar` (`./components/sidebar.tsx`): Provides navigation links to different sections like "Home," "Glosas List," "Settings," etc.
    *   `Header` (`./components/Header/header.tsx`): Displays the current user's information (via `./components/Header/profile-menu.tsx` which handles profile picture, name, logout) and potentially global actions or notifications.
    *   `Main` (`./components/main.tsx`): The content area that changes based on the selected route.
*   **Home Page (`app/(dashboard)/home/page.tsx`)**:
    *   `Header/gloss-form.tsx`: A prominent form allowing users to drag & drop or select files to initiate a new "glosa." This form likely uses `zod-form-data` for validation before calling the `analysis` tRPC mutation.
    *   `summary.tsx`: Displays key performance indicators or summary statistics for the user or agency.
    *   `DailyGlossesGraph/index.tsx`: A chart visualizing the number of "glosas" processed daily or weekly.
    *   `GlossHistory/index.tsx`: A quick view or table of recent "glosas" with their status, linking to the full analysis.
*   **Glosas List Page (`app/(dashboard)/gloss/page.tsx`)**:
    *   Utilizes the `GlossTable` component (`./components/GlossTable/data-table.tsx` with `columns.tsx`) to display a comprehensive, sortable, and filterable list of all "glosas" processed by the user or agency. Columns would include ID, Importer Name, Date, Status, etc.
*   **Gloss Analysis Detail Page (`app/(dashboard)/gloss/[id]/analysis/page.tsx`)**:
    *   This is where the results of a single "glosa" are meticulously displayed.
    *   `Analysis/detailed.tsx`: The core component rendering the validation results. It likely iterates through `CustomGlossTab`s and their associated `CustomGlossTabValidationStep`s, displaying names, descriptions, pass/fail icons, LLM analysis, and the crucial context data (`CustomGlossTabContextData`) showing *what* data from *which* document led to the result.
    *   `documents.tsx`: Allows viewing of the uploaded source documents. This could use:
        *   `components/pdf-carousel/pdf-carousel-viewer.tsx`: For general PDF viewing in a tabbed or scrollable manner.
        *   `components/pedimento/pedimento-viewer.tsx`: A specialized viewer that can render the structured Pedimento JSON data in a format resembling the official Pedimento form, potentially with highlighting of fields based on validation results (using `./utils/highlight-styles.ts`).
        *   `components/cove/cove-viewer.tsx`: Similar specialized viewer for COVE data.
    *   `pediment-analysis-n-finish.tsx` / `saved-n-finish.tsx`: Buttons allowing the user to mark the entire glosa as reviewed, finished, or save intermediate review states.

The UI heavily relies on TanStack Query for fetching data for these views (e.g., fetching a specific `CustomGloss` by ID with all its related tables for the analysis page) and for managing mutations (like submitting the `gloss-form.tsx` or marking a tab as verified).

This detailed breakdown should provide a comprehensive understanding of the "Cargo Claro" system's architecture and workflow. 