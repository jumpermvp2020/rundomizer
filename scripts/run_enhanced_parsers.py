#!/usr/bin/env python3
"""
Главный скрипт для запуска улучшенных парсеров
Запускает парсинг имен, цитат и слов из качественных источников
"""

import os
import sys
import subprocess
import time
from datetime import datetime

def run_parser(script_name: str, description: str):
    """Запускает парсер и обрабатывает результат"""
    print(f"\n{'='*70}")
    print(f"🚀 {description}")
    print(f"{'='*70}")
    
    try:
        # Запускаем скрипт
        result = subprocess.run([sys.executable, script_name], 
                              capture_output=True, text=True, encoding='utf-8')
        
        if result.returncode == 0:
            print(f"✅ {description} - УСПЕШНО")
            print(result.stdout)
        else:
            print(f"❌ {description} - ОШИБКА")
            print(f"STDOUT: {result.stdout}")
            print(f"STDERR: {result.stderr}")
            
    except Exception as e:
        print(f"❌ Ошибка при запуске {script_name}: {e}")

def main():
    """Главная функция"""
    print("🎯 УЛУЧШЕННЫЙ ПАРСЕР ДАННЫХ ДЛЯ ГЕНЕРАТОРА СЛУЧАЙНОСТЕЙ")
    print("=" * 70)
    print(f"📅 Дата запуска: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    # Проверяем, что мы в правильной директории
    if not os.path.exists('scripts'):
        print("❌ Ошибка: папка 'scripts' не найдена")
        print("Запустите скрипт из корневой директории проекта")
        return
    
    # Переходим в папку scripts
    os.chdir('scripts')
    
    # Запускаем улучшенные парсеры
    parsers = [
        ('enhanced_names_parser.py', 'Улучшенный парсинг русских имен'),
        ('enhanced_words_parser.py', 'Улучшенный парсинг русских слов'),
        ('parse_quotes.py', 'Парсинг цитат (существующий)')
    ]
    
    start_time = time.time()
    
    for script, description in parsers:
        if os.path.exists(script):
            run_parser(script, description)
            time.sleep(1)  # Небольшая пауза между парсерами
        else:
            print(f"❌ Файл {script} не найден")
    
    end_time = time.time()
    duration = end_time - start_time
    
    print(f"\n{'='*70}")
    print(f"🎉 УЛУЧШЕННЫЙ ПАРСИНГ ЗАВЕРШЕН!")
    print(f"⏱️  Время выполнения: {duration:.2f} секунд")
    print(f"{'='*70}")
    
    # Проверяем результаты
    print("\n📊 ПРОВЕРКА РЕЗУЛЬТАТОВ:")
    
    result_files = [
        '../src/data/enhanced_names.json',
        '../src/data/enhanced_words.json',
        '../src/data/parsed_quotes.json'
    ]
    
    total_size = 0
    for file_path in result_files:
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            total_size += file_size
            print(f"✅ {file_path} - {file_size:,} байт")
        else:
            print(f"❌ {file_path} - файл не найден")
    
    print(f"\n📈 ОБЩИЙ РАЗМЕР ДАННЫХ: {total_size:,} байт")
    
    print("\n📝 СЛЕДУЮЩИЕ ШАГИ:")
    print("1. Проверьте собранные данные в папке src/data/")
    print("2. Сравните с предыдущими результатами")
    print("3. Интегрируйте лучшие данные в существующие файлы")
    print("4. Проверьте с юристом на предмет авторских прав")

if __name__ == "__main__":
    main()
