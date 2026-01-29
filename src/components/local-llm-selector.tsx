"use client"

import * as React from "react"
import { MODELS, type ModelData } from "@/data/models"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts"

type Scenario = "coding" | "chat" | "documents"

const CAPABILITY_RANK = {
    Basic: 1,
    Good: 2,
    Advanced: 3,
    Excellent: 4,
    "Think Mode": 5,
}

// Definition of all available benchmarks
const ALL_BENCHMARKS: { key: keyof ModelData['benchmarks']; label: string; invert?: boolean; color: string }[] = [
    { key: "live_code_bench", label: "LiveCodeBench", color: "hsl(var(--chart-1))" },
    { key: "math_500", label: "Math 500", color: "hsl(var(--chart-2))" },
    { key: "open_llm_leaderboard_v2", label: "Open LLM V2", color: "hsl(var(--chart-3))" },
    { key: "ttft_ms", label: "TTFT (ms)", invert: true, color: "hsl(var(--chart-4))" },
    { key: "la_perf", label: "La Perf", color: "hsl(var(--chart-5))" },
    { key: "ifeval", label: "IFEval", color: "hsl(var(--chart-1))" },
    { key: "mmlu_pro", label: "MMLU-Pro", color: "hsl(var(--chart-2))" },
    { key: "vliga_bench_ru", label: "VLigaBench (RU)", color: "hsl(var(--chart-3))" },
    { key: "ru_mmlu", label: "Ru-MMLU", color: "hsl(var(--chart-4))" },
]

// Mapping which benchmarks are relevant for which scenario
const SCENARIO_RELEVANCE: Record<Scenario, (keyof ModelData['benchmarks'])[]> = {
    coding: ["live_code_bench", "math_500", "open_llm_leaderboard_v2"],
    chat: ["ttft_ms", "la_perf"],
    documents: ["ifeval", "mmlu_pro"],
}

