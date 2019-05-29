import axios from "axios"
//获取banner图
const getBanner = () => {
  return axios.get("/api/banner?type=2")
}
// 获取热门歌单
const personalized = () => {
  return axios.get("/api/personalized")
}
// // 获取歌单详情
const songListDetail = (id) => {
  return axios.get(`/api/playlist/detail?id=${id}`)
}

export  {
  getBanner,
  personalized,
  songListDetail
}