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
    to: `BUILD_PATH="/${mode}"`,
  }

  console.log(`Defining mode: ${options.to}`)
  try {
    const results = await replace(options)
    const outResults = await replace(output)
    console.log('Replacement results:', results, outResults)
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
inject()
