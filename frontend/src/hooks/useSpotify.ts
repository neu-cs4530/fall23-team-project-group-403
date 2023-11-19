import { Song } from './useQueue';

/*
 * Helper methods that interact with spotify API
 */
export function useQueue() {
  const searchForTrack = async (trackName: string) => {
    // Get the users token
    const token = ''; // TODO get the users token

    // Send request to spotify API /search
    return await fetch(
      // TODO im not sure if this is the correct URL
      'https://api.spotify.com/v1/search?q=track%3A' + trackName + '&type=track',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token, // TODO is this how they expect token?
        },
      },
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);

        const searchResults: Song[] = [];

        data.tracks.items.map((track: any) => {
          console.log(track.name);
          console.log(track.artists[0].name);
          console.log(track.album.images[0].url);

          const song = {
            id: track.id,
            uri: track.uri,
            name: track.name,
            artist: track.artists[0].name,
            voteCount: 0,
            albumCover: track.album.images[0].url,
          };

          searchResults.push(song);
        });
        return searchResults;
      });
  };

  return { searchForTrack }; // TODO: Return state variables, helper methods, etc.
}
