import { writeFile } from 'fs/promises'
export default function (filename, datas) {
  return writeFile(new URL(`../out/${filename}`, import.meta.url), JSON.stringify(datas), 'utf8')
}
