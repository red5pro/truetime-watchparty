const pkg = require('../package.json')
const replace = require('replace-in-file')

const options = {
  files: './.env*',
  from: /REACT_APP_VERSION=.*/g,
  to: `REACT_APP_VERSION=${pkg.version}`,
}

const inject = async () => {
  console.log(`Injecting Version: ${options.to}`)
  try {
    const results = await replace(options)
    console.log('Replacement results:', results)
  } catch (error) {
    console.error('Error occurred:', error)
  }
}

inject()
