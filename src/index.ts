import ru from './languages/ru.js'
import en from './languages/en.js'

const dictionaries: Record<string, Record<string, (...values: any[]) => string>> = { ru, en }

function detectLocaleFromEnv(): keyof typeof dictionaries {
  // Stores the region from environment variables; used for region recognition
  const region = process.env.NEXT_PUBLIC_REGION
  if (region === 'ru') return 'ru'
  if (region === 'en') return 'en'
  console.warn(`Unknown REGION "${region}", falling back to "en"`)
  return 'en'
}

export function useTranslation(
  locale?: keyof typeof dictionaries
): (strings: TemplateStringsArray, ...values: any[]) => string {
  const resolvedLocale = locale || detectLocaleFromEnv()
  const dict = dictionaries[resolvedLocale]

  if (!dict) {
    throw new Error(`Unsupported locale: ${resolvedLocale}`)
  }

  return (strings: TemplateStringsArray, ...values: any[]): string => {
    let key = ''
    strings.forEach((s, i) => {
      key += s
      if (i < values.length) key += `\${${i}}`
    })

    let transformed = key
    values.forEach((_, i) => {
      transformed = transformed.replace(`\${${i}}`, `\${x${i + 1}}`)
    })

    const fn = dict[transformed]
    if (typeof fn !== 'function') {
      return key
    }

    return fn(...values)
  }
} 