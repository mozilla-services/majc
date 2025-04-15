import type { Options } from 'tsup'

import { relative } from 'node:path'

// Set to track the imports of each code chunk.
const trackedImports = new Set<string>()

// String directive for indicating a client-side component.
const USE_CLIENT_DIRECTIVE = '"use client"'

// Regular expression to detect React hooks and event handlers, excluding any occurrences within comments.
const HOOK_OR_EVENT_REGEX
  = /(?<!\/\/.*)(?<!\/\*[\s\S]*?\*\/)(?<!['"])\b(?<hookOrEvent>(?<hookOrEventName>use[A-Z]\w*\s*\(.*\)|on[A-Z]\w*)\s*\(?.*\)?|import\s*{[^}]*\buse[A-Z]\w*\b[^}]*})(?!['"])/

/**
 * Checks if the provided content includes any of the given client libraries or
 * if it contains any React hooks.
 *
 * @param content - The string content to be checked for client libraries or
 *   hooks.
 * @param clientLibs - An array of client library names to check against the
 *   content.
 * @returns `true` if the content includes any of the client libraries or if it
 *   contains any hooks, otherwise `false`.
 */
function containsClientLibsOrHooks(content: string, clientLibs: RegExp | undefined): boolean {
  return clientLibs?.test(content) || HOOK_OR_EVENT_REGEX.test(content)
}

/**
 * Builds a regex to match any of the given client libraries.
 *
 * @param clientLibs - An array of strings representing client libraries.
 * @returns A regex pattern matching any of the provided client libraries.
 */
function buildClientLibsRegex(clientLibs: string[] | undefined): RegExp | undefined {
  if (!clientLibs || clientLibs.length === 0) {
    return undefined
  }

  // Escape special characters in each library name to safely use in regex.
  const escapedLibs = clientLibs.map(lib => lib.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`))

  // Return a regex pattern that matches any of the provided client libraries.
  return new RegExp(`(?:${escapedLibs.join('|')})`)
}

/**
 * Adds a "use client" directive to the given code based on the specified
 * client libraries.
 *
 * @param clientLibs - An array of strings representing the client libraries
 *   that should trigger the addition of "use client" directives.
 * @returns A plugin object that contains a `renderChunk` method to process and
 *   potentially modify the code chunks.
 */
export function addUseClientDirective(clientLibs?: string[]): NonNullable<Options['plugins']>[number] {
  const clientLibsRegex = buildClientLibsRegex(clientLibs)
  console.log('\n\n\n 1: ', clientLibsRegex, '\n\n\n')

  return {
    name: 'add-use-client-directive',
    renderChunk: (code, { imports, map, path }) => {
      const relativePath = relative(process.cwd(), path)

      console.log('-------')
      console.log('Look Here:\n\n')
      console.log('path: ', path)
      console.log('imports: ', imports)
      console.log('map: ', map)
      console.log('relPath: ', relativePath)
      console.log('trackedImports: ', trackedImports)
      console.log('\n\nEND')
      console.log('-------')

      // Check if the code contains any client libraries or hooks.
      if (containsClientLibsOrHooks(code, clientLibsRegex)) {
        // Add the "use client" directive to the code.
        console.log('\n\n\n Nice! \n\n\n')
        return {
          code: `${USE_CLIENT_DIRECTIVE};${code}`,
          map,
        }
      }

      // Return the original code if no client libraries or hooks were found.
      return { code, map }
    },
    buildEnd(ctx) {
      // Maybe need to append in the buildEnd step?
      for (const file of ctx.writtenFiles) {
        console.log(file.name)
      }
    },
  }
}
