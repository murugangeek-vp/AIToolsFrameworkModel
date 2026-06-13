# System Architecture

The AI Stack Explorer 2026 application is built using a modern frontend stack, focusing on speed, interactivity, and robust state management. 

## High-Level Architecture Diagram

```mermaid
graph TD
    subgraph Client [Browser Environment]
        A[React Application] --> B(React Router)
        
        subgraph State Management [Zustand Store]
            C[UI Store]
            D[Filter Store]
            E[Comparison Store]
        end
        
        A --> State Management
        
        subgraph UI Components [Components & Pages]
            F[Explorer Page]
            G[Dashboard Page]
            H[Recommend Page]
            I[Comparison Page]
            J[Staging Dashboard]
            K[Charts & Visualizations Recharts]
            L[TailwindCSS Styling]
        end
        
        B --> UI Components
        UI Components --> State Management
    end
    
    subgraph Data Layer [Data Management]
        M[Static CSV Files]
        N[PapaParse CSV Parser]
        O[Custom CSV Upload]
    end
    
    UI Components --> N
    M --> N
    O --> N
    N --> State Management
```

## Technology Stack

1. **Frontend Framework:** React 19 (Vite)
2. **Routing:** React Router v7
3. **State Management:** Zustand (Modularized into UI, Filter, and Comparison stores)
4. **Styling:** TailwindCSS v4 with modern responsive utility classes.
5. **Data Visualization:** Recharts for rendering the Executive Dashboards.
6. **Data Processing:** PapaParse for client-side CSV parsing of the local data files and user uploads.
7. **Icons:** Lucide React

## Component Interoperability

- **State Syncing:** Components rarely pass props down deeply. Instead, they read from and dispatch actions to the centralized Zustand stores (`useUIStore`, `useFilterStore`, `useComparisonStore`), ensuring the UI stays consistent across pages.
- **Data Ingestion:** The application primarily relies on statically hosted CSV files (e.g., `ai_sdlc_tools.csv`, `cloud_ai_platforms.csv`) located in the `/public/data` directory. PapaParse converts this into JSON dynamically at runtime to populate the stores.
- **Dynamic Updates:** The application features a custom dataset uploader that parses local files in-browser, merges them with the application state, and instantly re-renders the UI without requiring a backend round-trip.
