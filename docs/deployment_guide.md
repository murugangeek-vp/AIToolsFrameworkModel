# Deployment Guide

This guide covers how to run the AI Stack Explorer 2026 application locally for development, and how to deploy it for production using Docker.

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Docker & Docker Compose**: For containerized deployment

## Local Development

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd AIToolsFrameworkModel
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`. Vite provides Hot Module Replacement (HMR) out of the box, so changes to the source code will instantly reflect in the browser.

4. **Linting and Type Checking**
   To ensure code quality, run:
   ```bash
   npm run lint
   ```
   To check for TypeScript errors without running the dev server:
   ```bash
   npx tsc --noEmit
   ```

## Production Build (Manual)

To build the project for a traditional web server (like Nginx, Apache, or static hosting providers like Vercel/Netlify):

1. **Generate the Build**
   ```bash
   npm run build
   ```
   This will run `tsc -b` and `vite build`. The optimized static assets will be output to the `dist/` directory.

2. **Preview the Build**
   ```bash
   npm run preview
   ```
   This command boots up a local static web server that serves the files from the `dist/` folder.

## Docker Deployment

The application includes a `Dockerfile` and `docker-compose.yml` for simplified, reproducible deployments.

### Using Docker Compose (Recommended)

1. **Build and Start the Container**
   From the root of the project, run:
   ```bash
   docker-compose up --build -d
   ```
   This will:
   - Build the Docker image based on the provided `Dockerfile`.
   - Start the container in detached mode.
   - Map port `8080` (or whatever is defined in `docker-compose.yml`) to the container's internal web server port.

2. **Stop the Container**
   ```bash
   docker-compose down
   ```

### Using Docker Directly

If you prefer not to use `docker-compose`:

1. **Build the Image**
   ```bash
   docker build -t ai-stack-explorer:latest .
   ```

2. **Run the Container**
   ```bash
   docker run -d -p 8080:80 ai-stack-explorer:latest
   ```

## Environment Variables

The application utilizes a `.env` file for configuration. If not present, you can create one based on a `.env.example` file (if available), or define the required variables directly.
Currently, as a static frontend application, most configuration is baked in at build time. If specific API endpoints are added in the future, ensure they are prefixed with `VITE_` (e.g., `VITE_API_BASE_URL`) to be exposed to the Vite build process.

## Updating Data Sets

Since the platform relies on CSV files in the `public/data/` directory, updates to the tool database involve modifying these CSVs.
- **For Local/Manual:** Update the CSVs and push the code.
- **For Docker:** If the CSVs change, you must rebuild the Docker image (`docker-compose up --build -d`) so the new static files are copied into the web server's public directory.
