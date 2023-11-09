import replace from 'replace-in-file'

const mode = process.argv[2]

const inject = async () => {
  const options = {
    files: './.env.example',
    from: /REACT_APP_WEBAPP_MODE=.*/g,
    to: `REACT_APP_WEBAPP_MODE="${mode}"`,
  }
  const output = {
    files: './.env.example',
    from: /BUILD_PATH=.*/g,
    to: `BUILD_PATH="./build/truetime-${mode}"`,
  }
  const publicURL = {
    files: './.env.example',
    from: /PUBLIC_URL=.*/g,
    to: `PUBLIC_URL="/truetime-${mode}"`,
  }
  const basename = {
    files: './.env.example',
    from: /REACT_APP_BASENAME=.*/g,
    to: `REACT_APP_BASENAME="truetime-${mode}"`,
  }

  console.log(`Defining mode: ${options.to}`)
  try {
    const results = await replace(options)
    const outResults = await replace(output)
    const basenameResults = await replace(basename)
    const publicURLResults = await replace(publicURL)
    console.log('Replacement results:', results, outResults, basenameResults, publicURLResults)
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
inject()
