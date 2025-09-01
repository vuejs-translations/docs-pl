import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme, type HeadConfig } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
// import { textAdPlugin } from './textAdMdPlugin'
import { groupIconMdPlugin,groupIconVitePlugin } from 'vitepress-plugin-group-icons'

const nav: ThemeConfig['nav'] = [
  {
    text: 'Dokumentacja',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: 'Poradnik', link: '/guide/introduction' },
      { text: 'Samouczek', link: '/tutorial/' },
      { text: 'Przykłady', link: '/examples/' },
      { text: 'Szybki start', link: '/guide/quick-start' },
      // { text: 'Style Guide', link: '/style-guide/' },
      { text: 'Słownik', link: '/glossary/' },
      { text: 'Referencja błędów', link: '/error-reference/' },
      {
        text: 'Dokumentacja Vue 2',
        link: 'https://v2.vuejs.org'
      },
      {
        text: 'Migracja z Vue 2',
        link: 'https://v3-migration.vuejs.org/'
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: 'Interaktywne demo',
    link: 'https://play.vuejs.org'
  },
  {
    text: 'Ekosystem',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: 'Materiały',
        items: [
          { text: 'Partnerzy', link: '/partners/' },
          { text: 'Deweloperzy', link: '/developers/' },
          { text: 'Motywy', link: '/ecosystem/themes' },
          { text: 'Komponenty UI', link: 'https://ui-libs.vercel.app/' },
          {
            text: 'Certyfikacja',
            link: 'https://certificates.dev/vuejs/?ref=vuejs-nav'
          },
          { text: 'Oferty pracy', link: 'https://vuejobs.com/?ref=vuejs' },
          {
            text: 'Skelp z koszulkami',
            link: 'https://vue.threadless.com/'
          }
        ]
      },
      {
        text: 'Oficjalne biblioteki',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/' },
          { text: 'Pinia', link: 'https://pinia.vuejs.org/' },
          {
            text: 'Przewodnik po narzędziach',
            link: '/guide/scaling-up/tooling.html'
          }
        ]
      },
      {
        text: 'Kursy wideo',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: 'Pomoc',
        items: [
          {
            text: 'Czat na Discord',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'Dyskusje na GitHub',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'Społeczność DEV', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: 'Aktualności',
        items: [
          { text: 'Blog', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://twitter.com/vuejs' },
          { text: 'Wydarzenia', link: 'https://events.vuejs.org/' },
          { text: 'Biuletyny', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: 'Informacje',
    activeMatch: `^/about/`,
    items: [
      { text: 'FAQ', link: '/about/faq' },
      { text: 'Zespół', link: '/about/team' },
      { text: 'Wydania', link: '/about/releases' },
      {
        text: 'Przewodnik dla społeczności',
        link: '/about/community-guide'
      },
      { text: 'Kodeks postępowania', link: '/about/coc' },
      { text: 'Polityka prywatności', link: '/about/privacy' },
      {
        text: 'Film dokumentalny',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: 'Sponsorzy',
    link: '/sponsor/'
  },
  {
    text: 'Eksperci',
    badge: { text: 'NEW' },
    activeMatch: `^/(partners|developers)/`,
    items: [
      { text: 'Partnerzy', link: '/partners/' },
      { text: 'Deweloperzy', link: '/developers/', badge: { text: 'NEW' } }
    ]
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: 'Pierwsze kroki',
      items: [
        { text: 'Wprowadzenie', link: '/guide/introduction' },
        {
          text: 'Szybki start',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: 'Podstawy',
      items: [
        {
          text: 'Tworzenie aplikacji',
          link: '/guide/essentials/application'
        },
        {
          text: 'Składnia template',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: 'Podstawy reaktywności',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: 'Właściwości computed',
          link: '/guide/essentials/computed'
        },
        {
          text: 'Wiązania klas i stylów',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: 'Renderowanie warunkowe',
          link: '/guide/essentials/conditional'
        },
        { text: 'Renderowanie listy', link: '/guide/essentials/list' },
        {
          text: 'Obsługa zdarzeń',
          link: '/guide/essentials/event-handling'
        },
        {
          text: 'Wiązanie elementów wejściowych formularza',
          link: '/guide/essentials/forms'
        },
        { text: 'Obserwatorzy', link: '/guide/essentials/watchers' },
        { text: 'Referencje w szablonach', link: '/guide/essentials/template-refs' },
        {
          text: 'Podstawy komponentów',
          link: '/guide/essentials/component-basics'
        },
        {
          text: 'Cykl życia',
          link: '/guide/essentials/lifecycle'
        }
      ]
    },
    {
      text: 'Szczegółowe informacje o komponentach',
      items: [
        {
          text: 'Rejestracja',
          link: '/guide/components/registration'
        },
        { text: 'Props', link: '/guide/components/props' },
        { text: 'Zdarzenia', link: '/guide/components/events' },
        {
          text: 'Użycie v-model w komponencie',
          link: '/guide/components/v-model'
        },
        {
          text: 'Atrybuty Fallthrough',
          link: '/guide/components/attrs'
        },
        { text: 'Sloty', link: '/guide/components/slots' },
        {
          text: 'Provide / inject',
          link: '/guide/components/provide-inject'
        },
        {
          text: 'Komponenty asynchroniczne',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: 'Reużywalność',
      items: [
        {
          text: 'Kompozyty',
          link: '/guide/reusability/composables'
        },
        {
          text: 'Własne dyrektywy',
          link: '/guide/reusability/custom-directives'
        },
        { text: 'Wtyczki', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: 'Wbudowane komponenty',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: 'Skalowalnie',
      items: [
        {
          text: 'Komponenty jednoplikowe (SFC)',
          link: '/guide/scaling-up/sfc'
        },
        { text: 'Narzędzia', link: '/guide/scaling-up/tooling' },
        { text: 'Routing', link: '/guide/scaling-up/routing' },
        {
          text: 'Zarządzanie stanem',
          link: '/guide/scaling-up/state-management'
        },
        { text: 'Testowanie', link: '/guide/scaling-up/testing' },
        {
          text: 'Renderowanie po stronie serwera (SSR)',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'Dobre praktyki',
      items: [
        {
          text: 'Wdrożenie produkcyjne',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: 'Wydajność',
          link: '/guide/best-practices/performance'
        },
        {
          text: 'Dostępność',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: 'Bezpieczeństwo',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: 'Omówienie', link: '/guide/typescript/overview' },
        {
          text: 'TS z Composition API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'TS z Options API',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: 'Dodatkowe tematy',
      items: [
        {
          text: 'Sposoby używania Vue',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'Composition API FAQ',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: 'Reaktywność w szczegółach',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: 'Mechanizm renderowania',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: 'Funckja render i JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue i komponenty web',
          link: '/guide/extras/web-components'
        },
        {
          text: 'Techniki animowania',
          link: '/guide/extras/animation'
        }
        // {
        //   text: 'Building a Library for Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React Devs',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: 'Globalny interfejs API',
      items: [
        { text: 'Aplikacja', link: '/api/application' },
        {
          text: 'Informacje ogólne',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'Composition API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: 'Reaktywność: pojęcia podstawowe',
          link: '/api/reactivity-core'
        },
        {
          text: 'Reaktywność: narzędzia',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'Reaktywność: pojęcia zaawansowane',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'Hooki cyklu życia',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: 'Wstrzykiwanie zależności',
          link: '/api/composition-api-dependency-injection'
        },
        {
          text: 'Helpery',
          link: '/api/composition-api-helpers'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        { text: 'Options: stan', link: '/api/options-state' },
        { text: 'Options: renderowanie', link: '/api/options-rendering' },
        {
          text: 'Options: cykle życia',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Options: Kompozycja',
          link: '/api/options-composition'
        },
        { text: 'Options: różne', link: '/api/options-misc' },
        {
          text: 'Instancja komponentu',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: 'Wbudowane',
      items: [
        { text: 'Dyrektywy', link: '/api/built-in-directives' },
        { text: 'Komponenty', link: '/api/built-in-components' },
        {
          text: 'Specjalne elementy',
          link: '/api/built-in-special-elements'
        },
        {
          text: 'Specjalne atrybuty',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: 'Komponenty jednoplikowe (SFC)',
      items: [
        { text: 'Specyfikacja składni', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'Właściwości CSS', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: 'Zaawansowany interfejs API',
      items: [
        { text: 'Niestandardowe elementy', link: '/api/custom-elements' },
        { text: 'Funkcja render', link: '/api/render-function' },
        {
          text: 'Renderowanie po stronie serwera (SSR)',
          link: '/api/ssr'
        },
        { text: 'Typy użytkowe TypeScript', link: '/api/utility-types' },
        {
          text: 'Własna funkcja renderująca',
          link: '/api/custom-renderer'
        },
        { text: 'Flagi czasu kompilacji', link: '/api/compile-time-flags' }
      ]
    }
  ],
  '/examples/': [
    {
      text: 'Podstawy',
      items: [
        {
          text: 'Witaj świecie',
          link: '/examples/#hello-world'
        },
        {
          text: 'Obsługa danych wejściowych',
          link: '/examples/#handling-input'
        },
        {
          text: 'Wiązania atrybutów',
          link: '/examples/#attribute-bindings'
        },
        {
          text: 'Instrukcje warunkowe i pętle',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: 'Wiązanie formularzy',
          link: '/examples/#form-bindings'
        },
        {
          text: 'Prosty komponent',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: 'Praktyczne',
      items: [
        {
          text: 'Edytor Markdown',
          link: '/examples/#markdown'
        },
        {
          text: 'Pobieranie danych',
          link: '/examples/#fetching-data'
        },
        {
          text: 'Tabela z sortowaniem i filtrowaniem',
          link: '/examples/#grid'
        },
        {
          text: 'Widok drzewa',
          link: '/examples/#tree'
        },
        {
          text: 'Graf SVG',
          link: '/examples/#svg'
        },
        {
          text: 'Modal z animacjami',
          link: '/examples/#modal'
        },
        {
          text: 'Lista z animacjami',
          link: '/examples/#list-transition'
        },
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 GUIs',
      items: [
        {
          text: 'Licznik',
          link: '/examples/#counter'
        },
        {
          text: 'Konwerter temperatury',
          link: '/examples/#temperature-converter'
        },
        {
          text: 'Rezerwacja lotów',
          link: '/examples/#flight-booker'
        },
        {
          text: 'Licznik czasu',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: 'Rysowanie okręgów',
          link: '/examples/#circle-drawer'
        },
        {
          text: 'Komórki',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: 'Przewodnik po stylach',
      items: [
        {
          text: 'Omówienie',
          link: '/style-guide/'
        },
        {
          text: 'A - Istotne',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Mocno zalecane',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Zalecane',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - Używać z ostrożnością',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

// Placeholder of the i18n config for @vuejs-translations.
const i18n: ThemeConfig['i18n'] = {
  search: 'Szukaj',
  menu: 'menu',
  toc: 'Na tej stronie',
  returnToTop: 'Powrót do góry',
  appearance: 'wygląd',
  previous: 'Poprzednia',
  next: 'Następna',
  pageNotFound: 'Strona nie znaleziona',
  deadLink: {
    before: 'Znaleziono niedziałający link：',
    after: '.'
  },
  deadLinkReport: {
    before: 'Prosimy',
    link: 'daj nam znać',
    after: '，abyśmy mogli to naprawić.'
  },
  footerLicense: {
    before: 'Wydane na podstawie ',
    after: '.'
  },
  ariaAnnouncer: {
    before: '',
    after: 'Jest załadowany'
  },
  ariaDarkMode: 'Przełączanie trybu ciemnego',
  ariaSkipToContent: 'Przejdź bezpośrednio do treści',
  ariaToC: 'Katalog bieżącej strony',
  ariaMainNav: 'główna nawigacja',
  ariaMobileNav: 'Nawigacja mobilna',
  ariaSidebarNav: 'Nawigacja w pasku bocznym'
}

function inlineScript(file: string): HeadConfig {
  return [
    'script',
    {},
    fs.readFileSync(
      path.resolve(__dirname, `./inlined-scripts/${file}`),
      'utf-8'
    )
  ]
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  sitemap: {
    hostname: 'https://vuejs.org'
  },

  lang: 'en-US',
  title: 'Vue.js',
  description: 'Vue.js - Progresywny Framework JavaScript',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://vuejs.org/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue.js' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue.js - Progresywny Framework JavaScript'
      }
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://vuejs.org/images/logo.png'
      }
    ],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://automation.vuejs.org'
      }
    ],
    inlineScript('restorePreference.js'),
    inlineScript('uwu.js'),
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'XNOLWPLB',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    [
      'script',
      {
        src: 'https://media.bitterbrains.com/main.js?from=vuejs&type=top',
        async: 'true'
      }
    ],
    inlineScript('perfops.js')
  ],

  themeConfig: {
    nav,
    sidebar,
    // Placeholder of the i18n config for @vuejs-translations.
    i18n,

    localeLinks: [
      {
        link: 'https://cn.vuejs.org',
        text: '简体中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-cn'
      },
      {
        link: 'https://ja.vuejs.org',
        text: '日本語',
        repo: 'https://github.com/vuejs-translations/docs-ja'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://fr.vuejs.org',
        text: 'Français',
        repo: 'https://github.com/vuejs-translations/docs-fr'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://pt.vuejs.org',
        text: 'Português',
        repo: 'https://github.com/vuejs-translations/docs-pt'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
      {
        link: 'https://fa.vuejs.org',
        text: 'فارسی',
        repo: 'https://github.com/vuejs-translations/docs-fa'
      },
      {
        link: 'https://ru.vuejs.org',
        text: 'Русский',
        repo: 'https://github.com/vuejs-translations/docs-ru'
      },
      {
        link: 'https://cs.vuejs.org',
        text: 'Čeština',
        repo: 'https://github.com/vuejs-translations/docs-cs'
      },
      {
        link: 'https://zh-hk.vuejs.org',
        text: '繁體中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-hk'
      },
      {
        link: 'https://pl.vuejs.org',
        text: 'Polski',
        repo: 'https://github.com/vuejs-translations/docs-pl'
      },
      {
        link: '/translations/',
        text: 'Pomóż nam w tłumaczeniach!',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: '21cf9df0734770a2448a9da64a700c22',
      searchParameters: {
        facetFilters: ['version:v3']
      },
      placeholder: 'Wyszukiwanie dokumentów',
      translations: {
        button: {
          buttonText: 'Szukaj'
        },
        modal: {
          searchBox: {
            resetButtonTitle: 'Wyczyść kryteria wyszukiwania',
            resetButtonAriaLabel: 'Wyczyść kryteria wyszukiwania',
            cancelButtonText: 'Anuluj',
            cancelButtonAriaLabel: 'Anuluj'
          },
          startScreen: {
            recentSearchesTitle: 'Historia wyszukiwania',
            noRecentSearchesText: 'Brak historii wyszukiwania',
            saveRecentSearchButtonTitle: 'Zapisz w historii wyszukiwania',
            removeRecentSearchButtonTitle: 'Usuń z historii wyszukiwania',
            favoriteSearchesTitle: 'Ulubione',
            removeFavoriteSearchButtonTitle: 'Usuń z ulubionych'
          },
          errorScreen: {
            titleText: 'Nie można uzyskać wyników',
            helpText: 'Konieczne może być sprawdzenie połączenia internetowego'
          },
          footer: {
            selectText: 'wybierz',
            navigateText: 'nawigacja',
            closeText: 'zamknij',
            searchByText: 'Wyszukiwanie według'
          },
          noResultsScreen: {
            noResultsText: 'brak wyników wyszukiwania dla',
            suggestedQueryText: 'Spróbuj wyszukać',
            reportMissingResultsText: 'Uważasz że brakuje wyników?',
            reportMissingResultsLinkText: 'Daj nam znać'
          }
        }
      }
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'vuejs/docs',
      text: 'Edytuj tę stronę na GitHub'
    },

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin)
        .use(groupIconMdPlugin)
      // .use(textAdPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    },
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          cypress: 'vscode-icons:file-type-cypress',
          'testing library': 'logos:testing-library'
        }
      }) as Plugin
    ]
  }
})
