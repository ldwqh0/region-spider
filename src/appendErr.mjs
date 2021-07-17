import { writeFile } from 'fs/promises'

export default function (url) {
  return writeFile(new URL(`../out/err.log`, import.meta.url), `${url}\r\n`, { encoding: 'utf8', flag: 'a' })
}
