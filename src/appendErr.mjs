import { writeFile } from 'fs/promiese'

export default function (url) {
  return writeFile(writeFile(new URL(`../out/err.log`, import.meta.url), url, { encoding: 'utf8', mode: 'a' }))
}
