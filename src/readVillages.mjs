import _ from 'lodash'
import fs from 'fs'
import readFromUrl from './readFromUrl.mjs'
import cheerio from 'cheerio'

function read (url) {
  return readFromUrl(url, 'gb2312').then(data => {
    const $ = cheerio.load(data)
    return $('.villagetr').toArray().map(e => {
      const tds = $(e).children()
      const result = {
        code: $(tds.get(0)).text(),
        type: $(tds.get(1)).text(),
        name: $(tds.get(2)).text()
      }
      const href = tds.children('a').attr('href')
      if (!_.isEmpty(href)) {
        result.href = url.resolve(inputUrl, href)
      }
      return result
    })
  })
}

export default function readVillages (towns) {
  return towns.filter(town => !_.isEmpty(town.href))
    .reduce((acc, cur) => acc.then((exists) => read(cur.href).then(data => exists.concat(data))), Promise.resolve([]))
}

