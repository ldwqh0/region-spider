import { readFile } from 'fs/promises'
import _ from 'lodash'
import readFromUrl from './readFromUrl.mjs'
import parseVillage from './parseVillage.mjs'
import parseChildren from './parseChildren.mjs'
import writeData from './writeData.mjs'
import appendVillages from './appendVillages.mjs'

const villages = []

async function readChildren (datas) {
  const it = datas.filter(v => !_.isEmpty(v.href))
  let exists = []
  for (const cur of it) {
    try {
      const text = await readFromUrl(cur.href, 'gb2312')
      villages.push(...parseVillage(text, cur))
      exists = exists.concat(parseChildren(text, cur))
    } catch (e) {
    }
  }
  return exists
}

const text = await readFile(new URL('../out/counties.json', import.meta.url))

try {
  // const counties = await readChildren(JSON.parse(text))
  // await writeData('counties.json', counties)

  const towns = await readChildren(JSON.parse(text))

  await writeData('towns.json', towns)

  const villages2 = await readChildren(towns)
  await writeData('villages.json', villages)
} catch (e) {
  await appendVillages(villages)
}
