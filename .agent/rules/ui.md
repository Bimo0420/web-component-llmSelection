# Component Context: AI Agent Web Interface

## 1. Scope & Tech Stack
**Focus:** Frontend development for the Self-Hosted AI Agent.
**Framework:** Next.js (App Router) / React.
**Language:** TypeScript (Strict mode).
**Styling:** Tailwind CSS + Shadcn/UI (for rapid component development).
**State Management:** Zustand (for global store), React Query (for server state).

## 2. Coding Principles (Frontend)
- **Functional Components:** Use concise functional components with named exports.
- **Composition over Inheritance:** Build small, reusable components.
- **Client vs Server:** Explicitly mark components as `'use client'` only when interactivity/hooks are needed. Default to Server Components for data fetching.
- **Type Safety:** Define Interfaces for all Props and API responses. No `any` types.

## 3. UI/UX Guidelines for AI
- **Streaming UI:** Text responses from the agent must be rendered progressively (streaming effect), not in bulk.
- **Latency Handling:** Always show optimistic UI states or skeletons while waiting for inference.
- **Input:** The chat input must support multi-line text and auto-resize.
- **Dark Mode:** Default to Dark Mode (industry standard for developer tools).

## 4. API & Integration Patterns
- **Endpoint Structure:** All API calls go to the backend URL defined in `NEXT_PUBLIC_API_URL`.
- **Streaming:** Use `EventSource` or `fetch` with `ReadableStream` for receiving LLM tokens.
- **WebSockets:** Use for real-time status updates (e.g., "Agent is thinking...", "Searching vector DB...").

## 5. Directory Structure
- `/app` - Pages and layouts.
- `/components/ui` - Primitive UI elements (buttons, inputs).
- `/components/chat` - Specific chat logic (MessageBubble, ChatInput).
- `/lib` - Utility functions and API clients.
- `/hooks` - Custom React hooks (e.g., `useAgentStream`).

## 6. Example: Streaming Hook Pattern
*When asking for streaming logic, prefer this pattern:*
```typescript
// Prefer using fetch with a reader for granular control over tokens
const readStream = async (response: Response) => {
  const reader = response.body?.getReader();
  // ... decoder logic
}