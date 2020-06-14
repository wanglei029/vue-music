/*
 * @Author: your name
 * @Date: 2020-06-08 22:40:21
 * @LastEditTime: 2020-06-08 23:18:24
 * @LastEditors: Please set LastEditors
 * @Description: 对 state 做一些映射 通过get将数据取到组建中
 * @FilePath: \vue-music\src\store\getters.js
 */
export const singer = state => state.singer
// 播放状态
export const playing = state => state.playing
// 播放器全屏
export const fullScreen = state => state.fullScreen
// 播放列表
export const playlist = state => state.playlist
// 顺序播放列表
export const sequenceList = state => state.sequenceList
// 播放模式
export const mode = state => state.mode
// 当前播放下标
export const currentIndex = state => state.currentIndex

/* getters 除了可以做一个简单的代理之外 还可以作为计算属性 */
export const currentSong = (state) => {
    return state.playlist[state.currentIndex] || {}
}
export const disc = state => state.disc
export const topList = state => state.topList
