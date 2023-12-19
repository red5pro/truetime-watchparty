import fs from 'fs-extra'
import replace from 'replace-in-file'

const mode = process.argv[2]

const inject = async () => {
  const options = {
    files: './scripts/extras/META-INF/context.xml',
    from: /<Context path=.*>/g,
    to: `<Context path="truetime-${mode}">`,
  }

  console.log(`Defining mode: ${options.to}`)
  try {
    const results = await replace(options)
    console.log('Replacement results:', results)
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

const injectAndCopy = async () => {
  try {
    await inject()
    await fs.copy('./scripts/extras/META-INF', `./build/truetime-${mode}/META-INF`)
    await fs.copy('./scripts/extras/WEB-INF', `./build/truetime-${mode}/WEB-INF`, { recursive: true })
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

injectAndCopy()
