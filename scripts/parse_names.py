#!/usr/bin/env python3
"""
Парсер русских имен из открытых источников
Собирает качественные данные из Википедии и других открытых источников
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from typing import List, Set

class RussianNamesParser:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
    def parse_wikipedia_names(self) -> dict:
        """Парсинг имен из Википедии"""
        print("🔍 Парсинг имен из Википедии...")
        
        # Ссылки на страницы с популярными русскими именами
        urls = [
            "https://ru.wikipedia.org/wiki/Список_популярных_русских_имён",
            "https://ru.wikipedia.org/wiki/Категория:Русские_мужские_имена",
            "https://ru.wikipedia.org/wiki/Категория:Русские_женские_имена"
        ]
        
        male_names = set()
        female_names = set()
        
        for url in urls:
            try:
                print(f"📄 Обрабатываю: {url}")
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Ищем имена в различных элементах
                for element in soup.find_all(['li', 'td', 'a']):
                    text = element.get_text().strip()
                    
                    # Фильтруем только русские имена
                    if self.is_russian_name(text):
                        # Определяем пол по контексту или другим признакам
                        if self.is_male_name(text, element):
                            male_names.add(text)
                        elif self.is_female_name(text, element):
                            female_names.add(text)
                
                time.sleep(1)  # Вежливая задержка
                
            except Exception as e:
                print(f"❌ Ошибка при парсинге {url}: {e}")
                continue
        
        return {
            'male': list(male_names),
            'female': list(female_names)
        }
    
    def parse_open_sources(self) -> dict:
        """Парсинг из других открытых источников"""
        print("🔍 Парсинг из открытых источников...")
        
        # Список открытых источников с именами
        sources = [
            {
                'url': 'https://imena-znachenie.ru/popularnye-russkie-imena',
                'type': 'popular'
            },
            {
                'url': 'https://kakzovut.ru/russkie-imena',
                'type': 'general'
            }
        ]
        
        male_names = set()
        female_names = set()
        
        for source in sources:
            try:
                print(f"📄 Обрабатываю: {source['url']}")
                response = self.session.get(source['url'], timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Ищем имена в тексте
                for element in soup.find_all(['div', 'span', 'p', 'li']):
                    text = element.get_text().strip()
                    
                    # Извлекаем имена из текста
                    names = self.extract_names_from_text(text)
                    
                    for name in names:
                        if self.is_male_name(name, element):
                            male_names.add(name)
                        elif self.is_female_name(name, element):
                            female_names.add(name)
                
                time.sleep(2)  # Вежливая задержка
                
            except Exception as e:
                print(f"❌ Ошибка при парсинге {source['url']}: {e}")
                continue
        
        return {
            'male': list(male_names),
            'female': list(female_names)
        }
    
    def is_russian_name(self, text: str) -> bool:
        """Проверяет, является ли текст русским именем"""
        if not text or len(text) < 2 or len(text) > 20:
            return False
        
        # Проверяем, что текст содержит только русские буквы
        if not re.match(r'^[А-Яа-яЁё\s\-]+$', text):
            return False
        
        # Исключаем общие слова
        exclude_words = ['имя', 'имена', 'список', 'категория', 'страница', 'википедия']
        if any(word in text.lower() for word in exclude_words):
            return False
        
        return True
    
    def is_male_name(self, name: str, element) -> bool:
        """Определяет, является ли имя мужским"""
        # Простые правила определения пола по окончаниям
        male_endings = ['ов', 'ев', 'ин', 'ский', 'цкий', 'ич', 'он', 'ен']
        
        # Проверяем контекст вокруг элемента
        context = str(element.parent) if element.parent else ""
        
        male_indicators = ['мужск', 'мальчик', 'папа', 'сын', 'брат', 'муж']
        female_indicators = ['женск', 'девочка', 'мама', 'дочь', 'сестра', 'жена']
        
        if any(indicator in context.lower() for indicator in male_indicators):
            return True
        if any(indicator in context.lower() for indicator in female_indicators):
            return False
        
        # Проверяем окончания
        for ending in male_endings:
            if name.lower().endswith(ending):
                return True
        
        return False
    
    def is_female_name(self, name: str, element) -> bool:
        """Определяет, является ли имя женским"""
        # Простые правила определения пола по окончаниям
        female_endings = ['а', 'я', 'ова', 'ева', 'ина', 'ская', 'цкая']
        
        # Проверяем контекст вокруг элемента
        context = str(element.parent) if element.parent else ""
        
        female_indicators = ['женск', 'девочка', 'мама', 'дочь', 'сестра', 'жена']
        male_indicators = ['мужск', 'мальчик', 'папа', 'сын', 'брат', 'муж']
        
        if any(indicator in context.lower() for indicator in female_indicators):
            return True
        if any(indicator in context.lower() for indicator in male_indicators):
            return False
        
        # Проверяем окончания
        for ending in female_endings:
            if name.lower().endswith(ending):
                return True
        
        return False
    
    def extract_names_from_text(self, text: str) -> List[str]:
        """Извлекает потенциальные имена из текста"""
        # Разбиваем текст на слова
        words = re.findall(r'[А-Яа-яЁё]+', text)
        
        names = []
        for word in words:
            if self.is_russian_name(word):
                names.append(word)
        
        return names
    
    def clean_and_validate_names(self, names: List[str]) -> List[str]:
        """Очищает и валидирует список имен"""
        cleaned = []
        
        for name in names:
            # Очищаем от лишних символов
            name = re.sub(r'[^\w\-]', '', name.strip())
            
            # Проверяем длину и содержание
            if 2 <= len(name) <= 20 and re.match(r'^[А-Яа-яЁё]+$', name):
                # Приводим к правильному регистру
                name = name.capitalize()
                cleaned.append(name)
        
        # Удаляем дубликаты и сортируем
        return sorted(list(set(cleaned)))
    
    def save_to_json(self, data: dict, filename: str):
        """Сохраняет данные в JSON файл"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"💾 Данные сохранены в {filename}")
    
    def run(self):
        """Запускает полный процесс парсинга"""
        print("🚀 Запуск парсера русских имен...")
        
        # Парсим из разных источников
        wikipedia_data = self.parse_wikipedia_names()
        open_sources_data = self.parse_open_sources()
        
        # Объединяем данные
        all_male_names = set(wikipedia_data['male'] + open_sources_data['male'])
        all_female_names = set(wikipedia_data['female'] + open_sources_data['female'])
        
        # Очищаем и валидируем
        cleaned_male = self.clean_and_validate_names(list(all_male_names))
        cleaned_female = self.clean_and_validate_names(list(all_female_names))
        
        # Формируем итоговые данные
        result = {
            'maleNames': cleaned_male,
            'femaleNames': cleaned_female,
            'totalMale': len(cleaned_male),
            'totalFemale': len(cleaned_female),
            'totalNames': len(cleaned_male) + len(cleaned_female),
            'sources': [
                'Википедия - списки популярных русских имен',
                'Открытые источники с базами имен'
            ],
            'lastUpdated': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Сохраняем результат
        self.save_to_json(result, '../src/data/parsed_names.json')
        
        print(f"✅ Парсинг завершен!")
        print(f"📊 Найдено мужских имен: {len(cleaned_male)}")
        print(f"📊 Найдено женских имен: {len(cleaned_female)}")
        print(f"📊 Всего имен: {len(cleaned_male) + len(cleaned_female)}")

if __name__ == "__main__":
    parser = RussianNamesParser()
    parser.run()
