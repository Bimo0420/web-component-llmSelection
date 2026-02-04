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
import { Eye, BookOpen, Brain, Unlock, ArrowUpDown, ArrowDownUp, Network } from "lucide-react"

// Definition of all available benchmarks
type BenchmarkKey = keyof ModelData['benchmarks'] | 'speed';

const ALL_BENCHMARKS: { key: BenchmarkKey; label: string; description: string; invert?: boolean; color: string }[] = [
    { key: "aa_lcr", label: "Анализ", description: "AA LCR (Long Context Reasoning) — способность работать с длинным контекстом и рассуждать.", color: "hsl(142, 71%, 45%)" },
    { key: "aa_omniscience_accuracy", label: "Точность", description: "AA Omniscience Accuracy — оценка того, насколько точно модель извлекает факты.", color: "hsl(200, 71%, 45%)" },
    { key: "aa_omniscience_non_hallucination", label: "Галлюцинации", description: "AA Omniscience Non-Hallucination — способность избегать галлюцинаций в ответах.", color: "hsl(280, 71%, 45%)" },
    { key: "ifbench", label: "Исполнительность", description: "IFBench (Instruction Following Benchmark) — тест проверяет не знания, а «послушность» и точность выполнения инструкций.", color: "hsl(180, 71%, 45%)" },
    { key: "speed", label: "Скорость", description: "Скорость генерации ответа (t/s)", color: "hsl(45, 71%, 45%)" },
]

