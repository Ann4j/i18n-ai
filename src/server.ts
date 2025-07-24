// Requires the 'openai' package to be installed
import { OpenAI } from 'openai'
// Uses Node.js built-in 'fs/promises' for file operations
import fs from 'node:fs/promises'
// Uses Node.js built-in 'fs/promises' for globbing files (Node.js 22+)
import { glob } from 'node:fs/promises'
import type { Language } from './client'

const API_KEY = process.env.OPENAI_API_KEY!
const openai = new OpenAI({ apiKey: API_KEY })

export async function findMatchesForAllTSXFiles(dir: string): Promise<void> {
  try {
    const allMatches: string[] = []
    for await (const filePath of glob(`${dir}/**/*.tsx`)) {
      const stats = await fs.stat(filePath)
      if (stats.isFile()) {
        const matches = await findLineToTranslation(filePath)
        allMatches.push(...matches)
      }
    }
    const uniqueMatches = [...new Set(allMatches)]
    await MatchesToObject(uniqueMatches, 'ru')
  } catch (error: any) {
    console.error('Ошибка при обработке файлов .tsx:', error)
  }
}

export async function findLineToTranslation(url: string): Promise<string[]> {
  const fileContent = await fs.readFile(url, 'utf8')
  const regex = /t`([а-яА-Яa-zA-Z0-9][^`\n\r]*)`/g
  return [...fileContent.matchAll(regex)].map((m) => m[1])
}

async function MatchesToObject(matches: string[], lang: Language): Promise<void> {
  let fileEn = {}
  try {
    const module = await import(new URL(`../src/languages/${lang}.js`, import.meta.url).href)
    fileEn = module.default
  } catch (err: any) {
    if (err.code !== 'ENOENT') throw err
  }
  const lines: string[] = []
  if (Object.keys(fileEn).length === 0) {
    lines.push('export default {')
  } else {
    lines.push('export default {')
    for (const [key, fn] of Object.entries(fileEn)) {
      lines.push(`'${key}': ${fn.toString()},`)
    }
  }
  for (const matche of matches) {
    const generatedString = generateString(matche, fileEn)
    if (generatedString) {
      lines.push(generatedString)
    }
  }
  lines.push('}')
  await fs.writeFile(new URL(`../src/languages/${lang}.js`, import.meta.url), lines.join("\n"), 'utf-8')
}

export function generateString(str: string, data: TranslateDict): string {
  const regex = /\$\{\s*([^}]+)\s*\}/g
  const vars = [...str.matchAll(regex)].map((m) => m[1])
  const variableMap: Record<string, string> = {}
  const placeholders: string[] = []
  vars.forEach((name, i) => {
    if (!variableMap[name]) {
      variableMap[name] = `x${i + 1}`
      placeholders.push(`x${i + 1}`)
    }
  })
  let templ = str
  for (const [key, ph] of Object.entries(variableMap)) {
    templ = templ.replaceAll(key, ph)
  }
  if (data[templ]) return ''
  return `'${templ}': (${placeholders.join(', ')}) => \`${templ}\`,\n`
}

async function translateOpenAI(str: string, lang: Language): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Переведи текст для технического веб-сайта на ${lang}.
Не переводи плейсхолдеры в форме \${...}.
Сохрани структуру шаблонных строк.
Верни только перевод без дополнительных объяснений.`,
      },
      { role: 'user', content: str },
    ],
  })
  const content = completion.choices[0].message.content
  if (!content) {
    throw new Error('Translation failed: empty response from OpenAI')
  }
  return content.trim()
}

export async function getTranslatedObjectOpenAI(fromLang: Language, toLang: Language): Promise<void> {
  const fileUrl = new URL(`../src/languages/${fromLang}.js`, import.meta.url)
  const file = await import(fileUrl.href)
  const fileData = file.default
  let translationData = {}
  try {
    await fs.access(new URL(`../src/languages/${toLang}.js`, import.meta.url))
    const moduleTo = await import(new URL(`../src/languages/${toLang}.js`, import.meta.url).href)
    translationData = moduleTo.default
  } catch (err: any) {
    if (err.code !== 'ENOENT') throw err
  }
  const regex = /(?<=`)([^`]+)(?=`)/
  for (const key in fileData) {
    if (key in translationData) continue
    const str = fileData[key].toString()
    const strMatch = str.match(regex)
    const strTranslate = await translateOpenAI(strMatch[1], toLang)
    const newStr = str.replace(strMatch[1], strTranslate)
    translationData[key] = newStr
  }
  let script = 'export default {\n'
  for (const [key, fn] of Object.entries(translationData)) {
    script += `  '${key}': ${fn.toString()},\n`
  }
  script += '}'
  await fs.writeFile(new URL(`../src/languages/${toLang}.js`, import.meta.url), script, 'utf-8')
} 