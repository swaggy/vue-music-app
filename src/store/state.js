import { playMode } from "common/js/config"
const state = {
  // 歌手列表
  singer: {},
  // 播放
  playing: false,
  // 全屏
  fullScreen: false,
  playlist: [],
  // 顺序列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放索引
  currentIndex: -1,
  // 歌单列表
  disc: {},
  // 排行榜
  topList:{},

}
export default state