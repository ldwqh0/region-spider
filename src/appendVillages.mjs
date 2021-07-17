import { writeFile } from 'fs/promises'

export default async function (villiages) {
  return await writeFile(new URL(`../out/villages.abort.json`, import.meta.url), JSON.stringify(villiages), 'utf8')
}
