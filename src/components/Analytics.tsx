'use client'

import { useEffect } from 'react'

export default function Analytics() {
    useEffect(() => {
        // Проверяем производительность соединения
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

        // Если соединение медленное (2G) или пользователь предпочитает экономить трафик, не загружаем метрики
        if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData)) {
            return
        }

        // Загружаем метрики с задержкой, чтобы не блокировать основной поток
        const loadAnalytics = () => {
            // Google Analytics
            const gtagScript = document.createElement('script')
            gtagScript.async = true
            gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-ZBTZ97PP8S'
            document.head.appendChild(gtagScript)

            // Инициализация Google Analytics
            const gtagInitScript = document.createElement('script')
            gtagInitScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-ZBTZ97PP8S');
      `
            document.head.appendChild(gtagInitScript)

            // Yandex.Metrika
            const ymScript = document.createElement('script')
            ymScript.type = 'text/javascript'
            ymScript.innerHTML = `
        (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=104267684', 'ym');

        ym(104267684, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
      `
            document.head.appendChild(ymScript)

            // Добавляем noscript для Yandex.Metrika
            const noscript = document.createElement('noscript')
            noscript.innerHTML = `
        <div>
          <img
            src="https://mc.yandex.ru/watch/104267684"
            style="position: absolute; left: -9999px;"
            alt=""
          />
        </div>
      `
            document.head.appendChild(noscript)
        }

        // Загружаем метрики через 1 секунду после загрузки страницы
        const timer = setTimeout(loadAnalytics, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, [])

    return null
}
