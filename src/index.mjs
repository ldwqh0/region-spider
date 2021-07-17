import readFromUrl from './readFromUrl.mjs'
import cheerio from 'cheerio'
import { resolve } from 'url'
import _ from 'lodash'
import readVillages from './readVillages.mjs'
import { writeFile } from 'fs/promises'

// 读取入口点
const inUrl = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2020/index.html'

const writeData = (filename, datas) => writeFile(new URL(`../${filename}`, import.meta.url), JSON.stringify(datas), 'utf8')

async function readChildren (datas) {
  const it = datas.filter(v => !_.isEmpty(v.href))
  let exists = []
  for (const cur of it) {
    const text = await readFromUrl(cur.href, 'gb2312')
    const $ = cheerio.load(text)
    $('.citytr,.countytr,.towntr').toArray().forEach(e => {
      const tds = $(e).children()
      const result = {
        code: $(tds.get(0)).text(),
        name: $(tds.get(1)).text(),
        parent: cur.code
      }
      const href = tds.children('a').attr('href')
      if (!_.isEmpty(href)) {
        result.href = resolve(cur.href, href)
      }
      exists = exists.concat(result)
    })
  }
  return exists
}

// 读取生
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
await writeData('towns.json', counties)

const villages = await readVillages(counties)
await writeData('villages.json', villages)




