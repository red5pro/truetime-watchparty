export const removeFromArray = (arr: any[], args: any[]) => arr.filter((val) => !args.includes(val))

export const getContextAndNameFromGuid = (guid: string) => {
  const paths: string[] = guid.split('/')
  const name = paths.pop()
  return { name: name, context: paths.join('/') }
}
