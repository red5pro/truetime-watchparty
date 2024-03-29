import { exec } from 'child_process'
import chalk from 'chalk'
import replace from 'replace-in-file'
import path from 'path'
import fs from 'fs-extra'

const bump = process.env.BUMP

if (!bump) {
  throw new Error(
    `\r\n\r\n${chalk.red('BUMP needs to be provided in order to make a new build for deployment.')}\r\n\r\n\
Available bumps:\r\n\r\n\
${chalk.yellow('none'.padStart(6))}\r\n\
${chalk.yellow('patch'.padStart(7))}\r\n\
${chalk.yellow('minor'.padStart(7))}\r\n\
${chalk.yellow('major'.padStart(7))}\r\n\r\n\
Example:\r\n\r\n\
  ${chalk.green('BUMP=patch npm run build')}\r\n`
  )
}

const inject = async () => {
  const file = path.join(process.cwd(), 'package.json')
  const pkg = JSON.parse(fs.readFileSync(file))

  const options = {
    files: './.env*',
    from: /REACT_APP_VERSION=.*/g,
    to: `REACT_APP_VERSION=${pkg.version}`,
  }

  console.log(`Injecting Version: ${options.to}`)
  try {
    const results = await replace(options)
    console.log('Replacement results:', results)
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

if (bump != 'none') {
  exec(`npm version ${bump} --no-git-tag-version`, (error, stdout, stderr) => {
    if (error || stderr) {
      throw new Error(error ?? stderr)
    }
    inject()
  })
} else {
  inject()
}
