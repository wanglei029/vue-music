import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

/*
 创建song类
 为什么创建类 而不是一个对象？
 设置成类有两个好处
  1：可以把代码集中在一个地方去维护，不需要在大量的地方写剩余的代码
  2：类的扩展性比对象强很多 而且它是一种面向对象的编程方式

*/
export default class Song {
  /* 初始化song的constructor */
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}
/* 
  为song类扩展一个工厂方法 直接让他实例化

*/
/* singer是一个数组 但实际上我们需要的是一个字符串 歌手有两个用斜线分开
  我们要做的就是我们的数据可以直接应用到DOM上 而不需要再做 额外的处理
  所以我们一次性将singer处理好
*/
export function createSong(musicData,songUrl) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    // url: `http://isure.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=9244517832&vkey=${songVkey}&uin=0&fromtag=66`
    url: `http://ws.stream.qqmusic.qq.com/${songUrl}`
  })
}

/**
 * @description: 处理歌手singer数组
 * @param {type} 
 * @return: 返回斜线分割的 字符串
 */
function filterSinger(singer) {
  let ret = []
  /* 如果参数singer为空直接返回 空字符串 */
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
