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
const errors = []

async function readChildren (datas) {
  const it = datas.filter(v => !_.isEmpty(v.href))
  let exists = []
  for (const cur of it) {
    try {
      const text = await readFromUrl(cur.href, 'gb2312')
      villages.push(...parseVillage(text, cur))
      exists = exists.concat(parseChildren(text, cur))
    } catch (e) {
      errors.push(cur)
    }
  }
  return exists
}

try {
  // 读取省
  const entry = await readFromUrl(inUrl, 'gb2312')
  const $ = cheerio.load(entry)
  const level1 = $('.provincetr a').toArray().map((e) => {
    const href = $(e).attr('href')
    const [code] = href.split('.')
    return {
      name: $(e).text(),
      code: code.padEnd(12, '0'),
      href: resolve(inUrl, href)
    }
  })
  await writeData('level1.json', level1)

  const level2 = await readChildren(level1)
  await writeData('level2.json', level2)

  const level3 = await readChildren(level2)
  await writeData('level3.json', level3)

  const level4 = await readChildren(level3)
  await writeData('level4.json', level4)

  const level5 = await readChildren(level4)
  await writeData('level5.json', level5)
} catch (e) {
  await appendVillages(villages)
} finally {

}






