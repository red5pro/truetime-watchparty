import replace from 'replace-in-file'

const mode = process.argv[2]

const inject = async () => {
  const options = {
    files: './.env.example',
    from: /REACT_APP_WEBAPP_MODE=.*/g,
    to: `REACT_APP_WEBAPP_MODE="${mode}"`,
  }

  console.log(`Defining mode: ${options.to}`)
  try {
    const results = await replace(options)
    console.log('Replacement results:', results)
  } catch (error) {
    console.error('Error occurred:', error)
  }
}
inject()
