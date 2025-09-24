#!/usr/bin/env python3
"""
Главный скрипт для запуска всех парсеров
Запускает парсинг имен, цитат и слов из открытых источников
"""

import os
import sys
import subprocess
import time
from datetime import datetime

def run_parser(script_name: str, description: str):
    """Запускает парсер и обрабатывает результат"""
    print(f"\n{'='*60}")
    print(f"🚀 {description}")
    print(f"{'='*60}")
    
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

def create_requirements():
    """Создает файл requirements.txt"""
    requirements = [
        "requests>=2.28.0",
        "beautifulsoup4>=4.11.0",
        "lxml>=4.9.0"
    ]
    
    with open('requirements.txt', 'w') as f:
        f.write('\n'.join(requirements))
    
    print("📦 Создан файл requirements.txt")

def install_requirements():
    """Устанавливает необходимые зависимости"""
    print("📦 Установка зависимостей...")
    
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True)
        print("✅ Зависимости установлены")
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка при установке зависимостей: {e}")
        return False
    
    return True

def main():
    """Главная функция"""
    print("🎯 ПАРСЕР ДАННЫХ ДЛЯ ГЕНЕРАТОРА СЛУЧАЙНОСТЕЙ")
    print("=" * 60)
    print(f"📅 Дата запуска: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Проверяем, что мы в правильной директории
    if not os.path.exists('scripts'):
        print("❌ Ошибка: папка 'scripts' не найдена")
        print("Запустите скрипт из корневой директории проекта")
        return
    
    # Переходим в папку scripts
    os.chdir('scripts')
    
    # Создаем requirements.txt
    create_requirements()
    
    # Устанавливаем зависимости
    if not install_requirements():
        print("❌ Не удалось установить зависимости. Завершение работы.")
        return
    
    # Запускаем парсеры
    parsers = [
        ('parse_names.py', 'Парсинг русских имен'),
        ('parse_quotes.py', 'Парсинг цитат'),
        ('parse_words.py', 'Парсинг русских слов')
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
    
    print(f"\n{'='*60}")
    print(f"🎉 ПАРСИНГ ЗАВЕРШЕН!")
    print(f"⏱️  Время выполнения: {duration:.2f} секунд")
    print(f"{'='*60}")
    
    # Проверяем результаты
    print("\n📊 ПРОВЕРКА РЕЗУЛЬТАТОВ:")
    
    result_files = [
        '../src/data/parsed_names.json',
        '../src/data/parsed_quotes.json', 
        '../src/data/parsed_words.json'
    ]
    
    for file_path in result_files:
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            print(f"✅ {file_path} - {file_size} байт")
        else:
            print(f"❌ {file_path} - файл не найден")
    
    print("\n📝 СЛЕДУЮЩИЕ ШАГИ:")
    print("1. Проверьте собранные данные в папке src/data/")
    print("2. При необходимости отредактируйте данные")
    print("3. Интегрируйте данные в существующие файлы")
    print("4. Проверьте с юристом на предмет авторских прав")

if __name__ == "__main__":
    main()
