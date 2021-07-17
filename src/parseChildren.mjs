import cheerio from 'cheerio'
import _ from 'lodash'
import { resolve } from 'url'

export default function (text, parent) {
  const $ = cheerio.load(text)
  return $('.citytr,.countytr,.towntr').toArray().map(e => {
    const tds = $(e).children()
    const result = {
      code: $(tds.get(0)).text(),
      name: $(tds.get(1)).text(),
      parent: parent.code
    }
    const href = tds.children('a').attr('href')
    if (!_.isEmpty(href)) {
      result.href = resolve(parent.href, href)
    }
    return result
  })
}
