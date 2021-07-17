import cheerio from 'cheerio'

export default function (text, parent) {
  const $ = cheerio.load(text)
  return $('.villagetr').toArray().map(e => {
    const tds = $(e).children()
    return {
      code: $(tds.get(0)).text(),
      type: $(tds.get(1)).text(),
      name: $(tds.get(2)).text(),
      parent: parent.code
    }
  })
}
