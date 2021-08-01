const mapOutput = (data) => {
  return data.map(songsdata => ({
    id: songsdata.id,
    title: songsdata.title,
    performer: songsdata.performer
  }))
}

module.exports = mapOutput
