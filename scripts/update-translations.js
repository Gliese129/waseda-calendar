const fs = require('fs')
const { parse } = require('csv-parse/sync')
const path = require('path')

// Define the output directory for JSON files
const outputDir = path.join(__dirname, '../translations')

const csvToJSONByLanguage = (csvPath) => {
  // Read CSV file
  const csvData = fs.readFileSync(csvPath)
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  })

  // Determine languages from headers (excluding 'key' column)
  const languages = Object.keys(records[0]).filter((key) => key !== 'key')

  // Process each language
  languages.forEach((lang) => {
    const langData = {}
    records.forEach((record) => {
      // Navigate or create the path in the object based on the key
      const keyParts = record['key'].split('.')
      let currentObj = langData
      keyParts.forEach((part, index) => {
        if (index === keyParts.length - 1) {
          // Set the value at the last key part
          currentObj[part] = record[lang]
        } else {
          // Create nested object if it doesn't exist
          currentObj[part] = currentObj[part] || {}
          currentObj = currentObj[part]
        }
      })
    })

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }

    // Write the language-specific JSON to a file
    fs.writeFileSync(
      path.join(outputDir, `${lang}.json`),
      JSON.stringify(langData, null, 4)
    )
  })

  // Generate dynamic TypeScript exports
  generateTypeScriptExports()
}

const generateTypeScriptExports = () => {
  const files = fs.readdirSync(outputDir)
  const exportLines = files
    .map((file) => {
      if (path.extname(file) === '.json') {
        const baseName = path.basename(file, '.json')
        return `export { default as ${baseName} } from "./${file}";`
      }
      return null
    })
    .filter(Boolean)
    .join('\n')

  fs.writeFileSync(path.join(outputDir, 'index.ts'), exportLines)
}

let csvPath = path.join(__dirname, '../assets/i18n/translations.csv')
csvToJSONByLanguage(csvPath)
