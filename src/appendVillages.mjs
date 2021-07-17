import { readFile, writeFile } from 'fs/promises'
import _ from 'lodash'

export default async function (villiages) {
  const text = await readFile(new URL(`../out/villages.abort.json`, import.meta.url))
  const data = (_.isEmpty(text) ? [] : JSON.parse(text)).concat(villiages)
  return await writeFile(new URL(`../out/villages.abort.json`, import.meta.url), JSON.stringify(data), 'utf8')
}
