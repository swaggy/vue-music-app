import axios from "axios"
// 获取所有榜单
const getTopList = () => {
  return axios.get(`/api/toplist`)
}
const getTopListDetail = () => {
  return axios.get(`/api/toplist/detail`)
}
// 获取榜单详情
const getTop = (id) => {
  return axios.get(`/api/top/list?idx=${id}`)
} 

export {
  getTopList,
  getTop,
  getTopListDetail
}
