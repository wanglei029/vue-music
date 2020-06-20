/* 在一个动作中多次去改变mutation 那么通常会封装一个action */
import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from '../common/js/util'
import { saveSearch, deleteSearch, clearSearch ,savePlay} from '../common/js/cache'
import { playlist } from './getters'

function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}
/***
 * @name
 * @description
 * @param 传两个对象值 
 *          第一个参数对象{commit,state} 可以解构成commit方法和state,
 *          {list,index} 当我们点击selectplay我们要告诉他列表list是什么 索引index是什么
 * @returns
 * **/
export const selectPlay = function ({ commit, state }, { list, index }) {
    /* 提交 */
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAY_LIST, randomList)
        index = findIndex(randomList, list[index])
    } else {
        commit(types.SET_PLAY_LIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({ commit }, { list }) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({ commit, state }, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    // 记录当前歌曲
    let currentSong = playlist[currentIndex]
    // 在插入之前要判断当前列表中 是否已经有了这首歌曲
    // 查找当前列表是否有待插入的歌曲的索引
    let fpIndex = findIndex(playlist, song)
    // 要插入的位置是当前索引的下一个位置 索引加1
    currentIndex++
    // 插入歌曲
    playlist.splice(currentIndex, 0, song)
    // 如果大于-1 就有这首歌曲
    if (fpIndex > -1) {
        // 如果当前插入的序号大于列表中的序号
        if (currentIndex > fpIndex) {
            // 删除找到的索引
            playlist.splice(fpIndex, 1)
            currentIndex--
        } else {
            // 如果当前插入的序号小于列表中的序号 说明找到的歌曲在当前歌曲后面
            playlist.splice(fpIndex + 1, 1)
        }
    }
    // 插入位置
    let currentSIndex = findIndex(sequenceList, currentSong) + 1

    //
    let fsIndex = findIndex(sequenceList, song)
    sequenceList.splice(currentSIndex, 0, song)
    if (fpIndex > -1) {
        if (currentIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1)
        }
    }
    commit(types.SET_PLAY_LIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}
/* 将搜索历史保存到localStorage中 
    saveSearchHistory方法将query写到storage里面 同时返回存储query的新的列表
    然后将新的列表再commit到mutation >SET_SEARCH_HISTORY>state就会被更新
*/
export const saveSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

/* 清空搜索历史 本地storage和vuex都清空  */
export const clearSearchHistory = function ({ commit }) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({ commit, state }, song) {
    /* 通过 state 拿到 sequenceList currentIndex */
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    /* 找到这首歌在sequencelist下的索引 找到索引直接删掉 */
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)
    /* 删完后做判断
     currentIndex>pIndex 当前歌曲的索引大于删掉歌曲的索引说明当前歌曲的位置排在删除的歌曲后面
     所以当前播放的歌曲的索引要减1

     currentIndex===playlist.length 排在最后 如果不减1 会找不到currentIndex
     例如：数组长度length为20 最后一个元素的下标为19 
     如果删除前面的一个元素 数组长度变为19 最后一个元素的下标变为18 再去找下标为19的元素是找不到的
     */
    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--
    }
    commit(types.SET_PLAY_LIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    const playingState = playlist.length > 0
    commit(types.SET_PLAYING_STATE, playingState)

    /* 如果整个列表全部删完了 长度为空*/
    /* 通过playingState优化下面的代码逻辑 */
    // if (!playlist.length) {
    //     commit(types.SET_PLAYING_STATE, false)
    // } else {
    //     commit(types.SET_PLAYING_STATE, true)
    // }
}

/* 清除所有歌曲 */
export const deleteSongList=function({commit}){
    commit(types.SET_PLAY_LIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}

/* 将播放的歌曲保存到本地缓存 */
export const savePlayHistory=function({commit},song){
    commit(types.SET_PLAY_HISTORY,savePlay(song))
}