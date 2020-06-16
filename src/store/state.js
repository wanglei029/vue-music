import {playMode} from 'common/js/config'
import{loadSearch} from 'common/js/cache'
/* state中只保存最基础的数据 所有在基础数据可以计算而来的数据 都放在 getters中 */
const state ={
    singer:{},
    // 播放状态
    playing:false,
    // 播放器全屏
    fullScreen:false,
    // 播放列表
    playlist:[],
    // 顺序播放列表
    sequenceList:[],
    // 播放模式
    mode:playMode.sequence,
    // 当前播放下标
    currentIndex:-1,
    /* 定义歌单对象 */
    disc:{},
    topList:[],
    /* 搜索的历史记录 从本地storage读取数据 loadSearch() */
    searchHistory:loadSearch()
}
/* 导出state */
export default state