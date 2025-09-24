import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Hash,
  Dice1,
  BookOpen,
  User,
  MessageSquare,
  Quote,
  Coins,
  Dice6,
  Users
} from 'lucide-react'

// Импорт всех компонентов генераторов
import NumberGenerator from '@/components/NumberGenerator'
import SingleNumberGenerator from '@/components/SingleNumberGenerator'
import WordGenerator from '@/components/WordGenerator'
import NameGenerator from '@/components/NameGenerator'
import NicknameGenerator from '@/components/NicknameGenerator'
import QuoteGenerator from '@/components/QuoteGenerator'
import CoinFlip from '@/components/CoinFlip'
import DiceRoll from '@/components/DiceRoll'
import LotteryGenerator from '@/components/LotteryGenerator'

export const metadata: Metadata = {
  title: 'Генератор случайных чисел и случайностей | Бесплатные онлайн инструменты',
  description: 'Генератор случайных чисел, слов, имён, цитат и многое другое. Честные результаты одним кликом. Быстро, бесплатно, без регистрации.',
  keywords: 'генератор случайных чисел, случайное число, рандомайзер, генератор слов, генератор имён, орёл или решка, бросок кости, жребий',
  openGraph: {
    title: 'Генератор случайных чисел и случайностей',
    description: 'Быстрые и честные генераторы случайностей. Числа, слова, имена, цитаты и многое другое.',
    type: 'website',
  },
}

