/* 在一个动作中多次去改变mutation 那么通常会封装一个action */
import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from '../common/js/util'
import { saveSearch } from '../common/js/cache'

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

export const insertSong = function({commit,state},song){
    let playlist=state.playlist.slice()
    let sequenceList =state.sequenceList.slice()
    let currentIndex = state.currentIndex
    // 记录当前歌曲
    let currentSong = playlist[currentIndex]
    // 在插入之前要判断当前列表中 是否已经有了这首歌曲
    // 查找当前列表是否有待插入的歌曲的索引
    let fpIndex=findIndex(playlist,song)
    // 要插入的位置是当前索引的下一个位置 索引加1
    currentIndex++
    // 插入歌曲
    playlist.splice(currentIndex,0,song)
    // 如果大于-1 就有这首歌曲
    if(fpIndex>-1){
        // 如果当前插入的序号大于列表中的序号
        if(currentIndex>fpIndex){
            // 删除找到的索引
            playlist.splice(fpIndex,1)
            currentIndex--
        }else{
        // 如果当前插入的序号小于列表中的序号 说明找到的歌曲在当前歌曲后面
            playlist.splice(fpIndex+1,1)
        }
    }
    // 插入位置
    let currentSIndex = findIndex(sequenceList,currentSong)+1

    //
    let fsIndex=findIndex(sequenceList,song) 
    sequenceList.splice(currentSIndex,0,song)
    if(fpIndex>-1){
        if(currentIndex>fsIndex){
            sequenceList.splice(fsIndex,1)
        }else{
            sequenceList.splice(fsIndex+1,1)
        }
    }
    commit(types.SET_PLAY_LIST,playlist)
    commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}
/* 将搜索历史保存到localStorage中 
    saveSearchHistory方法将query写到storage里面 同时返回存储query的新的列表
    然后将新的列表再commit到mutation >SET_SEARCH_HISTORY>state就会被更新
*/
export const saveSearchHistory = function({commit},query){
    commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}