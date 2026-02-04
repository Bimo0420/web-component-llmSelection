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
import { Eye, BookOpen } from "lucide-react"

type Scenario = "coding" | "chat" | "documents"

// Definition of all available benchmarks
const ALL_BENCHMARKS: { key: keyof ModelData['benchmarks']; label: string; description: string; invert?: boolean; color: string }[] = [
    { key: "aa_lcr", label: "AA-LCR", description: "Long Context Reasoning — способность работать с длинным контекстом и рассуждать.", color: "hsl(142, 71%, 45%)" },
    { key: "aa_omniscience_accuracy", label: "AA Accuracy", description: "Точность ответов модели на основе всезнания.", color: "hsl(200, 71%, 45%)" },
    { key: "aa_omniscience_non_hallucination", label: "AA Non-Hallucination", description: "Способность избегать галлюцинаций в ответах.", color: "hsl(280, 71%, 45%)" },
    { key: "hle", label: "HLE", description: "Humanity's Last Exam — сложный экзамен на общие знания.", color: "hsl(30, 71%, 45%)" },
    { key: "gpqa_diamond", label: "GPQA Diamond", description: "Graduate-level Physics Question Answering — физика на уровне аспирантуры.", color: "hsl(260, 71%, 45%)" },
    { key: "ifbench", label: "IFBench", description: "Instruction Following Benchmark — следование инструкциям.", color: "hsl(180, 71%, 45%)" },
    { key: "mmmu_pro", label: "MMMU Pro", description: "Multimodal Understanding — визуальное рассуждение и понимание.", color: "hsl(320, 71%, 45%)" },
]

// Mapping which benchmarks are relevant for which scenario
const SCENARIO_RELEVANCE: Record<Scenario, (keyof ModelData['benchmarks'])[]> = {
    coding: ["ifbench", "gpqa_diamond", "aa_lcr"],
    chat: ["aa_omniscience_non_hallucination", "hle"],
    documents: ["aa_lcr", "aa_omniscience_accuracy"],
}

