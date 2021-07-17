import iconv from 'iconv-lite'
import axios from 'axios'
import appendErr from './appendErr.mjs'

function lazy (time) {
  return new Promise(((resolve, reject) => {
    setTimeout(() => resolve(), time)
  }))
}

export default async function (url, encoding) {
  try {
    // 延迟1000毫秒
    // await lazy(1000)
    const { data } = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'Connection': 'keep-alive',
        'Referer': url,
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.67'
      }
    })
    console.log(`读取文件${url}完成`)
    return iconv.decode(Buffer.from(data), encoding)
  } catch (e) {
    await appendErr(url)
    console.error(`读取文件${url}发生错误`, e)
    return Promise.reject(e)
  }
}
