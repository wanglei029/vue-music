/* 封装所有和storage相关的逻辑 播放列表 收藏 喜欢 个人收藏夹 都需要通过cache来实现 */

import storage from 'good-storage'

/* 搜索的key _ _双下划线的编码习惯 一般都是 比较内部的一个值 和外面冲突的个能性非常小 */
const SEARCH_KEY = '__search__'
/* 搜索列表最多缓存 15 条数据 超过15条就将最老的那个值删除 */
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

/****
 * @description 封装的插入数组的方法
 * @param arr 存储arr的数组
 * @param val 要存的值
 * @param compare 比较函数 定义通过怎样的方式查找index
 * @param maxLen 最大存储的值
 *  
 *  */ 
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  /* index===0 表示第一条数据 什么都不做原样返回  数组已经有这个数据了 */
  if (index === 0) {
    return
  }
  /* 数组中已经有了这条数据 而且不在第一个位置 首先就将之前的数据删掉 */
  if (index > 0) {
    arr.splice(index, 1)
  }
  /* 删掉已经存在的数据后 再将数据插入到数组第一个位置 */
  arr.unshift(val)
  /* 如果定义了最大存储值 并且数组arr的length已经超过最大值 就将数组末尾的值弹出 */
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
/* 删除数组中符合条件的元素 */
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

/* 保存所有搜索结果 返回新的数组 */
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  /* 将存有检索词的数组 保存到 storage */
  storage.set(SEARCH_KEY, searches)
  /* 将存有检索词的数组返回 */
  return searches
}

/* 删除缓存列表中的数据 */
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

/* 从本地读取 storage中数据 */
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