export function LocalLLMSelector() {
    const [scenario, setScenario] = React.useState<Scenario>("coding")
    const [activeTab, setActiveTab] = React.useState<string>("live_code_bench")

    // Determine relevant benchmarks for the selected scenario
    const relevantBenchmarks = React.useMemo(() => new Set(SCENARIO_RELEVANCE[scenario]), [scenario])

    // Calculate which models are "active" (filtered) based on criteria
    const activeModelIds = React.useMemo(() => {
        const activeSet = new Set<string>()

        MODELS.forEach(m => {
            let isActive = false
            switch (scenario) {
                case "coding":
                    isActive = true
                    break
                case "chat":
                    isActive = m.architecture === "MoE"
                    break
                case "documents":
                    isActive = m.context_window >= 128000
                    break
            }
            if (isActive) activeSet.add(m.id)
        })
        return activeSet
    }, [scenario])

    // Filtered models for the card list (only active ones)
    const filteredModelsForCards = React.useMemo(() => {
        const active = MODELS.filter(m => activeModelIds.has(m.id))

        // Always sort by params (descending)
        active.sort((a, b) => b.params - a.params)

        return active
    }, [activeModelIds])

    // Data for charts: ALL models
    const chartData = React.useMemo(() => {
        return MODELS.map(m => {
            const dataPoint: any = {
                name: m.name,
                isActive: activeModelIds.has(m.id),
                params: m.params,
                ...m.benchmarks
            }
            return dataPoint
        }).sort((a, b) => b.params - a.params)
    }, [activeModelIds])

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-4 sm:p-6 text-foreground">
            <div className="flex flex-col gap-2 text-center sm:text-left">
                <h2 className="text-3xl font-bold tracking-tight">Выбор Локальной LLM</h2>
                <p className="text-muted-foreground">
                    Сравнение всех моделей. Выберите сценарий, чтобы подсветить оптимальные варианты.
                </p>
            </div>

            {/* Part 1: Scenario Selection */}
            <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">1. Сценарий использования</label>
                <Tabs value={scenario} onValueChange={(v) => setScenario(v as Scenario)} className="w-full">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto p-1 bg-muted/50 rounded-xl">
                        <TabsTrigger className="py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all" value="coding">
                            <span className="font-semibold">Сложный Кодинг / Математика</span>
                        </TabsTrigger>
                        <TabsTrigger className="py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all" value="chat">
                            <span className="font-semibold">High-Load Чат-бот</span>
                        </TabsTrigger>
                        <TabsTrigger className="py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all" value="documents">
                            <span className="font-semibold">Анализ Больших Архивов</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Part 2: Charts per Benchmark */}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">2. Аналитика бенчмарков</label>
                </div>

                <Card className="border-none shadow-sm bg-transparent">
                    <CardContent className="p-0">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-6 w-full overflow-x-auto pb-2 no-scrollbar">
                                {ALL_BENCHMARKS.map(b => {
                                    const isRelevant = relevantBenchmarks.has(b.key)
                                    return (
                                        <TabsTrigger
                                            key={b.key}
                                            value={b.key}
                                            className={cn(
                                                "border transition-all px-4 py-2 rounded-full",
                                                isRelevant
                                                    ? "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                                    : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted data-[state=active]:bg-foreground data-[state=active]:text-background"
                                            )}
                                        >
                                            {b.label}
                                            {isRelevant && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                                        </TabsTrigger>
                                    )
                                })}
                            </TabsList>

                            {ALL_BENCHMARKS.map(benchmark => (
                                <TabsContent key={benchmark.key} value={benchmark.key} className="mt-0">
                                    <Card className="border shadow-sm">
                                        <CardHeader>
                                            <CardTitle>{benchmark.label}</CardTitle>
                                            <CardDescription>
                                                Серым цветом выделены модели, не подходящие под выбранный сценарий <b>{
                                                    scenario === 'coding' ? 'Кодинг' :
                                                        scenario === 'chat' ? 'Чат' : 'Документы'
                                                }</b>.
                                                {benchmark.invert && " (Меньше — лучше)"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="h-[500px] w-full pt-2">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    layout="vertical"
                                                    data={chartData}
                                                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                                                    barCategoryGap="15%"
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="hsl(var(--border))" opacity={0.5} />
                                                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                                                    <YAxis
                                                        dataKey="name"
                                                        type="category"
                                                        width={170}
                                                        stroke="hsl(var(--foreground))"
                                                        fontSize={11}
                                                        fontWeight={500}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        interval={0}
                                                    />
                                                    <Tooltip
                                                        cursor={{ fill: 'hsl(var(--accent))', opacity: 0.2 }}
                                                        contentStyle={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none', backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
                                                    />
                                                    <Bar
                                                        dataKey={benchmark.key}
                                                        name={benchmark.label}
                                                        radius={[0, 4, 4, 0]}
                                                        barSize={24}
                                                    >
                                                        {chartData.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={entry.isActive ? benchmark.color : "hsl(var(--muted-foreground))"}
                                                                fillOpacity={entry.isActive ? 1 : 0.3}
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Filtered List */}
            <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">3. Рекомендуемые модели ({filteredModelsForCards.length})</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {filteredModelsForCards.map((model, index) => (
                        <ModelCard key={model.id} model={model} rank={index + 1} scenario={scenario} />
                    ))}
                    {filteredModelsForCards.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/10 border-dashed border-2 rounded-xl">
                            Нет моделей, идеально подходящих под фильтры сценария.
                            <br />
                            Посмотрите на диаграмму выше, чтобы выбрать ближайший аналог.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ModelCard({ model, rank, scenario }: { model: ModelData; rank: number; scenario: Scenario }) {
    const isTopPick = rank === 1

    return (
        <Card className={cn("flex flex-col overflow-hidden transition-all hover:shadow-lg border bg-card group", isTopPick && "border-primary/50 ring-1 ring-primary/20 shadow-md")}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{model.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1 font-mono text-xs">
                            <Badge variant="outline" className="rounded-sm font-normal text-muted-foreground border-border bg-muted/20">
                                {model.params}B
                            </Badge>
                            <span className="text-muted-foreground/50 text-[10px]">●</span>
                            <span className="text-muted-foreground">{model.architecture}</span>
                        </CardDescription>
                    </div>
                    {isTopPick && <Badge variant="default" className="bg-primary hover:bg-primary shadow-sm">Choice #1</Badge>}
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-3">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center text-sm border-b border-border/50 pb-2 border-dashed">
                        <span className="text-muted-foreground text-xs uppercase tracking-wide">Context Window</span>
                        <span className="font-semibold font-mono">{(model.context_window / 1000).toLocaleString()}k</span>
                    </div>

                    <ScenarioBenchmarks model={model} scenario={scenario} />

                </div>
            </CardContent>

            <CardFooter className="pt-2 pb-4 border-t bg-muted/5 mt-auto">
                <div className="flex flex-wrap gap-1.5 w-full">
                    {/* Always show key metrics badges */}
                    <div className="flex gap-1.5 flex-wrap">
                        {model.capabilities.coding === 'Excellent' &&
                            <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 border-green-500/20">Coding ⭐</Badge>
                        }
                        {model.capabilities.reasoning === 'Excellent' &&
                            <Badge variant="secondary" className="text-[10px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20">Reasoning</Badge>
                        }
                        {model.capabilities.reasoning === 'Think Mode' &&
                            <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-400 hover:bg-purple-500/20 border-purple-500/20">Think Mode 🧠</Badge>
                        }
                        {model.architecture === 'MoE' &&
                            <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/20">MoE</Badge>
                        }
                    </div>
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
                <MetricRow label="TTFT" value={b.ttft_ms} unit="ms" invert />
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

function MetricRow({ label, value, max = 100, invert = false, unit = '' }: { label: string; value?: number; max?: number; invert?: boolean; unit?: string }) {
    if (value === undefined) return null

    let colorClass = "text-foreground"
    if (invert) {
        if (value < 20) colorClass = "text-green-600 dark:text-green-400"
        else if (value < 50) colorClass = "text-yellow-600 dark:text-yellow-400"
        else colorClass = "text-red-600 dark:text-red-400"
    } else {
        if (value > 80) colorClass = "text-green-600 dark:text-green-400"
        else if (value > 60) colorClass = "text-yellow-600 dark:text-yellow-400"
        else colorClass = "text-red-600 dark:text-red-400"
    }

    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className={cn("font-medium font-mono", colorClass)}>{value}{unit}</span>
        </div>
    )
}

function BenchmarkBadge({ label, value, text }: { label: string; value?: number; text?: string }) {
    if (value === undefined && !text) return null
    return (
        <Badge variant="secondary" className="px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground bg-secondary/50">
            {label}: {text || value}
        </Badge>
    )
}
