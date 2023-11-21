import { useEffect, useState } from 'react';
import { Song, useQueue } from './useQueue';

type OAuthTokenCallback = (token: string) => void;

// TODO - these global types are to temp disable eslint errors, im not sure if
// we can define better types for them
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

/*
 * Helper methods that interact with spotify API
 */
export function useSpotify() {
  const { queue } = useQueue();

  // Use state for the Spotify player
  const [player, setPlayer] = useState(undefined);
  const [spotifyToken, setSpotifyToken] = useState(sessionStorage.getItem('SPOTIFY_AUTH_TOKEN'));

  // Function to prompt playback of a specific song on a specific device
  const playSpotifySongOnDevice = async (songURIs: string[], deviceID: string) => {
    // Can later add offset or position
    const url = 'https://api.spotify.com/v1/me/player/play' + '?device_id=' + deviceID;
    const body = {
      uris: songURIs,
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + spotifyToken || '',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Error: ' + response.status);
      }

      console.log('Playback device: ' + deviceID);
      console.log('Started playing successfully: ' + songURIs);
    } catch (error) {
      console.error('Error starting playback: ', error);
    }
  };

  useEffect(() => {
    // Load the Spotify Web Playback SDK script
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    // When the script is loaded, initialize the player
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Covey Town',
        getOAuthToken: (cb: OAuthTokenCallback) => {
          cb(spotifyToken || '');
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID ', device_id);

        // Device is now ready, ID = SPOTIFY_DEVICE_ID
        sessionStorage.setItem('SPOTIFY_DEVICE_ID', device_id);

        if (queue.length !== 0) {
          // Play a specified song on the new device
          playSpotifySongOnDevice(
            [queue[0].uri],
            device_id,
          );
        }
      });

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline ', device_id);
      });

      player.connect();
    };
  }, [queue]);

  const searchForTrack = async (trackName: string) => {
    // Send request to spotify API /search, limit by track and first 10 elements
    return await fetch(
      'https://api.spotify.com/v1/search?q=track%3A' + trackName + '&type=track&limit=10',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + spotifyToken || '',
        },
      },
    )
      .then(response => response.json())
      .then(data => {
        const searchResults: Song[] = [];

        data.tracks.items.map((track: any) => {
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

  const changeSpotifyVolume = async (volume: number) => {
    const url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`;
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + spotifyToken || '',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error: ' + response.status);
      }
  
      console.log('Volume changed successfully: ' + volume);
    } catch (error) {
      console.error('Error changing volume: ', error);
    }
  };

  return { player, searchForTrack, playSpotifySongOnDevice, changeSpotifyVolume };
}
