/* eslint-disable no-undef */

import { copyFile } from "node:fs"
import { basename, join } from "node:path"

const args = process.argv.slice(2)

const srcPath = args[0]
if (!srcPath) {
  console.error("No valid srcPath provided")
  process.exit(1)
}

const absoluteSrcPath = join(process.cwd(), srcPath)
const absoluteDstPath = join(process.cwd(), "./public", basename(srcPath))

console.log(absoluteSrcPath, absoluteDstPath)

copyFile(absoluteSrcPath, absoluteDstPath, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
