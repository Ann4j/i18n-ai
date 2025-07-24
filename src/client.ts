export type Language = 'en' | 'ru'

const translationLoaders: Record<
  Language,
  () => Promise<{ default: Record<string, (...values: any[]) => string> }>
> = {
  en: () => import('./languages/en.js'),
  ru: () => import('./languages/ru.js')
}

export async function loadObjectFromUrl(
  lang: Language
): Promise<Record<string, (...values: any[]) => string>> {
  const loader = translationLoaders[lang] || translationLoaders.en
  const module = await loader()
  return module.default
}

export async function UseTranslation(
  locale: Language
): Promise<(strings: TemplateStringsArray, ...values: any[]) => string> {
  const dict = await loadObjectFromUrl(locale === 'ru' ? 'ru' : 'en')
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