import type { Options } from 'tsup'
import { readFileSync, writeFileSync } from 'fs'

// String directive for indicating a client-side component.
const USE_CLIENT_DIRECTIVE = '"use client"'

const writtenFiles = new Set()

export function addUseClientDirective(clientLibs: string[]): NonNullable<Options['plugins']>[number] {
  if (!Array.isArray(clientLibs)) {
    throw Error('ClientLibs given to addUseClientDirective plugin must be an array.')
  }
  return {
    name: 'add-use-client-directive',
    // At the end of the build step, directly add the useClientDirective to files with specified pattern

    buildEnd(ctx) {
      for (const file of ctx.writtenFiles) {
        if (writtenFiles.has(file.name)) {
          continue
        }
        for (const clientLibName of clientLibs) {
          if (file.name.startsWith(clientLibName)) {
            const fileContent = readFileSync(file.name, 'utf8')
            writeFileSync(file.name, `${USE_CLIENT_DIRECTIVE};${fileContent}`)
            writtenFiles.add(file.name)
          }
        }
      }
      console.log('The following dist modules have had the "use client" directive added:')
      console.log(writtenFiles)
    },
  }
}
