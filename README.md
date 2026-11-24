# Keepsake Landing

**Демо:** https://sofiadovhan.github.io/landing-keepsake-vite/

## Вимоги до середовища

- Node.js LTS (не нижче 20)
- npm

## Команди

| Команда           | Що робить                                                        |
| ----------------- | ---------------------------------------------------------------- |
| `npm install`     | встановлює залежності                                            |
| `npm run dev`     | запускає dev-сервер Vite                                         |
| `npm run build`   | збирає сайт у `dist/`                                            |
| `npm run preview` | локально показує зібраний `dist/`                                |
| `npm run images`  | генерує AVIF, WebP і JPEG з `images-src/` у `src/assets/images/` |
| `npm run format`  | форматує проєкт Prettier                                         |
| `npm run lint`    | перевіряє SCSS (Stylelint) і форматування (Prettier)             |

## Структура проєкту

```
landing-keepsake-vite/
├── .github/workflows/ # deploy.yml — публікація на GitHub Pages
├── .husky/            # git hooks (pre-commit)
├── images-src/        # вихідні зображення для npm run images
├── scripts/           # images.mjs — генерація зображень (sharp)
├── src/
│   ├── assets/images/ # AVIF, WebP, JPEG у двох ширинах
│   ├── components/    # header, footer, newsletter, sections/*.pug
│   ├── data/          # дані секцій (масиви об'єктів)
│   ├── includes/      # meta, fonts, svg-спрайт
│   ├── layouts/       # main.pug — базовий макет
│   ├── mixins/        # Pug-міксини
│   ├── pages/         # index.pug
│   ├── scripts/       # main.js
│   └── styles/        # SCSS-архітектура
├── .browserslistrc
├── .prettierrc
├── .stylelintrc.json
├── postcss.config.js
└── vite.config.js
```

## Архітектура Pug

- `layouts/main.pug` — базовий макет із блоками `meta`, `title`, `styles`, `content`, `scripts`. Сторінка `pages/index.pug` успадковує його через `extends`, додає SEO та Open Graph теги через `append meta`, а preload шрифтів — через `prepend styles`.
- Шапка, футер і кожна секція — окремі файли в `components/`, підключені через `include`. SVG-спрайт підключається через `include` з `includes/`.
- Повторюваний вміст (навігація, категорії фільтра, роботи, послуги, статистика, клієнти, журнал, колонки футера, соцмережі) лежить у `data/` і виводиться через `each`.
- Міксини в `mixins/`: `+btn`, `+icon`, `+picture`, `+work-card`, `+section-head`, `+service-card`, `+journal-card`, `+socials`. `+btn` приймає вкладений вміст через `block` та довільні атрибути через `&attributes`, `+icon` вибирає іконку через `case/when`, `+picture` генерує `<picture>` з AVIF, WebP і JPEG.
- Умови: активний пункт меню, `loading="lazy"` для всіх зображень, крім першого екрана, необов'язкові поля даних.

## Архітектура SCSS

- Лише `@use` і `@forward`. Кожна папка має `_index.scss`, єдина точка входу — `main.scss`.
- `abstracts/` — токени (map-и кольорів, шрифтів, розмірів), міксин `mq` (mobile first), функція `rem()`, допоміжні міксини (`visually-hidden`, `focus-ring`, `flex-center`, `oswald`).
- `base/` — генерація CSS custom properties в `:root` через `@each`, reset, типографіка.
- `layout/` — контейнер, відступи секцій, header, footer.
- `components/` — один БЕМ-блок, один файл.
- `sections/` — блоки секцій сторінки (hero, works, cta, services, stats, clients, journal).
- БЕМ через `&__` та `&--`, вкладеність не глибше 3 рівнів, без `id` у селекторах і без `!important`.

## Використані інструменти

| Інструмент                      | Навіщо                                   |
| ------------------------------- | ---------------------------------------- |
| Vite                            | dev-сервер і збирання                    |
| Vituum + Pug plugin             | генерація HTML із Pug                    |
| Sass                            | компіляція SCSS                          |
| PostCSS + Autoprefixer          | вендорні префікси під Browserslist       |
| sharp                           | конвертація зображень у AVIF, WebP, JPEG |
| Prettier + @prettier/plugin-pug | єдине форматування коду, включно з Pug   |
| Stylelint + standard-scss       | перевірка SCSS і БЕМ-іменування          |
| husky + lint-staged             | перевірка змінених файлів перед комітом  |
| GitHub Actions                  | збирання та публікація на GitHub Pages   |

## Цільові браузери

Список у `.browserslistrc`:

- останні 2 версії Chrome
- останні 2 версії Firefox
- останні 2 версії Edge
- останні 2 версії Safari
- останні 2 версії iOS Safari

## Результат оптимізації

| Що                     | До                            | Після                            |
| ---------------------- | ----------------------------- | -------------------------------- |
| CSS (мінімізований)    | ~2.5KB (`style.css` з lab-07) | 9.77 kB (AVIF) / 10.55 kB (WebP) |
| Зображення (13 файлів) | ~2.5 KB (оригінали)           | ~4.56 kB (AVIF) / 5.05 kB (WebP) |

## Публікація

Сайт публікується на GitHub Pages через GitHub Actions (`.github/workflows/deploy.yml`) після кожного пушу в `main`. Папка `dist/` у репозиторій не комітиться, її збирає workflow. Шлях `base` для GitHub Pages передається змінною середовища `BASE_PATH` під час збирання.
