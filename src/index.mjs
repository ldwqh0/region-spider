import readFromUrl from './readFromUrl.mjs'
import cheerio from 'cheerio'
import { resolve } from 'url'
import _ from 'lodash'
import parseChildren from './parseChildren.mjs'
import parseVillage from './parseVillage.mjs'
import appendVillages from './appendVillages.mjs'
import writeData from './writeData.mjs'

// 读取入口点
const inUrl = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2020/index.html'

const villages = []

async function readChildren (datas) {
  const it = datas.filter(v => !_.isEmpty(v.href))
  let exists = []
  for (const cur of it) {
    const text = await readFromUrl(cur.href, 'gb2312')
    villages.push(...parseVillage(text, cur))
    exists = exists.concat(parseChildren(text, cur))
  }
  return exists
}

try {
  // 读取省
  const entry = await readFromUrl(inUrl, 'gb2312')
  const $ = cheerio.load(entry)
  const provinces = $('.provincetr a').toArray().map((e) => {
    const href = $(e).attr('href')
    const [code] = href.split('.')
    return {
      name: $(e).text(),
      code: code.padEnd(12, '0'),
      href: resolve(inUrl, href)
    }
  })
  await writeData('provinces.json', provinces)

  const cities = await readChildren(provinces)
  await writeData('cities.json', cities)

  const counties = await readChildren(cities)
  await writeData('counties.json', counties)

  const towns = await readChildren(counties)
  await writeData('towns.json', towns)

  const villages2 = await readChildren(towns)
  await writeData('villages.json', villages)
} catch (e) {
  await appendVillages(villages)
}





