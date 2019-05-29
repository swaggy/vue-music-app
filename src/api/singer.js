import axios from "axios"
// 获取热门歌手
const getSingers = () => {
  return axios.get("/api/top/artists?limit=100")
}
// 获取指定歌手信息
const getSingerDetail = (singerId) =>  {
  return axios.get(`/api/artists?id=${singerId}`)
}
// 获取歌曲
const getMusic = (musicId) => {
  return axios.get(`/api/music/url?id=${musicId}`)
}


export{
  getSingers,
  getSingerDetail,
  getMusic
}