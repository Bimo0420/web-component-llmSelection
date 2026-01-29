"use client"

import * as React from "react"
import { MODELS, type ModelData } from "@/data/models"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type Scenario = "coding" | "chat" | "documents"

const CAPABILITY_RANK = {
    Basic: 1,
    Advanced: 2,
    Excellent: 3,
}

export function LocalLLMSelector() {
    const [scenario, setScenario] = React.useState<Scenario>("coding")

    const filteredModels = React.useMemo(() => {
        let filtered = [...MODELS]

        switch (scenario) {
            case "coding":
                // Filter: Reasoning & Coding >= Advanced
                filtered = filtered.filter(
                    (m) =>
                        CAPABILITY_RANK[m.capabilities.reasoning] >= CAPABILITY_RANK.Advanced &&
                        CAPABILITY_RANK[m.capabilities.coding] >= CAPABILITY_RANK.Advanced
                )
                // Sort: LiveCodeBench (desc), then Math 500 (desc)
                filtered.sort((a, b) => {
                    const scoreA = (a.benchmarks.live_code_bench || 0) + (a.benchmarks.math_500 || 0)
                    const scoreB = (b.benchmarks.live_code_bench || 0) + (b.benchmarks.math_500 || 0)
                    return scoreB - scoreA
                })
                break

            case "chat":
                // Filter: Architecture == MoE
                filtered = filtered.filter((m) => m.architecture === "MoE")
                // Sort: TTFT (asc), then La Perf (desc)
                filtered.sort((a, b) => {
                    const ttftA = a.benchmarks.ttft_ms || 999
                    const ttftB = b.benchmarks.ttft_ms || 999
                    if (ttftA !== ttftB) return ttftA - ttftB // Lower is better
                    return (b.benchmarks.la_perf || 0) - (a.benchmarks.la_perf || 0)
                })
                break

            case "documents":
                // Filter: Context >= 128k
                filtered = filtered.filter((m) => m.context_window >= 128000)
                // Sort: IFEval (desc), MMLU-Pro (desc)
                filtered.sort((a, b) => {
                    const scoreA = (a.benchmarks.ifeval || 0)
                    const scoreB = (b.benchmarks.ifeval || 0)
                    if (scoreA !== scoreB) return scoreB - scoreA
                    return (b.benchmarks.mmlu_pro || 0) - (a.benchmarks.mmlu_pro || 0)
                })
                break
        }

        return filtered
    }, [scenario])

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col gap-2 text-center sm:text-left">
                <h2 className="text-3xl font-bold tracking-tight">Выбор Локальной LLM</h2>
                <p className="text-muted-foreground">
                    Подберите оптимальную модель под ваш сценарий использования.
                </p>
            </div>

            <Tabs value={scenario} onValueChange={(v) => setScenario(v as Scenario)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="coding">Сложный Кодинг</TabsTrigger>
                    <TabsTrigger value="chat">High-Load Чат</TabsTrigger>
                    <TabsTrigger value="documents">Анализ Документов</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {filteredModels.map((model, index) => (
                    <ModelCard key={model.id} model={model} rank={index + 1} scenario={scenario} />
                ))}
                {filteredModels.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        Нет моделей, соответствующих критериям.
                    </div>
                )}
            </div>
        </div>
    )
}

function ModelCard({ model, rank, scenario }: { model: ModelData; rank: number; scenario: Scenario }) {
    const isTopPick = rank === 1

    return (
        <Card className={cn("flex flex-col overflow-hidden transition-all hover:shadow-md", isTopPick && "border-primary")}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <CardTitle className="text-xl">{model.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <span>{model.params}B Params</span>
                            <span>•</span>
                            <span>{model.architecture}</span>
                        </CardDescription>
                    </div>
                    {isTopPick && <Badge variant="default">Top Pick</Badge>}
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-3">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="text-muted-foreground">Context Window</span>
                        <span className="font-medium">{(model.context_window / 1000).toLocaleString()}k Tokens</span>
                    </div>

                    <ScenarioBenchmarks model={model} scenario={scenario} />

                </div>
            </CardContent>

            <CardFooter className="pt-0 pb-4">
                <div className="flex flex-wrap gap-1 mt-2">
                    <BenchmarkBadge label="MMLU-Pro" value={model.benchmarks.mmlu_pro} />
                    <BenchmarkBadge label="IFEval" value={model.benchmarks.ifeval} />
                    <BenchmarkBadge label="Coding" value={undefined} text={model.capabilities.coding} />
                </div>
            </CardFooter>
        </Card>
    )
}

function ScenarioBenchmarks({ model, scenario }: { model: ModelData; scenario: Scenario }) {
    const b = model.benchmarks

    if (scenario === "coding") {
        return (
            <div className="space-y-2">
                <MetricRow label="LiveCodeBench" value={b.live_code_bench} max={100} />
                <MetricRow label="Math 500" value={b.math_500} max={100} />
            </div>
        )
    }
    if (scenario === "chat") {
        return (
            <div className="space-y-2">
                <MetricRow label="TTFT (ms)" value={b.ttft_ms} invert />
                <MetricRow label="La Perf" value={b.la_perf} max={100} />
            </div>
        )
    }
    if (scenario === "documents") {
        return (
            <div className="space-y-2">
                <MetricRow label="IFEval" value={b.ifeval} max={100} />
                <MetricRow label="MMLU-Pro" value={b.mmlu_pro} max={100} />
            </div>
        )
    }
    return null
}

function MetricRow({ label, value, max = 100, invert = false }: { label: string; value?: number; max?: number; invert?: boolean }) {
    if (value === undefined) return null

    // Simple bar visualization
    // If invert (e.g. latency), lower is better. We can't easily bar-chart it without a refined scale.
    // Just show number for now with color.

    let colorClass = "text-foreground"
    if (invert) {
        if (value < 20) colorClass = "text-green-500"
        else if (value < 50) colorClass = "text-yellow-500"
        else colorClass = "text-red-500"
    } else {
        if (value > 80) colorClass = "text-green-500"
        else if (value > 60) colorClass = "text-yellow-500"
        else colorClass = "text-red-500"
    }

    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className={cn("font-medium", colorClass)}>{value}{invert ? ' ms' : ''}</span>
        </div>
    )
}

function BenchmarkBadge({ label, value, text }: { label: string; value?: number; text?: string }) {
    if (value === undefined && !text) return null
    return (
        <Badge variant="secondary" className="px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
            {label}: {text || value}
        </Badge>
    )
}
