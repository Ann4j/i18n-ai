#!/usr/bin/env node

import { findMatchesForAllTSXFiles, getTranslatedObjectOpenAI } from './server.js'

const parseArgs = () =>
  Object.fromEntries(
    process.argv
      .slice(2)
      .filter((arg) => arg.startsWith('--'))
      .map((arg) => {
        const [key, value = true] = arg.slice(2).split('=')
        return [key, value]
      })
  )

const showHelp = () => {
  console.log(`
Usage: npx i18n-ai [options]

Options:
  --dir=<path>     Directory to scan for translations (default: ./src)
  --from=<lang>    Base language for translations (default: en)
  --to=<langs>     Target languages, comma-separated (default: ru)
  --help           Show this help message
    `)
}

;(async () => {
  const args = parseArgs()

  if (args.help) {
    showHelp()
    process.exit(0)
  }

  const dir = args.dir || './src'
  const baseLang = args.from || 'en'
  const targetLangs = (args.to || 'ru').split(',').map((lang) => lang.trim())

  await findMatchesForAllTSXFiles(dir)
  await Promise.all(
    targetLangs.map((targetLang) => {
      return getTranslatedObjectOpenAI(baseLang, targetLang)
    })
  )
})().catch((error) => {
  console.error('Ошибка выполнения скрипта:', error)
  process.exit(1)
}) 