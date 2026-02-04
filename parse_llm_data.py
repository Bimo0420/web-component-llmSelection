#!/usr/bin/env python3
"""
Парсер данных LLM из llm.md в TypeScript формат
"""
import re
import json

def parse_value(value_str):
    """Парсит значение, обрабатывая n/a как null"""
    value_str = value_str.strip()
    if value_str.lower() == 'n/a' or value_str == '':
        return None
    # Заменяем запятую на точку для чисел
    value_str = value_str.replace(',', '.')
    try:
        # Пробуем преобразовать в число
        if '.' in value_str:
            return float(value_str)
        return int(value_str)
    except ValueError:
        return value_str

def parse_llm_md(file_path):
    """Парсит llm.md и возвращает список моделей"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    models = []
    # Разбиваем на блоки моделей
    model_blocks = re.split(r'## Модель \d+', content)[1:]  # Пропускаем первый пустой элемент
    
    for block in model_blocks:
        lines = [line.strip() for line in block.strip().split('\n') if line.strip() and line.strip().startswith('-')]
        
        model = {}
        for line in lines:
            # Убираем "- " в начале
            line = line[2:].strip()
            
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip()
                
                # Обработка специальных случаев
                if key == 'LLM':
                    model['id'] = value
                    model['name'] = value
                elif key == 'Parameters':
                    model['params'] = parse_value(value)
                elif key == 'Active Parameters':
                    model['active_params'] = parse_value(value)
                elif key == 'Context Window':
                    model['context_window'] = parse_value(value.replace(' ', ''))
                elif key == 'Architecture':
                    model['architecture'] = value
                elif key == 'Reasoning':
                    model['reasoning'] = value.lower() == 'yes'
                elif key == 'Visual':
                    model['visual'] = value.lower() == 'yes'
                elif key == 'Open Source / Open Weights':
                    model['open_source'] = value
                elif key == 'Output Speed (t/s)':
                    model['speed'] = parse_value(value)
                elif key == 'Q16':
                    if 'memory' not in model:
                        model['memory'] = {}
                    model['memory']['q16'] = parse_value(value)
                elif key == 'Q8':
                    if 'memory' not in model:
                        model['memory'] = {}
                    model['memory']['q8'] = parse_value(value)
                elif key == 'Q4':
                    if 'memory' not in model:
                        model['memory'] = {}
                    model['memory']['q4'] = parse_value(value)
                elif key == 'SFP8':
                    if 'memory' not in model:
                        model['memory'] = {}
                    model['memory']['sfp8'] = parse_value(value)
                elif key == 'MXFP4':
                    if 'memory' not in model:
                        model['memory'] = {}
                    model['memory']['mxfp4'] = parse_value(value)
                elif 'KV-кэш' in key or 'GB \\ 100k token \\ FP16' in key:
                    # Извлекаем число из строки типа "GB \ 100k token \ FP16: 6,87"
                    model['kv_cache_per_100k_tokens'] = parse_value(value)
                elif key == 'AA-LCR (Long Context Reasoning)':
                    if 'benchmarks' not in model:
                        model['benchmarks'] = {}
                    model['benchmarks']['aa_lcr'] = parse_value(value)
                elif key == 'AA-Omniscience Accuracy':
                    if 'benchmarks' not in model:
                        model['benchmarks'] = {}
                    model['benchmarks']['aa_omniscience_accuracy'] = parse_value(value)
                elif 'AA-Omniscience non-halucination' in key or 'AA-Omniscience Non-Hallucination' in key:
                    if 'benchmarks' not in model:
                        model['benchmarks'] = {}
                    model['benchmarks']['aa_omniscience_non_hallucination'] = parse_value(value)
                elif key == 'IFBench':
                    if 'benchmarks' not in model:
                        model['benchmarks'] = {}
                    model['benchmarks']['ifbench'] = parse_value(value)
                elif 'MMMU Pro' in key:
                    if 'benchmarks' not in model:
                        model['benchmarks'] = {}
                    val = parse_value(value)
                    # Если значение "no", то null
                    if isinstance(val, str) and val.lower() == 'no':
                        val = None
                    model['benchmarks']['mmmu_pro'] = val
        
        if model:
            models.append(model)
    
    return models

def generate_typescript(models):
    """Генерирует TypeScript код для массива MODELS"""
    ts_lines = ["export const MODELS: ModelData[] = ["]
    
    for i, model in enumerate(models):
        ts_lines.append("    {")
        ts_lines.append(f'        id: "{model["id"]}",')
        ts_lines.append(f'        name: "{model["name"]}",')
        ts_lines.append(f'        architecture: "{model["architecture"]}",')
        ts_lines.append(f'        params: {model["params"]},')
        ts_lines.append(f'        active_params: {model["active_params"]},')
        ts_lines.append(f'        context_window: {model["context_window"]},')
        ts_lines.append(f'        reasoning: {str(model["reasoning"]).lower()},')
        ts_lines.append(f'        visual: {str(model["visual"]).lower()},')
        ts_lines.append(f'        open_source: "{model["open_source"]}",')
        
        # Speed
        speed_val = model.get("speed")
        ts_lines.append(f'        speed: {speed_val if speed_val is not None else "null"},')
        
        # Memory
        mem = model.get("memory", {})
        mem_parts = [f'q16: {mem.get("q16", 0)}']
        if mem.get("q8") is not None:
            mem_parts.append(f'q8: {mem["q8"]}')
        if mem.get("q4") is not None:
            mem_parts.append(f'q4: {mem["q4"]}')
        if mem.get("sfp8") is not None:
            mem_parts.append(f'sfp8: {mem["sfp8"]}')
        if mem.get("mxfp4") is not None:
            mem_parts.append(f'mxfp4: {mem["mxfp4"]}')
        
        ts_lines.append(f'        memory: {{ {", ".join(mem_parts)} }},')
        ts_lines.append(f'        kv_cache_per_100k_tokens: {model.get("kv_cache_per_100k_tokens", 0)},')
        
        # Benchmarks
        bench = model.get("benchmarks", {})
        bench_parts = []
        for key in ['aa_lcr', 'aa_omniscience_accuracy', 'aa_omniscience_non_hallucination', 'ifbench', 'mmmu_pro']:
            val = bench.get(key)
            if val is not None:
                bench_parts.append(f'{key}: {val}')
        
        ts_lines.append(f'        benchmarks: {{ {", ".join(bench_parts)} }},')
        
        # Закрываем объект модели
        if i < len(models) - 1:
            ts_lines.append("    },")
        else:
            ts_lines.append("    }")
    
    ts_lines.append("];")
    
    return '\n'.join(ts_lines)

if __name__ == '__main__':
    import sys
    
    input_file = r'c:\Users\alexe\VAA\ai\ass\web-components\llmSelection\src\data\ini\llm.md'
    
    print("Парсинг llm.md...")
    models = parse_llm_md(input_file)
    print(f"Найдено моделей: {len(models)}")
    
    print("\nГенерация TypeScript кода...")
    ts_code = generate_typescript(models)
    
    output_file = r'c:\Users\alexe\VAA\ai\ass\web-components\llmSelection\models_generated.ts'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(ts_code)
    
    print(f"Код сохранён в: {output_file}")
    print("\nПервые 3 модели:")
    for i, model in enumerate(models[:3]):
        print(f"\n{i+1}. {model['name']}")
        print(f"   Params: {model['params']}B, Speed: {model.get('speed', 'n/a')} t/s")