export function LocalLLMSelector() {
    const [scenario, setScenario] = React.useState<Scenario>("chat")
    const [activeTab, setActiveTab] = React.useState<string>("aa_lcr")

    // Determine relevant benchmarks for the selected scenario
    const relevantBenchmarks = React.useMemo(() => new Set(SCENARIO_RELEVANCE[scenario]), [scenario])

    // Calculate which models are "active" (filtered) based on criteria
    // User requested to remove all filters, so all models are active
    const activeModelIds = React.useMemo(() => {
        return new Set(MODELS.map(m => m.id))
    }, [])

    // Filtered models for the card list (only active ones)
    const filteredModelsForCards = React.useMemo(() => {
        const active = [...MODELS]

        // Always sort by params (descending)
        active.sort((a, b) => b.params - a.params)

        return active
    }, [])

    // Data for charts: ALL models with grouping headers
    const chartData = React.useMemo(() => {
        const sorted = [...MODELS].sort((a, b) => b.params - a.params);
        const result: any[] = [];

        const large = sorted.filter(m => m.params >= 40);
        const small = sorted.filter(m => m.params < 40);

        if (large.length > 0) {
            result.push({
                name: "HEADER_LARGE",
                isHeader: true,
                headerLabel: "Средние и Крупные (>40B)"
            });
            result.push(...large.map(m => ({
                ...m,
                ...m.benchmarks,
                isActive: true,
            })));
        }

        if (small.length > 0) {
            result.push({
                name: "HEADER_SMALL",
                isHeader: true,
                headerLabel: "Малые модели (<40B)"
            });
            result.push(...small.map(m => ({
                ...m,
                ...m.benchmarks,
                isActive: true,
            })));
        }
        return result;
    }, [])

    const CustomYAxisTick = (props: any) => {
        const { x, y, payload } = props;
        const dataPoint = chartData.find(d => d.name === payload.value);
        if (!dataPoint) return null;

        if (dataPoint.isHeader) {
            return (
                <g transform={`translate(${x},${y})`}>
                    <text x={10} y={0} dy={4} textAnchor="start" fontSize={10} fontWeight="700" fill="hsl(var(--muted-foreground))" className="uppercase tracking-widest opacity-60">
                        {dataPoint.headerLabel}
                    </text>
                </g>
            );
        }

        return (
            <g transform={`translate(${x},${y})`}>
                <foreignObject x={-175} y={-12} width={175} height={24}>
                    <div className="flex items-center justify-end gap-1.5 h-full px-2">
                        <div className="flex items-center gap-1 shrink-0">
                            {(dataPoint.architecture === 'MoE' || dataPoint.architecture === 'Hybrid MoE' || dataPoint.architecture === 'Hybrid Linear') && (
                                <span className="text-[7px] font-bold text-purple-600 bg-purple-500/10 px-0.5 rounded leading-tight border border-purple-500/20">{dataPoint.architecture === 'MoE' ? 'MoE' : 'Hybrid'}</span>
                            )}
                            {dataPoint.visual && (
                                <Eye className="h-3 w-3 text-amber-500" />
                            )}
                            {dataPoint.context_window >= 128 && (
                                <div className="flex items-center gap-0.5">
                                    <BookOpen className="h-3 w-3 text-blue-500 shrink-0" />
                                    {dataPoint.context_window >= 256 && (
                                        <BookOpen className="h-3 w-3 text-blue-500 shrink-0" />
                                    )}
                                    {dataPoint.context_window >= 1000 && (
                                        <BookOpen className="h-3 w-3 text-blue-500 shrink-0" />
                                    )}
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] font-medium truncate text-foreground leading-none">
                            {dataPoint.name}
                        </span>
                    </div>
                </foreignObject>
            </g>
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto p-4 sm:p-6 text-foreground">
            {/* Compact Header & Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-2 rounded-2xl border border-border/50">
                <div className="flex items-center gap-2 pl-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-sm font-bold uppercase tracking-tighter">LLM Selector</h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Scenario Toggle Group */}
                    <div className="flex bg-background/50 p-1 rounded-xl border border-border/40 shadow-sm">
                        {(["chat", "documents", "coding"] as Scenario[]).map((s) => (
                            <button
                                key={s}
                                onClick={() => setScenario(s)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                                    scenario === s
                                        ? "bg-emerald-500 text-white shadow-md scale-[1.02]"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {s === 'coding' ? 'Кодинг' : s === 'chat' ? 'Чат' : 'Документы'}
                            </button>
                        ))}
                    </div>

                    <div className="h-4 w-px bg-border/60 mx-1 hidden md:block" />

                    {/* Benchmark Pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {ALL_BENCHMARKS.map(b => {
                            const isRelevant = relevantBenchmarks.has(b.key)
                            return (
                                <button
                                    key={b.key}
                                    onClick={() => setActiveTab(b.key)}
                                    className={cn(
                                        "px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all flex items-center gap-1.5",
                                        activeTab === b.key
                                            ? "bg-foreground text-background border-foreground shadow-sm"
                                            : isRelevant
                                                ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10"
                                                : "bg-transparent text-muted-foreground border-transparent hover:border-border/50 hover:bg-muted/50"
                                    )}
                                >
                                    {b.label}
                                    {isRelevant && activeTab !== b.key && <div className="w-1 h-1 rounded-full bg-emerald-500" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="mt-2">
                {ALL_BENCHMARKS.filter(b => b.key === activeTab).map(benchmark => (
                    <Card key={benchmark.key} className="border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
                        <div className="px-4 py-3 border-b border-border/50 bg-muted/20 flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-bold flex items-center gap-2">
                                    <span className="w-1.5 h-3 bg-emerald-500 rounded-full" />
                                    {benchmark.label}
                                </h3>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{benchmark.description}</p>
                            </div>
                        </div>
                        <CardContent className="h-[480px] w-full p-2">
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
                                        width={175}
                                        stroke="hsl(var(--foreground))"
                                        fontSize={11}
                                        fontWeight={500}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={0}
                                        tick={<CustomYAxisTick />}
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
                                        {chartData.map((entry, index) => {
                                            if (entry.isHeader) return <Cell key={`cell-${index}`} fill="transparent" />;

                                            const value = entry[benchmark.key];
                                            if (value === undefined) return <Cell key={`cell-${index}`} fill="transparent" />;

                                            // Calculate relative performance for color intensity
                                            const allValues = chartData.filter(d => !d.isHeader && d[benchmark.key] !== undefined).map(d => d[benchmark.key]);
                                            const min = Math.min(...allValues);
                                            const max = Math.max(...allValues);

                                            let intensity = 0.3; // base opacity
                                            if (max !== min) {
                                                const normalized = (value - min) / (max - min);
                                                intensity = benchmark.invert ? (1 - normalized) : normalized;
                                            } else {
                                                intensity = 1;
                                            }

                                            // Map intensity to opacity (0.4 to 1.0) for better visibility
                                            const opacity = 0.4 + (intensity * 0.6);

                                            return (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={benchmark.color}
                                                    fillOpacity={opacity}
                                                />
                                            );
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
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
