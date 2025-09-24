#!/usr/bin/env python3
"""
Парсер цитат из открытых источников
Собирает качественные цитаты с citaty.info и других открытых источников
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from typing import List, Dict
from urllib.parse import urljoin, urlparse

class QuotesParser:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
    def parse_citaty_info(self) -> List[Dict]:
        """Парсинг цитат с citaty.info"""
        print("🔍 Парсинг цитат с citaty.info...")
        
        quotes = []
        base_url = "https://citaty.info"
        
        # Страницы с цитатами
        pages = [
            "/random",
            "/category/motivatsiya",
            "/category/uspekh",
            "/category/zhizn",
            "/category/mudrost",
            "/category/lyubov"
        ]
        
        for page in pages:
            try:
                url = urljoin(base_url, page)
                print(f"📄 Обрабатываю: {url}")
                
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Ищем цитаты в различных элементах
                quote_elements = soup.find_all(['div', 'blockquote', 'p'], class_=re.compile(r'quote|text|content'))
                
                for element in quote_elements:
                    quote_data = self.extract_quote_from_element(element)
                    if quote_data:
                        quotes.append(quote_data)
                
                time.sleep(2)  # Вежливая задержка
                
            except Exception as e:
                print(f"❌ Ошибка при парсинге {url}: {e}")
                continue
        
        return quotes
    
    def parse_wikiquote(self) -> List[Dict]:
        """Парсинг цитат с Викицитатника"""
        print("🔍 Парсинг цитат с Викицитатника...")
        
        quotes = []
        
        # Страницы с известными цитатами
        pages = [
            "https://ru.wikiquote.org/wiki/Альберт_Эйнштейн",
            "https://ru.wikiquote.org/wiki/Стив_Джобс",
            "https://ru.wikiquote.org/wiki/Уинстон_Черчилль",
            "https://ru.wikiquote.org/wiki/Лев_Толстой",
            "https://ru.wikiquote.org/wiki/Антон_Чехов"
        ]
        
        for url in pages:
            try:
                print(f"📄 Обрабатываю: {url}")
                
                response = self.session.get(url, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Извлекаем имя автора из заголовка
                author = self.extract_author_from_wikiquote(soup)
                
                # Ищем цитаты
                quote_elements = soup.find_all(['li', 'p'], string=re.compile(r'[А-Яа-яЁё].*'))
                
                for element in quote_elements:
                    text = element.get_text().strip()
                    
                    if self.is_valid_quote(text):
                        quotes.append({
                            'text': text,
                            'author': author,
                            'source': 'Викицитатник'
                        })
                
                time.sleep(2)  # Вежливая задержка
                
            except Exception as e:
                print(f"❌ Ошибка при парсинге {url}: {e}")
                continue
        
        return quotes
    
    def parse_open_sources(self) -> List[Dict]:
        """Парсинг из других открытых источников"""
        print("🔍 Парсинг из открытых источников...")
        
        quotes = []
        
        # Открытые источники с цитатами
        sources = [
            {
                'url': 'https://ru.citaty.net/random',
                'selectors': {
                    'quote': '.quote-text',
                    'author': '.quote-author'
                }
            }
        ]
        
        for source in sources:
            try:
                print(f"📄 Обрабатываю: {source['url']}")
                
                response = self.session.get(source['url'], timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Ищем цитаты по селекторам
                quote_elements = soup.select(source['selectors']['quote'])
                author_elements = soup.select(source['selectors']['author'])
                
                for i, quote_elem in enumerate(quote_elements):
                    text = quote_elem.get_text().strip()
                    
                    author = "Неизвестный автор"
                    if i < len(author_elements):
                        author = author_elements[i].get_text().strip()
                    
                    if self.is_valid_quote(text):
                        quotes.append({
                            'text': text,
                            'author': author,
                            'source': 'Открытые источники'
                        })
                
                time.sleep(2)  # Вежливая задержка
                
            except Exception as e:
                print(f"❌ Ошибка при парсинге {source['url']}: {e}")
                continue
        
        return quotes
    
    def extract_quote_from_element(self, element) -> Dict:
        """Извлекает цитату из HTML элемента"""
        text = element.get_text().strip()
        
        if not self.is_valid_quote(text):
            return None
        
        # Пытаемся найти автора в том же элементе или рядом
        author = self.extract_author_from_element(element)
        
        return {
            'text': text,
            'author': author,
            'source': 'citaty.info'
        }
    
    def extract_author_from_element(self, element) -> str:
        """Извлекает автора из HTML элемента"""
        # Ищем автора в атрибутах или соседних элементах
        author_selectors = ['.author', '.quote-author', '[class*="author"]']
        
        for selector in author_selectors:
            author_elem = element.find(class_=re.compile(r'author'))
            if author_elem:
                return author_elem.get_text().strip()
        
        # Ищем автора в родительском элементе
        parent = element.parent
        if parent:
            author_elem = parent.find(class_=re.compile(r'author'))
            if author_elem:
                return author_elem.get_text().strip()
        
        return "Неизвестный автор"
    
    def extract_author_from_wikiquote(self, soup) -> str:
        """Извлекает имя автора из страницы Викицитатника"""
        title = soup.find('h1')
        if title:
            return title.get_text().strip()
        return "Неизвестный автор"
    
    def is_valid_quote(self, text: str) -> bool:
        """Проверяет, является ли текст валидной цитатой"""
        if not text or len(text) < 10 or len(text) > 500:
            return False
        
        # Проверяем, что текст содержит русские буквы
        if not re.search(r'[А-Яа-яЁё]', text):
            return False
        
        # Исключаем технические тексты
        exclude_patterns = [
            r'^\d+$',  # Только цифры
            r'^[А-Яа-яЁё\s]*$',  # Только русские буквы и пробелы (слишком просто)
            r'категория|страница|вики|ссылка',  # Технические слова
        ]
        
        for pattern in exclude_patterns:
            if re.search(pattern, text.lower()):
                return False
        
        return True
    
    def clean_quote(self, quote: Dict) -> Dict:
        """Очищает цитату от лишних символов"""
        text = quote['text']
        
        # Убираем лишние пробелы и переносы строк
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Убираем кавычки в начале и конце
        text = re.sub(r'^["\']+|["\']+$', '', text)
        
        # Очищаем имя автора
        author = quote['author']
        author = re.sub(r'[^\w\s\-\.]', '', author).strip()
        
        return {
            'text': text,
            'author': author,
            'source': quote.get('source', 'Неизвестный источник')
        }
    
    def remove_duplicates(self, quotes: List[Dict]) -> List[Dict]:
        """Удаляет дубликаты цитат"""
        seen_texts = set()
        unique_quotes = []
        
        for quote in quotes:
            text_lower = quote['text'].lower()
            if text_lower not in seen_texts:
                seen_texts.add(text_lower)
                unique_quotes.append(quote)
        
        return unique_quotes
    
    def save_to_json(self, data: List[Dict], filename: str):
        """Сохраняет данные в JSON файл"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"💾 Данные сохранены в {filename}")
    
    def run(self):
        """Запускает полный процесс парсинга"""
        print("🚀 Запуск парсера цитат...")
        
        # Парсим из разных источников
        citaty_quotes = self.parse_citaty_info()
        wikiquote_quotes = self.parse_wikiquote()
        open_sources_quotes = self.parse_open_sources()
        
        # Объединяем все цитаты
        all_quotes = citaty_quotes + wikiquote_quotes + open_sources_quotes
        
        # Очищаем и валидируем
        cleaned_quotes = []
        for quote in all_quotes:
            cleaned = self.clean_quote(quote)
            if self.is_valid_quote(cleaned['text']):
                cleaned_quotes.append(cleaned)
        
        # Удаляем дубликаты
        unique_quotes = self.remove_duplicates(cleaned_quotes)
        
        # Формируем итоговые данные
        result = {
            'quotes': unique_quotes,
            'totalQuotes': len(unique_quotes),
            'sources': [
                'citaty.info - коллекция мотивационных цитат',
                'Викицитатник - цитаты известных личностей',
                'Открытые источники с базами цитат'
            ],
            'lastUpdated': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Сохраняем результат
        self.save_to_json(result, '../src/data/parsed_quotes.json')
        
        print(f"✅ Парсинг завершен!")
        print(f"📊 Найдено цитат: {len(unique_quotes)}")

if __name__ == "__main__":
    parser = QuotesParser()
    parser.run()
