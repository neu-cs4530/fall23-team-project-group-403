class Song {
  title: string;

  artist: string;

  //album: string;
  //albumArt: string;
  spotifyID: string;

  //duration: number;
  positiveVotes: number;

  negativeVotes: number;

  constructor(title: string, artist: string, spotifyID: string) {
    this.title = title;
    this.artist = artist;
    this.spotifyID = spotifyID;
    this.positiveVotes = 0;
    this.negativeVotes = 0;
  }
}

export default Song;
