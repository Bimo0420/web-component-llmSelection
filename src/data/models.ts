export type ModelArchitecture = "Dense" | "MoE";
export type CapabilityLevel = "Basic" | "Good" | "Advanced" | "Excellent" | "Think Mode";

export interface ModelData {
    id: string;
    name: string;
    architecture: ModelArchitecture;
    params: number; // Billions
    context_window: number; // Tokens
    capabilities: {
        reasoning: CapabilityLevel;
        coding: CapabilityLevel;
    };
    benchmarks: {
        mmlu_pro?: number;
        ifeval?: number;
        live_code_bench?: number;
        math_500?: number;
        ttft_ms?: number; // Time To First Token
        open_llm_leaderboard_v2?: number;
        vliga_bench_ru?: number;
        ru_mmlu?: number;
        la_perf?: number;
    };
}

export const MODELS: ModelData[] = [
    {
        "id": "gpt-oss-120b",
        "name": "GPT-OSS 120B",
        "architecture": "Dense",
        "params": 120,
        "context_window": 128000,
        "capabilities": { "reasoning": "Advanced", "coding": "Excellent" },
        "benchmarks": {
            "mmlu_pro": 88.5,
            "ifeval": 92.0,
            "live_code_bench": 65.0,
            "math_500": 94.0,
            "ttft_ms": 45,
            "open_llm_leaderboard_v2": 85.0
        }
    },
    {
        "id": "llama-4-scout-109",
        "name": "Llama 4 Scout 109B",
        "architecture": "Dense",
        "params": 109,
        "context_window": 10000000,
        "capabilities": { "reasoning": "Advanced", "coding": "Excellent" },
        "benchmarks": {
            "mmlu_pro": 86.0,
            "ifeval": 90.5,
            "live_code_bench": 62.0,
            "math_500": 91.0,
            "ttft_ms": 40,
            "open_llm_leaderboard_v2": 83.0
        }
    },
    {
        "id": "qwen-3-next-72b",
        "name": "Qwen 3 Next 72B",
        "architecture": "Dense",
        "params": 72,
        "context_window": 256000,
        "capabilities": { "reasoning": "Advanced", "coding": "Excellent" },
        "benchmarks": {
            "mmlu_pro": 84.0,
            "ifeval": 88.0,
            "live_code_bench": 58.0,
            "math_500": 89.0,
            "ttft_ms": 35,
            "open_llm_leaderboard_v2": 80.0
        }
    },
    {
        "id": "llama-3-3-70b",
        "name": "Llama 3.3 70B",
        "architecture": "Dense",
        "params": 70,
        "context_window": 128000,
        "capabilities": { "reasoning": "Advanced", "coding": "Good" },
        "benchmarks": {
            "mmlu_pro": 82.0,
            "ifeval": 85.0,
            "live_code_bench": 50.0,
            "math_500": 85.0,
            "ttft_ms": 35,
            "open_llm_leaderboard_v2": 78.0
        }
    },
    {
        "id": "deepseek-r1-32b",
        "name": "DeepSeek-R1 32B",
        "architecture": "MoE",
        "params": 32,
        "context_window": 128000,
        "capabilities": { "reasoning": "Advanced", "coding": "Excellent" },
        "benchmarks": {
            "mmlu_pro": 78.0,
            "ifeval": 80.0,
            "live_code_bench": 55.0,
            "math_500": 80.0,
            "ttft_ms": 15,
            "open_llm_leaderboard_v2": 75.0,
            "la_perf": 95.0
        }
    },
    {
        "id": "qwen-3-a3b-instruct-30b",
        "name": "Qwen 3 A3B Instruct 30B",
        "architecture": "MoE",
        "params": 30,
        "context_window": 131000,
        "capabilities": { "reasoning": "Think Mode", "coding": "Excellent" },
        "benchmarks": {
            "mmlu_pro": 75.0,
            "ifeval": 78.0,
            "live_code_bench": 48.0,
            "math_500": 78.0,
            "ttft_ms": 18,
            "open_llm_leaderboard_v2": 73.0,
            "la_perf": 90.0
        }
    },
    {
        "id": "mistral-small-3-24b",
        "name": "Mistral Small 3 24B",
        "architecture": "Dense",
        "params": 24,
        "context_window": 128000,
        "capabilities": { "reasoning": "Good", "coding": "Good" },
        "benchmarks": {
            "mmlu_pro": 72.0,
            "ifeval": 75.0,
            "live_code_bench": 45.0,
            "math_500": 75.0,
            "ttft_ms": 25,
            "open_llm_leaderboard_v2": 70.0
        }
    },
    {
        "id": "gpt-oss-20b",
        "name": "GPT-OSS 20B",
        "architecture": "Dense",
        "params": 20,
        "context_window": 128000,
        "capabilities": { "reasoning": "Advanced", "coding": "Excellent" },
        "benchmarks": {
            "mmlu_pro": 70.0,
            "ifeval": 72.0,
            "live_code_bench": 40.0,
            "math_500": 70.0,
            "ttft_ms": 20,
            "open_llm_leaderboard_v2": 68.0
        }
    },
    {
        "id": "apriel-1.5-15b",
        "name": "Apriel-1.5 15B",
        "architecture": "Dense",
        "params": 15,
        "context_window": 131000,
        "capabilities": { "reasoning": "Advanced", "coding": "Good" },
        "benchmarks": {
            "mmlu_pro": 68.0,
            "ifeval": 70.0,
            "live_code_bench": 35.0,
            "math_500": 65.0,
            "ttft_ms": 18,
            "open_llm_leaderboard_v2": 65.0
        }
    },
    {
        "id": "phi-4-14",
        "name": "Phi4 14",
        "architecture": "Dense",
        "params": 14,
        "context_window": 16000,
        "capabilities": { "reasoning": "Advanced", "coding": "Excellent" },
        "benchmarks": {
            "mmlu_pro": 75.0,
            "ifeval": 76.0,
            "live_code_bench": 52.0,
            "math_500": 78.0,
            "ttft_ms": 15,
            "open_llm_leaderboard_v2": 72.0
        }
    },
    {
        "id": "deepseek-r1-14b",
        "name": "DeepSeek-R1 14B",
        "architecture": "MoE",
        "params": 14,
        "context_window": 128000,
        "capabilities": { "reasoning": "Think Mode", "coding": "Excellent" },
        "benchmarks": {
            "mmlu_pro": 70.0,
            "ifeval": 72.0,
            "live_code_bench": 48.0,
            "math_500": 72.0,
            "ttft_ms": 10,
            "open_llm_leaderboard_v2": 68.0,
            "la_perf": 98.0
        }
    },
    {
        "id": "gemma-3-12b",
        "name": "Gemma 3 12B",
        "architecture": "Dense",
        "params": 12,
        "context_window": 128000,
        "capabilities": { "reasoning": "Basic", "coding": "Good" },
        "benchmarks": {
            "mmlu_pro": 65.0,
            "ifeval": 68.0,
            "live_code_bench": 30.0,
            "math_500": 60.0,
            "ttft_ms": 12,
            "open_llm_leaderboard_v2": 62.0
        }
    },
    {
        "id": "gigachat-3-lightning-8b",
        "name": "GigaChat 3 Lightning 8B",
        "architecture": "Dense",
        "params": 8,
        "context_window": 256000,
        "capabilities": { "reasoning": "Good", "coding": "Good" },
        "benchmarks": {
            "mmlu_pro": 60.0,
            "ifeval": 65.0,
            "ru_mmlu": 85.0,
            "vliga_bench_ru": 90.0,
            "ttft_ms": 8,
            "open_llm_leaderboard_v2": 58.0
        }
    }
];
