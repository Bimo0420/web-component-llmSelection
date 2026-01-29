import { LocalLLMSelector } from "@/components/local-llm-selector";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <LocalLLMSelector />
    </main>
  );
}