export function LocalLLMSelector() {
    const [activeTab, setActiveTab] = React.useState<string>("aa_lcr")
    const [sortByValue, setSortByValue] = React.useState<boolean>(false)
    const [filters, setFilters] = React.useState({
        moeHybrid: false,
        reasoning: false,
        openSource: false,
        visual: false,
        longContext: false,
    })

    const toggleFilter = (filterKey: keyof typeof filters) => {
        setFilters(prev => ({ ...prev, [filterKey]: !prev[filterKey] }))
    }

    // Calculate which models are "active" (filtered) based on criteria
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
        let filtered = [...MODELS];

        // Apply filters
        if (filters.moeHybrid) {
            filtered = filtered.filter(m =>
                m.architecture === 'MoE' ||
                m.architecture === 'Hybrid MoE' ||
                m.architecture === 'Hybrid Linear'
            );
        }
        if (filters.reasoning) {
            filtered = filtered.filter(m => m.reasoning);
        }
        if (filters.openSource) {
            filtered = filtered.filter(m => m.open_source === 'Open Source');
        }
        if (filters.visual) {
            filtered = filtered.filter(m => m.visual);
        }
        if (filters.longContext) {
            filtered = filtered.filter(m => m.context_window >= 128);
        }

        const sorted = filtered.sort((a, b) => b.params - a.params);
        const result: any[] = [];

        let large = sorted.filter(m => m.params >= 40);
        let small = sorted.filter(m => m.params < 40);

        // Sort by benchmark value if sortByValue is true
        if (sortByValue) {
            const sortFn = (a: any, b: any) => {
                const aVal = activeTab === 'speed' ? a.speed : a.benchmarks[activeTab];
                const bVal = activeTab === 'speed' ? b.speed : b.benchmarks[activeTab];
                if (aVal === undefined && bVal === undefined) return 0;
                if (aVal === undefined) return 1;
                if (bVal === undefined) return -1;
                return bVal - aVal; // descending
            };
            large = large.sort(sortFn);
            small = small.sort(sortFn);
        }

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
    }, [sortByValue, activeTab, filters])

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
                                <div className="flex items-center justify-center text-green-700 bg-green-500/10 px-0.5 rounded border border-green-500/20">
                                    <Network className="h-2.5 w-2.5" />
                                </div>
                            )}
                            {dataPoint.reasoning && (
                                <Brain className="h-3 w-3 text-pink-500" />
                            )}
                            {dataPoint.open_source === 'Open Source' && (
                                <Unlock className="h-3 w-3 text-foreground" />
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
                    {/* Benchmark Pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {ALL_BENCHMARKS.map(b => {
                            return (
                                <button
                                    key={b.key}
                                    onClick={() => setActiveTab(b.key)}
                                    className={cn(
                                        "px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-all flex items-center gap-1.5",
                                        activeTab === b.key
                                            ? "bg-foreground text-background border-foreground shadow-sm"
                                            : "bg-transparent text-muted-foreground border-transparent hover:border-border/50 hover:bg-muted/50"
                                    )}
                                >
                                    {b.label}
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
                            <div className="flex items-center gap-4">
                                {/* Sort Button */}
                                <button
                                    onClick={() => setSortByValue(!sortByValue)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium rounded-lg border transition-all",
                                        sortByValue
                                            ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                                            : "bg-background/50 text-muted-foreground border-border/40 hover:border-border hover:bg-muted/50"
                                    )}
                                    title={sortByValue ? "Сортировка по значению" : "Сортировка по размеру"}
                                >
                                    {sortByValue ? <ArrowDownUp className="h-3 w-3" /> : <ArrowUpDown className="h-3 w-3" />}
                                    <span>{sortByValue ? "По значению" : "По размеру"}</span>
                                </button>
                                {/* Legend - Filter Buttons */}
                                <div className="flex items-center gap-2 text-[9px]">
                                    <button
                                        onClick={() => toggleFilter('moeHybrid')}
                                        className={cn(
                                            "flex items-center gap-1 px-2 py-1 rounded-lg border transition-all",
                                            filters.moeHybrid
                                                ? "bg-green-500/20 border-green-500/50 text-green-700"
                                                : "border-transparent text-muted-foreground hover:bg-muted/50 hover:border-border/40"
                                        )}
                                        title="Фильтр: MoE/Hybrid архитектура"
                                    >
                                        <Network className="h-3 w-3" />
                                        <span>MoE/Hybrid</span>
                                    </button>
                                    <button
                                        onClick={() => toggleFilter('reasoning')}
                                        className={cn(
                                            "flex items-center gap-1 px-2 py-1 rounded-lg border transition-all",
                                            filters.reasoning
                                                ? "bg-pink-500/20 border-pink-500/50 text-pink-600"
                                                : "border-transparent text-muted-foreground hover:bg-muted/50 hover:border-border/40"
                                        )}
                                        title="Фильтр: Reasoning модели"
                                    >
                                        <Brain className="h-3 w-3" />
                                        <span>Reasoning</span>
                                    </button>
                                    <button
                                        onClick={() => toggleFilter('openSource')}
                                        className={cn(
                                            "flex items-center gap-1 px-2 py-1 rounded-lg border transition-all",
                                            filters.openSource
                                                ? "bg-foreground/10 border-foreground/30 text-foreground"
                                                : "border-transparent text-muted-foreground hover:bg-muted/50 hover:border-border/40"
                                        )}
                                        title="Фильтр: Open Source модели"
                                    >
                                        <Unlock className="h-3 w-3" />
                                        <span>Open Source</span>
                                    </button>
                                    <button
                                        onClick={() => toggleFilter('visual')}
                                        className={cn(
                                            "flex items-center gap-1 px-2 py-1 rounded-lg border transition-all",
                                            filters.visual
                                                ? "bg-amber-500/20 border-amber-500/50 text-amber-700"
                                                : "border-transparent text-muted-foreground hover:bg-muted/50 hover:border-border/40"
                                        )}
                                        title="Фильтр: Visual модели"
                                    >
                                        <Eye className="h-3 w-3" />
                                        <span>Visual</span>
                                    </button>
                                    <button
                                        onClick={() => toggleFilter('longContext')}
                                        className={cn(
                                            "flex items-center gap-1 px-2 py-1 rounded-lg border transition-all",
                                            filters.longContext
                                                ? "bg-blue-500/20 border-blue-500/50 text-blue-700"
                                                : "border-transparent text-muted-foreground hover:bg-muted/50 hover:border-border/40"
                                        )}
                                        title="Фильтр: Long Context (≥128k)"
                                    >
                                        <BookOpen className="h-3 w-3" />
                                        <span>Long Context</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <CardContent className="h-[662px] w-full p-2">
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
