import axios from "axios"
// 获取歌曲url
const getSong = (id) => {
  return axios.get(`/api/song/url?id=${id}`)
}
// 获取歌词
const getLyric = (id) => {
  return axios.get(`/api//lyric?id=${id}`)
}

export {
  getSong,
  getLyric
}