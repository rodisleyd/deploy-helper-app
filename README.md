# Deploy Wizard MVP

This is a React-based "Deployment Assistant" that uses the Google Gemini API to generate custom deployment guides for developers.

## 1. Architecture Overview

For this MVP, we are using a **Client-Side SPA (Single Page Application)** architecture to minimize infrastructure complexity while demonstrating full functionality.

*   **Frontend**: React 18 (Vite-style structure), TypeScript, Tailwind CSS.
*   **State/Logic**: React Hooks for UI state, `Context` (implicit via structure) for data flow.
*   **Data Persistence**: `localStorage` (Service Pattern).
    *   *Future Upgrade*: Replace `services/storageService.ts` with API calls to Supabase or Firebase.
*   **AI Integration**: Direct client-side call to `@google/genai`.
    *   *Security Note*: In a real production app, AI calls should be proxied through a backend (Node.js/Edge Function) to protect the API Key. For this demo, we rely on the environment variable injection.
*   **Deployment**: Static exportable to Vercel, Netlify, or Cloudflare Pages.

## 2. Folder Structure

```
/
├── index.html              # Entry HTML
├── index.tsx               # React Root
├── App.tsx                 # Router Configuration
├── types.ts                # Shared TypeScript Interfaces (Domain Models)
├── components/             # Reusable UI Components
│   ├── Button.tsx
│   ├── Header.tsx
│   └── Layout.tsx
├── pages/                  # Route Views
│   ├── Dashboard.tsx       # List of projects
│   ├── NewProject.tsx      # Form + AI Generation trigger
│   └── ProjectDetails.tsx  # Interactive Checklist
├── services/               # Business Logic & External APIs
│   ├── geminiService.ts    # AI Prompt Engineering & API Wrapper
│   └── storageService.ts   # Persistence Layer (Repository Pattern)
└── metadata.json           # Project metadata
```

## 3. Data Models (Schema)

The application relies on three core entities defined in `types.ts`:

1.  **Project**: The root entity containing metadata (Name, Stack, Hosting Target).
2.  **DeployPlan**: The AI-generated JSON structure linked to a Project.
3.  **DeployStep**: Individual tasks containing Markdown descriptions, CLI commands, and Config Files.

## 4. How to Run

1.  Ensure you have an API Key for Gemini.
2.  Set the environment variable `API_KEY` in your runtime environment.
3.  Install dependencies (React, React DOM, React Router, Lucide React, @google/genai).
4.  Start the development server.

## 5. Deployment

Since this is a client-side SPA:
1.  Run `npm run build`.
2.  Upload the `dist/` folder to Vercel/Netlify.
3.  **Crucial**: Add your `API_KEY` as an environment variable in the Vercel/Netlify dashboard.
