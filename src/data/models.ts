export type ModelArchitecture = "Dense" | "MoE" | "Hybrid Linear" | "Hybrid MoE";
export type OpenSourceStatus = "Open Source" | "Open Weights" | "Proprietary";

export interface ModelData {
    id: string;
    name: string;
    architecture: ModelArchitecture;
    params: number; // Total parameters in billions
    active_params: number; // Active parameters in billions
    context_window: number; // Tokens in thousands
    reasoning: boolean;
    visual: boolean;
    open_source: OpenSourceStatus;
    speed: number; // Tokens per second
    memory: {
        fp16: number; // GB
        fp8?: number; // GB
        int4?: number; // GB
        sfp8?: number; // GB
    };
    cost_per_100k_tokens_fp16: number; // GB per 100k tokens
    benchmarks: {
        aa_lcr?: number; // AA-LCR (Long Context Reasoning)
        aa_omniscience_accuracy?: number;
        aa_omniscience_non_hallucination?: number;
        hle?: number; // Humanity's Last Exam
        gpqa_diamond?: number;
        ifbench?: number;
        mmmu_pro?: number; // Visual Reasoning
    };
}

export const MODELS: ModelData[] = [
    {
        id: "gpt-oss-120b",
        name: "GPT-OSS (120B)",
        architecture: "MoE",
        params: 117,
        active_params: 5,
        context_window: 131,
        reasoning: true,
        visual: false,
        open_source: "Open Source",
        speed: 338,
        memory: { fp16: 65, fp8: 63, int4: 63, sfp8: 63 },
        cost_per_100k_tokens_fp16: 6.87,
        benchmarks: {
            aa_lcr: 51,
            aa_omniscience_accuracy: 20,
            aa_omniscience_non_hallucination: 10,
            hle: 19,
            gpqa_diamond: 78,
            ifbench: 69
        }
    },
    {
        id: "llama-4-scout",
        name: "Llama 4 Scout",
        architecture: "MoE",
        params: 109,
        active_params: 17,
        context_window: 10000,
        reasoning: false,
        visual: true,
        open_source: "Open Weights",
        speed: 256,
        memory: { fp16: 113, fp8: 68 },
        cost_per_100k_tokens_fp16: 18.31,
        benchmarks: {
            aa_lcr: 26,
            aa_omniscience_accuracy: 14,
            aa_omniscience_non_hallucination: 21,
            hle: 4,
            gpqa_diamond: 59,
            ifbench: 40,
            mmmu_pro: 53
        }
    },
    {
        id: "glm-4.5-air",
        name: "GLM-4.5-Air",
        architecture: "MoE",
        params: 106,
        active_params: 12,
        context_window: 128,
        reasoning: true,
        visual: false,
        open_source: "Open Source",
        speed: 119,
        memory: { fp16: 221, fp8: 117, int4: 74 },
        cost_per_100k_tokens_fp16: 17.55,
        benchmarks: {
            aa_lcr: 44,
            aa_omniscience_accuracy: 15,
            aa_omniscience_non_hallucination: 8,
            hle: 7,
            gpqa_diamond: 73,
            ifbench: 38
        }
    },
    {
        id: "ring-flash-2.0",
        name: "Ring-flash-2.0",
        architecture: "Hybrid Linear",
        params: 103,
        active_params: 6,
        context_window: 128,
        reasoning: true,
        visual: false,
        open_source: "Open Source",
        speed: 97,
        memory: { fp16: 206, fp8: 110, int4: 62, sfp8: 62 },
        cost_per_100k_tokens_fp16: 6.10,
        benchmarks: {
            aa_lcr: 21,
            aa_omniscience_accuracy: 16,
            aa_omniscience_non_hallucination: 11,
            hle: 9,
            gpqa_diamond: 73,
            ifbench: 43
        }
    },
    {
        id: "ling-flash-2.0",
        name: "Ling-flash-2.0",
        architecture: "MoE",
        params: 103,
        active_params: 6,
        context_window: 128,
        reasoning: false,
        visual: false,
        open_source: "Open Source",
        speed: 73,
        memory: { fp16: 206, fp8: 110, int4: 62, sfp8: 62 },
        cost_per_100k_tokens_fp16: 6.10,
        benchmarks: {
            aa_lcr: 15,
            aa_omniscience_accuracy: 14,
            aa_omniscience_non_hallucination: 6,
            hle: 6,
            gpqa_diamond: 66,
            ifbench: 34
        }
    },
    {
        id: "qwen3-next-80b",
        name: "Qwen3 Next 80B",
        architecture: "Hybrid Linear",
        params: 80,
        active_params: 3,
        context_window: 262,
        reasoning: true,
        visual: false,
        open_source: "Open Weights",
        speed: 172,
        memory: { fp16: 160, fp8: 85, int4: 48 },
        cost_per_100k_tokens_fp16: 2.29,
        benchmarks: {
            aa_lcr: 51,
            aa_omniscience_accuracy: 17,
            aa_omniscience_non_hallucination: 7,
            hle: 7,
            gpqa_diamond: 74,
            ifbench: 40
        }
    },
    {
        id: "deepseek-r1-70b",
        name: "DeepSeek R1 70B",
        architecture: "Dense",
        params: 70,
        active_params: 70,
        context_window: 128,
        reasoning: true,
        visual: false,
        open_source: "Open Weights",
        speed: 42,
        memory: { fp16: 142, fp8: 75, int4: 43 },
        cost_per_100k_tokens_fp16: 30.52,
        benchmarks: {
            aa_lcr: 11,
            aa_omniscience_accuracy: 19,
            aa_omniscience_non_hallucination: 19,
            hle: 6,
            gpqa_diamond: 40,
            ifbench: 28
        }
    },
    {
        id: "llama-3.3-70b",
        name: "Llama 3.3 70B",
        architecture: "Dense",
        params: 70,
        active_params: 70,
        context_window: 128,
        reasoning: false,
        visual: false,
        open_source: "Open Weights",
        speed: 140,
        memory: { fp16: 141, fp8: 75, int4: 43 },
        cost_per_100k_tokens_fp16: 30.52,
        benchmarks: {
            aa_lcr: 15,
            aa_omniscience_accuracy: 18,
            aa_omniscience_non_hallucination: 11,
            hle: 4,
            gpqa_diamond: 50,
            ifbench: 47
        }
    },
    {
        id: "llama-3.1-70b",
        name: "Llama 3.1 70B",
        architecture: "Dense",
        params: 70,
        active_params: 70,
        context_window: 128,
        reasoning: false,
        visual: false,
        open_source: "Open Weights",
        speed: 44,
        memory: { fp16: 141, fp8: 75, int4: 43 },
        cost_per_100k_tokens_fp16: 30.52,
        benchmarks: {
            aa_lcr: 7,
            aa_omniscience_accuracy: 16,
            aa_omniscience_non_hallucination: 31,
            hle: 5,
            gpqa_diamond: 47,
            ifbench: 31
        }
    },
    {
        id: "kimi-linear",
        name: "Kimi Linear",
        architecture: "Hybrid Linear",
        params: 49,
        active_params: 3,
        context_window: 1000,
        reasoning: false,
        visual: false,
        open_source: "Open Source",
        speed: 103,
        memory: { fp16: 54, fp8: 29, int4: 29 },
        cost_per_100k_tokens_fp16: 10.68,
        benchmarks: {
            aa_lcr: 26,
            aa_omniscience_non_hallucination: 3,
            gpqa_diamond: 41,
            ifbench: 28
        }
    },
    {
        id: "qwen3-vl-32b",
        name: "Qwen3 VL 32B",
        architecture: "Dense",
        params: 33,
        active_params: 33,
        context_window: 262,
        reasoning: false,
        visual: true,
        open_source: "Open Weights",
        speed: 90,
        memory: { fp16: 66, fp8: 35, int4: 20 },
        cost_per_100k_tokens_fp16: 24.41,
        benchmarks: {
            aa_lcr: 31,
            aa_omniscience_accuracy: 14,
            aa_omniscience_non_hallucination: 9,
            hle: 6,
            gpqa_diamond: 67,
            ifbench: 39,
            mmmu_pro: 64
        }
    },
    {
        id: "granite-4.0-hsmall",
        name: "Granite 4.0 HSmall",
        architecture: "Hybrid MoE",
        params: 32,
        active_params: 9,
        context_window: 128,
        reasoning: false,
        visual: false,
        open_source: "Open Source",
        speed: 454,
        memory: { fp16: 64, fp8: 34, int4: 19, sfp8: 10 },
        cost_per_100k_tokens_fp16: 1.53,
        benchmarks: {
            aa_lcr: 9,
            aa_omniscience_accuracy: 13,
            aa_omniscience_non_hallucination: 13,
            hle: 4,
            gpqa_diamond: 42,
            ifbench: 32
        }
    },
    {
        id: "nvidia-nemotron-3-nano-30b",
        name: "NVIDIA Nemotron 3 Nano 30B",
        architecture: "MoE",
        params: 32,
        active_params: 4,
        context_window: 1000,
        reasoning: true,
        visual: false,
        open_source: "Open Weights",
        speed: 189,
        memory: { fp16: 60, fp8: 32, int4: 21 },
        cost_per_100k_tokens_fp16: 0.57,
        benchmarks: {
            aa_lcr: 7,
            aa_omniscience_accuracy: 13,
            aa_omniscience_non_hallucination: 10,
            hle: 5,
            gpqa_diamond: 40,
            ifbench: 38
        }
    },
    {
        id: "glm-4.7-flash",
        name: "GLM-4.7-Flash",
        architecture: "MoE",
        params: 31,
        active_params: 3,
        context_window: 200,
        reasoning: false,
        visual: false,
        open_source: "Open Source",
        speed: 114,
        memory: { fp16: 60, fp8: 36, int4: 20, sfp8: 18 },
        cost_per_100k_tokens_fp16: 22.41,
        benchmarks: {
            aa_lcr: 15,
            aa_omniscience_accuracy: 12,
            aa_omniscience_non_hallucination: 6,
            hle: 5,
            gpqa_diamond: 45,
            ifbench: 46
        }
    },
    {
        id: "qwen3-coder-30b",
        name: "Qwen3 Coder 30B",
        architecture: "MoE",
        params: 31,
        active_params: 3,
        context_window: 262,
        reasoning: false,
        visual: false,
        open_source: "Open Weights",
        speed: 111,
        memory: { fp16: 61, fp8: 32, int4: 19 },
        cost_per_100k_tokens_fp16: 9.16,
        benchmarks: {
            aa_lcr: 29,
            aa_omniscience_accuracy: 15,
            aa_omniscience_non_hallucination: 21,
            hle: 4,
            gpqa_diamond: 52,
            ifbench: 33
        }
    },
    {
        id: "qwen3-30b",
        name: "Qwen3 30B",
        architecture: "MoE",
        params: 31,
        active_params: 3,
        context_window: 262,
        reasoning: false,
        visual: false,
        open_source: "Open Weights",
        speed: 75,
        memory: { fp16: 60, fp8: 32, int4: 18 },
        cost_per_100k_tokens_fp16: 9.16,
        benchmarks: {
            aa_lcr: 23,
            aa_omniscience_accuracy: 14,
            aa_omniscience_non_hallucination: 5,
            hle: 7,
            gpqa_diamond: 66,
            ifbench: 33
        }
    },
    {
        id: "qwen3-vl-30b",
        name: "Qwen3 VL 30B",
        architecture: "MoE",
        params: 30,
        active_params: 3,
        context_window: 262,
        reasoning: false,
        visual: true,
        open_source: "Open Weights",
        speed: 117,
        memory: { fp16: 60, fp8: 32, int4: 19 },
        cost_per_100k_tokens_fp16: 9.16,
        benchmarks: {
            aa_lcr: 24,
            aa_omniscience_accuracy: 15,
            aa_omniscience_non_hallucination: 8,
            hle: 6,
            gpqa_diamond: 70,
            ifbench: 33,
            mmmu_pro: 62
        }
    },
    {
        id: "gemma-3-27b",
        name: "Gemma 3 27B",
        architecture: "Dense",
        params: 27,
        active_params: 27,
        context_window: 128,
        reasoning: false,
        visual: true,
        open_source: "Open Weights",
        speed: 46,
        memory: { fp16: 54, fp8: 29, int4: 17, sfp8: 27 },
        cost_per_100k_tokens_fp16: 47.30,
        benchmarks: {
            aa_lcr: 6,
            aa_omniscience_accuracy: 12,
            aa_omniscience_non_hallucination: 9,
            hle: 5,
            gpqa_diamond: 43,
            ifbench: 32,
            mmmu_pro: 48
        }
    },
    {
        id: "devstral-small-2",
        name: "Devstral Small 2",
        architecture: "Dense",
        params: 24,
        active_params: 24,
        context_window: 262,
        reasoning: false,
        visual: false,
        open_source: "Open Source",
        speed: 209,
        memory: { fp16: 48, fp8: 26, int4: 14 },
        cost_per_100k_tokens_fp16: 15.26,
        benchmarks: {
            aa_lcr: 24,
            aa_omniscience_accuracy: 15,
            aa_omniscience_non_hallucination: 13,
            hle: 3,
            gpqa_diamond: 53,
            ifbench: 31,
            mmmu_pro: 45
        }
    },
    {
        id: "mistral-small-3.2",
        name: "Mistral Small 3.2",
        architecture: "Dense",
        params: 24,
        active_params: 24,
        context_window: 128,
        reasoning: false,
        visual: true,
        open_source: "Open Weights",
        speed: 147,
        memory: { fp16: 67, fp8: 36, int4: 20, sfp8: 18 },
        cost_per_100k_tokens_fp16: 15.26,
        benchmarks: {
            aa_lcr: 17,
            aa_omniscience_accuracy: 14,
            aa_omniscience_non_hallucination: 24,
            hle: 4,
            gpqa_diamond: 51,
            ifbench: 34,
            mmmu_pro: 48
        }
    },
    {
        id: "gpt-oss-20b",
        name: "GPT-OSS (20B)",
        architecture: "MoE",
        params: 21,
        active_params: 4,
        context_window: 131,
        reasoning: true,
        visual: false,
        open_source: "Open Source",
        speed: 308,
        memory: { fp16: 14, fp8: 12, int4: 12, sfp8: 11 },
        cost_per_100k_tokens_fp16: 4.58,
        benchmarks: {
            aa_lcr: 31,
            aa_omniscience_accuracy: 15,
            aa_omniscience_non_hallucination: 7,
            hle: 10,
            gpqa_diamond: 69,
            ifbench: 65
        }
    },
    {
        id: "apriel-v1.6",
        name: "Apriel-v1.6",
        architecture: "Dense",
        params: 15,
        active_params: 15,
        context_window: 128,
        reasoning: true,
        visual: true,
        open_source: "Open Weights",
        speed: 156,
        memory: { fp16: 30, fp8: 16, int4: 9 },
        cost_per_100k_tokens_fp16: 19.07,
        benchmarks: {
            aa_lcr: 50,
            aa_omniscience_accuracy: 17,
            aa_omniscience_non_hallucination: 8,
            hle: 10,
            gpqa_diamond: 73,
            ifbench: 69
        }
    },
    {
        id: "ministral-3-14b",
        name: "Ministral 3 14B",
        architecture: "Dense",
        params: 14,
        active_params: 14,
        context_window: 262,
        reasoning: false,
        visual: true,
        open_source: "Open Weights",
        speed: 148,
        memory: { fp16: 28, fp8: 15, int4: 9 },
        cost_per_100k_tokens_fp16: 15.26,
        benchmarks: {
            aa_lcr: 22,
            aa_omniscience_accuracy: 12,
            aa_omniscience_non_hallucination: 10,
            hle: 5,
            gpqa_diamond: 57,
            ifbench: 32,
            mmmu_pro: 50
        }
    },
    {
        id: "phi-4",
        name: "Phi-4",
        architecture: "Dense",
        params: 14,
        active_params: 14,
        context_window: 16,
        reasoning: false,
        visual: true,
        open_source: "Open Source",
        speed: 17,
        memory: { fp16: 11, fp8: 6, int4: 3 },
        cost_per_100k_tokens_fp16: 12.21,
        benchmarks: {
            aa_lcr: 0,
            aa_omniscience_accuracy: 14,
            aa_omniscience_non_hallucination: 21,
            hle: 4,
            gpqa_diamond: 57,
            ifbench: 24
        }
    },
    {
        id: "nvidia-nemotron-nano-13b",
        name: "NVIDIA Nemotron Nano 13B",
        architecture: "Dense",
        params: 13,
        active_params: 13,
        context_window: 128,
        reasoning: false,
        visual: true,
        open_source: "Open Weights",
        speed: 137,
        memory: { fp16: 24, fp8: 13, int4: 21, sfp8: 24 },
        cost_per_100k_tokens_fp16: 3.81,
        benchmarks: {
            aa_lcr: 17,
            aa_omniscience_accuracy: 11,
            aa_omniscience_non_hallucination: 6,
            hle: 5,
            gpqa_diamond: 44,
            ifbench: 26,
            mmmu_pro: 45
        }
    },
    {
        id: "gemma-3-12b",
        name: "Gemma 3 12B",
        architecture: "Dense",
        params: 12,
        active_params: 12,
        context_window: 128,
        reasoning: false,
        visual: true,
        open_source: "Open Weights",
        speed: 44,
        memory: { fp16: 24, fp8: 15, int4: 8, sfp8: 12 },
        cost_per_100k_tokens_fp16: 34.33,
        benchmarks: {
            aa_lcr: 12,
            aa_omniscience_accuracy: 10,
            aa_omniscience_non_hallucination: 3,
            hle: 5,
            gpqa_diamond: 35,
            ifbench: 37,
            mmmu_pro: 38
        }
    },
    {
        id: "llama-3.2-11b",
        name: "Llama 3.2 11B",
        architecture: "Dense",
        params: 11,
        active_params: 11,
        context_window: 128,
        reasoning: false,
        visual: true,
        open_source: "Open Weights",
        speed: 77,
        memory: { fp16: 22, fp8: 12, int4: 7 },
        cost_per_100k_tokens_fp16: 12.21,
        benchmarks: {
            aa_lcr: 12,
            aa_omniscience_accuracy: 10,
            aa_omniscience_non_hallucination: 20,
            hle: 5,
            gpqa_diamond: 32,
            ifbench: 30,
            mmmu_pro: 29
        }
    },
    {
        id: "nvidia-nemotron-nano-9b",
        name: "NVIDIA Nemotron Nano 9B",
        architecture: "Dense",
        params: 9,
        active_params: 9,
        context_window: 131,
        reasoning: true,
        visual: false,
        open_source: "Open Weights",
        speed: 121,
        memory: { fp16: 17, fp8: 9, int4: 6 },
        cost_per_100k_tokens_fp16: 1.53,
        benchmarks: {
            aa_lcr: 23,
            aa_omniscience_accuracy: 9,
            aa_omniscience_non_hallucination: 26,
            hle: 4,
            gpqa_diamond: 56,
            ifbench: 27
        }
    },
    {
        id: "qwen3-vl-8b",
        name: "Qwen3 VL 8B",
        architecture: "Dense",
        params: 9,
        active_params: 9,
        context_window: 262,
        reasoning: false,
        visual: true,
        open_source: "Open Weights",
        speed: 97,
        memory: { fp16: 15, fp8: 8, int4: 5 },
        cost_per_100k_tokens_fp16: 13.73,
        benchmarks: {
            aa_lcr: 15,
            aa_omniscience_accuracy: 19,
            aa_omniscience_non_hallucination: 10,
            hle: 3,
            gpqa_diamond: 43,
            ifbench: 32,
            mmmu_pro: 47
        }
    },
    {
        id: "deepseek-r1-8b",
        name: "DeepSeek R1 8B",
        architecture: "Dense",
        params: 8,
        active_params: 8,
        context_window: 33,
        reasoning: true,
        visual: false,
        open_source: "Open Source",
        speed: 16,
        memory: { fp16: 9, fp8: 5 },
        cost_per_100k_tokens_fp16: 12.21,
        benchmarks: {
            aa_lcr: 13,
            aa_omniscience_accuracy: 11,
            aa_omniscience_non_hallucination: 14,
            hle: 6,
            gpqa_diamond: 61,
            ifbench: 20
        }
    },
    {
        id: "ministral-3-8b",
        name: "Ministral 3 8B",
        architecture: "Dense",
        params: 8,
        active_params: 8,
        context_window: 262,
        reasoning: false,
        visual: true,
        open_source: "Open Weights",
        speed: 193,
        memory: { fp16: 16, fp8: 9, int4: 5 },
        cost_per_100k_tokens_fp16: 13.73,
        benchmarks: {
            aa_lcr: 24,
            aa_omniscience_accuracy: 12,
            aa_omniscience_non_hallucination: 7,
            hle: 4,
            gpqa_diamond: 47,
            ifbench: 29,
            mmmu_pro: 46
        }
    }
];
