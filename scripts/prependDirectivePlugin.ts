import { readFileSync, writeFileSync } from 'fs'
import { Options } from 'tsup'

export function prependDirective(directive: string, filePatterns: string[]): NonNullable<Options['plugins']>[number] {
  if (!Array.isArray(filePatterns)) {
    throw Error('FilePatterns given to prependDirective plugin must be an array.')
  }
  return {
    name: 'prepend-directive',
    // At the end of the build step, directly prepend the specified directive to files with specified pattern

    buildEnd(ctx) {
      for (const file of ctx.writtenFiles) {
        for (const filePattern of filePatterns) {
          if (file.name.startsWith(filePattern)) {
            const fileContent = readFileSync(file.name, 'utf8')
            writeFileSync(file.name, `${directive};${fileContent}`)
            console.log(`Prepended ${directive} directive to ${file.name}`)
          }
        }
      }
    },
  }
}
