# i18n-ai

AI-powered i18n toolkit for TypeScript/Node.js/React projects. CLI for auto-extracting and translating keys via OpenAI.

[![npm version](https://img.shields.io/npm/v/i18n-ai.svg)](https://www.npmjs.com/package/i18n-ai)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Features
- Localization for Node.js, React, and any TypeScript projects
- Automatic key extraction from code (tsx)
- Automatic translation via OpenAI (GPT-4o)
- Simple integration, template string support
- CLI for generating and updating dictionaries
- Multiple language support (en, ru out of the box)

## Installation

```bash
npm install i18n-ai
# or
pnpm add i18n-ai
```

## Quick Start

### Usage in Code
```ts
import { useTranslation } from 'i18n-ai'

const t = useTranslation('en')
console.log(t`Hello, ${userName}!`)
```

### Usage on Client (Dynamic Import)
```ts
import { UseTranslation } from 'i18n-ai/client'

const t = await UseTranslation('ru')
console.log(t`Привет, ${userName}!`)
```

### CLI for Auto Extraction and Translation

```bash
npx i18n-ai --dir=./src --from=en --to=ru
```
- `--dir` — directory to search for keys (default: ./src)
- `--from` — base language (default: en)
- `--to` — target languages, comma-separated (default: ru)

## Dictionary Structure

Dictionaries are objects like:
```js
export default {
  'Hello, ${x1}!': (x1) => `Привет, ${x1}!`,
  // ...
}
```

## API
- `useTranslation(locale?)` — returns a function for translating strings
- `UseTranslation(locale)` — async, for dynamic import on the client
- CLI: see above

## Adding Languages
1. Create a file `src/languages/<lang>.js` similar to en/ru
2. Add to the dictionary
3. Use in code: `useTranslation('fr')`

## Good to know

- **Variables in template strings**: when extracting keys, variables are automatically replaced with `${x1}`, `${x2}`, etc. Example:
  ```ts
  t`Hello, ${userName}!` // key in dictionary: 'Hello, ${x1}!'
  ```
  This allows using a single function for different values.

- **OpenAI API key for CLI**: to use auto-translation via CLI, you need an OpenAI key. Pass it as an environment variable:
  ```bash
  OPENAI_API_KEY=sk-... npx i18n-ai --dir=./src --from=en --to=ru
  ```

- **Example of a resulting dictionary**:
  ```js
  export default {
    'Hello, ${x1}!': (x1) => `Hello, ${x1}!`,
    'Your balance: ${x1} USD': (x1) => `Your balance: ${x1} USD`,
  }
  ```

- **Troubleshooting**:
  - If translation is missing, the original string is returned.
  - If CLI doesn't find a key, make sure you use template strings (t`...`).
  - For new languages, create a file like `src/languages/en.js`.

## Build & Test
```bash
pnpm install
pnpm build
pnpm test
```

## Contributors
- Fork the repository, create a branch, send a PR
- Describe changes in CHANGELOG.md
- Follow code style (TypeScript, no semicolons)

## License
MIT

---

# i18n-ai (на русском)

AI-инструмент для i18n в проектах на TypeScript/Node.js/React. CLI для автосбора и перевода ключей через OpenAI.

[![npm version](https://img.shields.io/npm/v/i18n-ai.svg)](https://www.npmjs.com/package/i18n-ai)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## Возможности
- Локализация для Node.js, React, любых TypeScript-проектов
- Автоматический сбор ключей из кода (tsx)
- Автоматический перевод через OpenAI (GPT-4o)
- Простая интеграция, поддержка шаблонных строк
- CLI для генерации и обновления словарей
- Поддержка нескольких языков (en, ru из коробки)

## Установка

```bash
npm install i18n-ai
# или
pnpm add i18n-ai
```

## Быстрый старт

### Использование в коде
```ts
import { useTranslation } from 'i18n-ai'

const t = useTranslation('en')
console.log(t`Hello, ${userName}!`)
```

### Использование на клиенте (динамический импорт)
```ts
import { UseTranslation } from 'i18n-ai/client'

const t = await UseTranslation('ru')
console.log(t`Привет, ${userName}!`)
```

### CLI для автосбора и автоперевода

```bash
npx i18n-ai --dir=./src --from=en --to=ru
```
- `--dir` — директория для поиска ключей (по умолчанию ./src)
- `--from` — базовый язык (по умолчанию en)
- `--to` — целевые языки через запятую (по умолчанию ru)

## Структура словарей

Словари представляют собой объекты вида:
```js
export default {
  'Hello, ${x1}!': (x1) => `Привет, ${x1}!`,
  // ...
}
```

## API
- `useTranslation(locale?)` — возвращает функцию для перевода строк
- `UseTranslation(locale)` — async, для динамического импорта на клиенте
- CLI: см. выше

## Добавление языков
1. Создайте файл `src/languages/<lang>.js` по аналогии с en/ru
2. Добавьте в словарь
3. Используйте в коде: `useTranslation('fr')`

## Важно знать

- **Переменные в шаблонных строках**: при автосборе ключей переменные автоматически заменяются на `${x1}`, `${x2}` и т.д. Пример:
  ```ts
  t`Hello, ${userName}!` // ключ в словаре: 'Hello, ${x1}!'
  ```
  Это позволяет использовать одну функцию для разных значений.

- **OpenAI API-ключ для CLI**: для работы автоперевода через CLI необходим ключ OpenAI. Передайте его через переменную окружения:
  ```bash
  OPENAI_API_KEY=sk-... npx i18n-ai --dir=./src --from=en --to=ru
  ```

- **Пример итогового словаря**:
  ```js
  export default {
    'Hello, ${x1}!': (x1) => `Привет, ${x1}!`,
    'Your balance: ${x1} USD': (x1) => `Ваш баланс: ${x1} USD`,
  }
  ```

- **Troubleshooting**:
  - Если перевод не найден, возвращается исходная строка.
  - Если CLI не видит ключ, проверьте, что используете шаблонные строки (t`...`).
  - Для новых языков создайте файл по образцу `src/languages/en.js`.

## Сборка и тесты
```bash
pnpm install
pnpm build
pnpm test
```

## Контрибьюторам
- Форкните репозиторий, создайте ветку, присылайте PR
- Описывайте изменения в CHANGELOG.md
- Соблюдайте стиль кода (TypeScript, без точек с запятой)

## Лицензия
MIT 