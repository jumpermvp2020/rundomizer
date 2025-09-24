#!/usr/bin/env python3
"""
Парсер русских слов из открытых источников
Собирает качественные слова из открытых словарей и корпусов
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from typing import List, Set, Dict

class RussianWordsParser:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
    def parse_wiktionary(self) -> List[str]:
        """Парсинг слов из Викисловаря"""
        print("🔍 Парсинг слов из Викисловаря...")
        
        words = set()
        
        # Категории слов в Викисловаре
        categories = [
            "https://ru.wiktionary.org/wiki/Категория:Существительные_русского_языка",
            "https://ru.wiktionary.org/wiki/Категория:Прилагательные_русского_языка",
            "https://ru.wiktionary.org/wiki/Категория:Глаголы_русского_языка"
        ]
        
        for category_url in categories:
            try:
                print(f"📄 Обрабатываю: {category_url}")
                
                response = self.session.get(category_url, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Ищем ссылки на слова
                word_links = soup.find_all('a', href=re.compile(r'/wiki/[А-Яа-яЁё]'))
                
                for link in word_links:
                    word = link.get_text().strip()
                    if self.is_valid_word(word):
                        words.add(word)
                
                time.sleep(2)  # Вежливая задержка
                
            except Exception as e:
                print(f"❌ Ошибка при парсинге {category_url}: {e}")
                continue
        
        return list(words)
    
    def parse_open_sources(self) -> List[str]:
        """Парсинг из других открытых источников"""
        print("🔍 Парсинг из открытых источников...")
        
        words = set()
        
        # Открытые источники со словами
        sources = [
            {
                'url': 'https://ru.wiktionary.org/wiki/Служебная:Все_страницы',
                'type': 'wiktionary_pages'
            }
        ]
        
        for source in sources:
            try:
                print(f"📄 Обрабатываю: {source['url']}")
                
                response = self.session.get(source['url'], timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Ищем слова в различных элементах
                word_elements = soup.find_all(['a', 'span', 'div'], string=re.compile(r'^[А-Яа-яЁё]+$'))
                
                for element in word_elements:
                    word = element.get_text().strip()
                    if self.is_valid_word(word):
                        words.add(word)
                
                time.sleep(2)  # Вежливая задержка
                
            except Exception as e:
                print(f"❌ Ошибка при парсинге {source['url']}: {e}")
                continue
        
        return list(words)
    
    def parse_common_words(self) -> List[str]:
        """Добавляет часто используемые русские слова"""
        print("🔍 Добавляю часто используемые слова...")
        
        # Базовый набор часто используемых слов
        common_words = [
            # Природа
            'солнце', 'луна', 'звезда', 'небо', 'облако', 'дождь', 'снег', 'ветер', 'гром', 'молния',
            'река', 'море', 'океан', 'озеро', 'гора', 'холм', 'лес', 'дерево', 'лист', 'цветок',
            'трава', 'камень', 'песок', 'земля', 'огонь', 'вода', 'лёд', 'пар', 'туман',
            
            # Животные
            'собака', 'кошка', 'лошадь', 'корова', 'свинья', 'овца', 'коза', 'курица', 'утка', 'гусь',
            'волк', 'медведь', 'лиса', 'заяц', 'белка', 'мышь', 'крыса', 'птица', 'орёл', 'сокол',
            'сова', 'ворон', 'воробей', 'синица', 'рыба', 'акула', 'кит', 'дельфин', 'змея', 'лягушка',
            
            # Люди
            'человек', 'мужчина', 'женщина', 'ребёнок', 'мальчик', 'девочка', 'мать', 'отец', 'сын', 'дочь',
            'брат', 'сестра', 'дедушка', 'бабушка', 'дядя', 'тётя', 'друг', 'подруга', 'сосед', 'гость',
            
            # Профессии
            'учитель', 'врач', 'повар', 'водитель', 'строитель', 'художник', 'писатель', 'музыкант',
            'актёр', 'спортсмен', 'полицейский', 'пожарный', 'солдат', 'моряк', 'лётчик', 'продавец',
            
            # Дом и быт
            'дом', 'квартира', 'комната', 'кухня', 'спальня', 'ванная', 'окно', 'дверь', 'стена', 'пол',
            'потолок', 'крыша', 'лестница', 'балкон', 'подвал', 'чердак', 'стол', 'стул', 'кровать', 'шкаф',
            'полка', 'зеркало', 'лампа', 'свеча', 'телевизор', 'компьютер', 'телефон', 'часы', 'календарь',
            
            # Еда
            'хлеб', 'мясо', 'рыба', 'курица', 'говядина', 'свинина', 'колбаса', 'сыр', 'молоко', 'кефир',
            'йогурт', 'творог', 'сметана', 'масло', 'яйцо', 'картофель', 'морковь', 'лук', 'чеснок', 'помидор',
            'огурец', 'капуста', 'свёкла', 'яблоко', 'груша', 'банан', 'апельсин', 'лимон', 'виноград', 'клубника',
            'сахар', 'соль', 'перец', 'чай', 'кофе', 'сок', 'вода', 'мёд', 'варенье', 'торт', 'печенье',
            
            # Одежда
            'рубашка', 'блузка', 'платье', 'юбка', 'брюки', 'джинсы', 'шорты', 'пиджак', 'куртка', 'пальто',
            'плащ', 'шапка', 'шляпа', 'шарф', 'перчатки', 'носки', 'колготки', 'трусы', 'майка', 'футболка',
            'обувь', 'туфли', 'сапоги', 'кроссовки', 'ботинки', 'сандалии', 'тапочки', 'галстук', 'пояс',
            
            # Транспорт
            'машина', 'автомобиль', 'автобус', 'троллейбус', 'трамвай', 'метро', 'поезд', 'самолёт', 'вертолёт',
            'корабль', 'лодка', 'яхта', 'велосипед', 'мотоцикл', 'скутер', 'такси', 'грузовик', 'фургон',
            
            # Город
            'улица', 'дорога', 'тротуар', 'площадь', 'парк', 'сад', 'сквер', 'мост', 'туннель', 'перекрёсток',
            'светофор', 'знак', 'остановка', 'станция', 'вокзал', 'аэропорт', 'порт', 'магазин', 'рынок',
            'ресторан', 'кафе', 'бар', 'отель', 'больница', 'поликлиника', 'школа', 'университет', 'библиотека',
            'музей', 'театр', 'кино', 'стадион', 'спортзал', 'банк', 'почта', 'аптека', 'парикмахерская',
            
            # Время
            'время', 'час', 'минута', 'секунда', 'утро', 'день', 'вечер', 'ночь', 'неделя', 'месяц', 'год',
            'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье',
            'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
            'весна', 'лето', 'осень', 'зима', 'праздник', 'день рождения', 'новый год', 'рождество', 'пасха',
            
            # Цвета
            'красный', 'синий', 'зелёный', 'жёлтый', 'чёрный', 'белый', 'серый', 'коричневый', 'розовый', 'фиолетовый',
            'оранжевый', 'голубой', 'фиолетовый', 'бордовый', 'золотой', 'серебряный', 'медный', 'бронзовый',
            
            # Размеры и качества
            'большой', 'маленький', 'высокий', 'низкий', 'широкий', 'узкий', 'толстый', 'тонкий', 'длинный', 'короткий',
            'хороший', 'плохой', 'красивый', 'уродливый', 'новый', 'старый', 'молодой', 'зрелый', 'свежий', 'сухой',
            'мокрый', 'чистый', 'грязный', 'яркий', 'тусклый', 'живой', 'мёртвый', 'свободный', 'занятый',
            'полный', 'пустой', 'открытый', 'закрытый', 'счастливый', 'грустный', 'весёлый', 'серьёзный',
            'лёгкий', 'тяжёлый', 'дорогой', 'дешёвый', 'богатый', 'бедный', 'умный', 'глупый', 'честный', 'лживый',
            'добрый', 'злой', 'мирный', 'воинственный', 'спокойный', 'беспокойный', 'активный', 'пассивный',
            'творческий', 'смелый', 'трусливый', 'сильный', 'слабый', 'здоровый', 'больной', 'горячий', 'холодный',
            'тёплый', 'прохладный', 'светлый', 'тёмный', 'громкий', 'тихий', 'мягкий', 'твёрдый', 'острый', 'тупой',
            'быстрый', 'медленный', 'важный', 'неважный', 'интересный', 'скучный', 'полезный', 'вредный'
        ]
        
        return common_words
    
    def is_valid_word(self, word: str) -> bool:
        """Проверяет, является ли слово валидным русским словом"""
        if not word or len(word) < 2 or len(word) > 20:
            return False
        
        # Проверяем, что слово содержит только русские буквы
        if not re.match(r'^[А-Яа-яЁё]+$', word):
            return False
        
        # Исключаем технические слова
        exclude_words = [
            'категория', 'страница', 'вики', 'ссылка', 'редактировать', 'обсуждение',
            'история', 'создать', 'поиск', 'навигация', 'меню', 'заголовок'
        ]
        
        if word.lower() in exclude_words:
            return False
        
        return True
    
    def clean_word(self, word: str) -> str:
        """Очищает слово от лишних символов"""
        # Убираем лишние пробелы
        word = word.strip()
        
        # Приводим к нижнему регистру
        word = word.lower()
        
        return word
    
    def categorize_words(self, words: List[str]) -> Dict[str, List[str]]:
        """Категоризирует слова по типам"""
        categories = {
            'nature': [],      # Природа
            'animals': [],     # Животные
            'people': [],      # Люди
            'professions': [], # Профессии
            'home': [],        # Дом и быт
            'food': [],        # Еда
            'clothing': [],    # Одежда
            'transport': [],   # Транспорт
            'city': [],        # Город
            'time': [],        # Время
            'colors': [],      # Цвета
            'qualities': [],   # Качества
            'other': []        # Прочее
        }
        
        # Простые правила категоризации
        nature_words = ['солнце', 'луна', 'звезда', 'небо', 'дождь', 'снег', 'ветер', 'река', 'море', 'гора', 'лес', 'дерево', 'цветок']
        animal_words = ['собака', 'кошка', 'лошадь', 'корова', 'птица', 'рыба', 'волк', 'медведь', 'лиса', 'заяц']
        people_words = ['человек', 'мужчина', 'женщина', 'ребёнок', 'мать', 'отец', 'сын', 'дочь', 'брат', 'сестра']
        profession_words = ['учитель', 'врач', 'повар', 'водитель', 'строитель', 'художник', 'писатель', 'музыкант']
        home_words = ['дом', 'квартира', 'комната', 'кухня', 'окно', 'дверь', 'стол', 'стул', 'кровать', 'шкаф']
        food_words = ['хлеб', 'мясо', 'рыба', 'молоко', 'сыр', 'яйцо', 'картофель', 'яблоко', 'чай', 'кофе']
        clothing_words = ['рубашка', 'платье', 'брюки', 'пиджак', 'шапка', 'обувь', 'туфли', 'сапоги']
        transport_words = ['машина', 'автобус', 'поезд', 'самолёт', 'корабль', 'велосипед', 'мотоцикл']
        city_words = ['улица', 'дорога', 'площадь', 'парк', 'магазин', 'ресторан', 'больница', 'школа']
        time_words = ['время', 'час', 'день', 'неделя', 'месяц', 'год', 'утро', 'вечер', 'ночь']
        color_words = ['красный', 'синий', 'зелёный', 'жёлтый', 'чёрный', 'белый', 'серый']
        quality_words = ['большой', 'маленький', 'хороший', 'плохой', 'красивый', 'новый', 'старый']
        
        for word in words:
            if word in nature_words:
                categories['nature'].append(word)
            elif word in animal_words:
                categories['animals'].append(word)
            elif word in people_words:
                categories['people'].append(word)
            elif word in profession_words:
                categories['professions'].append(word)
            elif word in home_words:
                categories['home'].append(word)
            elif word in food_words:
                categories['food'].append(word)
            elif word in clothing_words:
                categories['clothing'].append(word)
            elif word in transport_words:
                categories['transport'].append(word)
            elif word in city_words:
                categories['city'].append(word)
            elif word in time_words:
                categories['time'].append(word)
            elif word in color_words:
                categories['colors'].append(word)
            elif word in quality_words:
                categories['qualities'].append(word)
            else:
                categories['other'].append(word)
        
        return categories
    
    def save_to_json(self, data: Dict, filename: str):
        """Сохраняет данные в JSON файл"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"💾 Данные сохранены в {filename}")
    
    def run(self):
        """Запускает полный процесс парсинга"""
        print("🚀 Запуск парсера русских слов...")
        
        # Парсим из разных источников
        wiktionary_words = self.parse_wiktionary()
        open_sources_words = self.parse_open_sources()
        common_words = self.parse_common_words()
        
        # Объединяем все слова
        all_words = set(wiktionary_words + open_sources_words + common_words)
        
        # Очищаем и валидируем
        cleaned_words = []
        for word in all_words:
            cleaned = self.clean_word(word)
            if self.is_valid_word(cleaned):
                cleaned_words.append(cleaned)
        
        # Удаляем дубликаты и сортируем
        unique_words = sorted(list(set(cleaned_words)))
        
        # Категоризируем слова
        categorized_words = self.categorize_words(unique_words)
        
        # Формируем итоговые данные
        result = {
            'words': unique_words,
            'categorizedWords': categorized_words,
            'totalWords': len(unique_words),
            'sources': [
                'Викисловарь - категории русских слов',
                'Открытые источники со словарями',
                'Базовый набор часто используемых слов'
            ],
            'lastUpdated': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Сохраняем результат
        self.save_to_json(result, '../src/data/parsed_words.json')
        
        print(f"✅ Парсинг завершен!")
        print(f"📊 Найдено слов: {len(unique_words)}")
        print(f"📊 Категорий: {len(categorized_words)}")

if __name__ == "__main__":
    parser = RussianWordsParser()
    parser.run()