const generators = [
  {
    id: 'numbers',
    title: 'Генератор чисел',
    shortTitle: 'Числа',
    description: 'Выберите диапазон и получите случайные числа',
    icon: Hash,
    color: 'from-[#FCE7D7] to-[#F9F5FF]',
    component: NumberGenerator
  },
  {
    id: 'single-number',
    title: 'Случайное число',
    shortTitle: 'Число',
    description: 'Одно число от 1 до 100 одним кликом',
    icon: Dice1,
    color: 'from-[#F9F5FF] to-[#FFF8E1]',
    component: SingleNumberGenerator
  },
  {
    id: 'words',
    title: 'Генератор слов',
    shortTitle: 'Слова',
    description: 'Случайные русские слова из словаря',
    icon: BookOpen,
    color: 'from-[#FFF8E1] to-[#FCE7D7]',
    component: WordGenerator
  },
  {
    id: 'names',
    title: 'Генератор имён',
    shortTitle: 'Имена',
    description: 'Случайные русские имена мужские и женские',
    icon: User,
    color: 'from-[#FCE7D7] to-[#F9F5FF]',
    component: NameGenerator
  },
  {
    id: 'nicknames',
    title: 'Генератор никнеймов',
    shortTitle: 'Никнеймы',
    description: 'Уникальные никнеймы и имена пользователей',
    icon: MessageSquare,
    color: 'from-[#F9F5FF] to-[#FFF8E1]',
    component: NicknameGenerator
  },
  {
    id: 'quotes',
    title: 'Случайная цитата',
    shortTitle: 'Цитаты',
    description: 'Вдохновляющие цитаты великих людей',
    icon: Quote,
    color: 'from-[#FFF8E1] to-[#FCE7D7]',
    component: QuoteGenerator
  },
  {
    id: 'coin-flip',
    title: 'Орёл или решка',
    shortTitle: 'Монета',
    description: 'Бросьте монету онлайн',
    icon: Coins,
    color: 'from-[#FCE7D7] to-[#F9F5FF]',
    component: CoinFlip
  },
  {
    id: 'dice-roll',
    title: 'Бросок кости',
    shortTitle: 'Кости',
    description: 'Бросьте игральную кость онлайн',
    icon: Dice6,
    color: 'from-[#F9F5FF] to-[#FFF8E1]',
    component: DiceRoll
  },
  {
    id: 'lottery',
    title: 'Жребий онлайн',
    shortTitle: 'Жребий',
    description: 'Случайный выбор из списка участников',
    icon: Users,
    color: 'from-[#FFF8E1] to-[#FCE7D7]',
    component: LotteryGenerator
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Заголовок */}
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 md:mb-8 shadow-lg">
            <Hash className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            Генератор случайностей
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
            Быстрые и честные генераторы случайных чисел, слов, имён и многое другое.
            Все инструменты работают мгновенно и используют криптографически стойкие алгоритмы.
          </p>
        </div>

        {/* Табы с генераторами */}
        <Tabs defaultValue="numbers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 mb-8">
            {generators.map((generator) => {
              const IconComponent = generator.icon
              return (
                <TabsTrigger
                  key={generator.id}
                  value={generator.id}
                  className="flex flex-col items-center gap-2 p-3 text-xs font-medium group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-data-[state=active]:bg-gradient-to-br group-data-[state=active]:from-blue-500 group-data-[state=active]:to-purple-600 transition-all duration-200">
                    <IconComponent className="w-4 h-4 text-gray-600 group-data-[state=active]:text-white" />
                  </div>
                  <span className="hidden sm:block md:hidden text-center leading-tight text-gray-600 group-data-[state=active]:text-gray-900 font-medium text-xs">
                    {generator.shortTitle}
                  </span>
                  <span className="hidden md:block text-center leading-tight text-gray-600 group-data-[state=active]:text-gray-900 font-medium">
                    {generator.title}
                  </span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Контент табов */}
          {generators.map((generator) => {
            const GeneratorComponent = generator.component
            return (
              <TabsContent key={generator.id} value={generator.id} className="mt-0">
                <div className="text-center mb-8 md:mb-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 mb-4 md:mb-6">
                    <generator.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
                    {generator.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                    {generator.description}
                  </p>
                </div>
                <GeneratorComponent />
              </TabsContent>
            )
          })}
        </Tabs>

        {/* Преимущества */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100 mb-8 md:mb-12">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Почему выбирают нас?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Современные инструменты для генерации случайностей с акцентом на качество и удобство
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-105 transition-transform duration-200">
                <Hash className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                Честная генерация
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed px-2">
                Используем криптографически стойкие алгоритмы браузера для получения честных результатов
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-105 transition-transform duration-200">
                <Dice1 className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                Мгновенные результаты
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed px-2">
                Получайте результаты за доли секунды. Никаких ожиданий и загрузок
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                Без регистрации
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed px-2">
                Все инструменты доступны бесплатно без регистрации и ограничений
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Часто задаваемые вопросы
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Ответы на самые популярные вопросы о наших генераторах
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-4 md:space-y-6">
              <div className="p-4 md:p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                  Как работает генерация случайностей?
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Мы используем встроенный в браузер криптографически стойкий генератор crypto.getRandomValues(),
                  который обеспечивает честную и непредсказуемую генерацию.
                </p>
              </div>
              <div className="p-4 md:p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                  Можно ли доверять результатам?
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Да, все наши генераторы используют криптографические алгоритмы браузера,
                  что гарантирует честность и непредсказуемость результатов.
                </p>
              </div>
            </div>
            <div className="space-y-4 md:space-y-6">
              <div className="p-4 md:p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                  Есть ли ограничения на использование?
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Нет, все инструменты доступны бесплатно без ограничений.
                  Используйте их столько раз, сколько нужно.
                </p>
              </div>
              <div className="p-4 md:p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                  Работает ли сайт на мобильных устройствах?
                </h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Да, все генераторы адаптированы для мобильных устройств и работают одинаково хорошо
                  на всех платформах.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-100 mt-8 md:mt-16">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="text-center">
              <div className="mb-3 md:mb-4">
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-3 md:mb-4">
                  <Hash className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  rundomizer.ru
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 px-4">
                  Генератор случайностей с любовью создан командой
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500">
                <span>Создано с</span>
                <span className="text-red-500">♥</span>
                <span>командой</span>
                <a
                  href="https://hotelqr.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  hotelqr.com
                </a>
              </div>
              <div className="mt-3 md:mt-4 text-xs text-gray-400">
                © {new Date().getFullYear()} rundomizer.ru. Все права защищены.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}