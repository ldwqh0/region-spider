import { writeFile } from 'fs/promises'

export default function (url) {
  return writeFile(writeFile(new URL(`../out/err.log`, import.meta.url), url, { encoding: 'utf8', mode: 'a' }))
}
