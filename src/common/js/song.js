export default class Song {
  constructor({ id, singer, name, album, duration, image, url }) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    // this.aliaName = aliaName
    // this.duration = duration
    this.image = image
    // this.url = url
  }
}
function singerName(arr) {
  let name = []
  name = arr.map((item) => {
    // console.log(arr)
    return item.name
  })
  return name.join('/')
}
export function createSong(musicData) {
  return new Song({
    id: musicData.id,
    // url:musicData.url,
    singer: singerName(musicData.ar),
    name: musicData.name,
    album: musicData.al.name,
    image: musicData.al.picUrl
  })
}

export function createSearchSong(music) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    // aliaName: filiterAliaName(music.alias),
    album: music.album.name
  })
}
