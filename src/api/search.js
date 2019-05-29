import axios from "axios"
// 获取热搜词
const getHotSearch = () => {
  return axios.get("/api/search/hot")
}
// 获取搜索歌曲
const getSearchSongs = (name, page) => {
  return axios.get(`/api/search?keywords=${name}&offset=${page}`)
}

const getSearchSuggest = (name) => {
  return axios.get(`/api/search/suggest?keywords=${name}`)
}
const getSongDetail = (id) => {
  return axios.get(`/api/song/detail?ids=${id}`)
}
export {
  getHotSearch,
  getSearchSongs,
  getSearchSuggest,
  getSongDetail
}