export const mockFile = (name: string, content: string, type: string = 'text/plain') => {
  const fileContent = new Blob([content], { type })
  return new File([fileContent], name, { type })
}
