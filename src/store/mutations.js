/*
 * @Author: your name
 * @Date: 2020-06-08 22:38:11
 * @LastEditTime: 2020-06-08 23:28:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-music\src\router\mutation.js
 */ 
import * as types from './mutation-types'
const mutations={
    [types.SET_SINGER](state,singer){
        state.singer=singer
    }
}
export default mutations