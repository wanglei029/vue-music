/* 在一个动作中多次去改变mutation 那么通常会封装一个action */
import * as types from './mutation-types'
/***
 * @name
 * @description
 * @param 传两个对象值 
 *          第一个参数对象{commit,state} 可以解构成commit方法和state,
 *          {list,index} 当我们点击selectplay我们要告诉他列表list是什么 索引index是什么
 * @returns
 * **/
export const selectPlay = function({commit,state},{list,index}){
    /* 提交 */
    commit(types.SET_SEQUENCE_LIST,list)
    commit(types.SET_PLAY_LIST,list)
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING_STATE,true)
}