import { useEffect, useState } from 'react';
import { Song } from './useQueue';

// Declare Typescript types for the Spotify Web Playback SDK
type OAuthTokenCallback = (token: string) => void;
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

/*
 * Hook to use Spotify Web Playback SDK and Spotify REST API
 * @returns player - the Spotify player
 * @returns searchForTrack - function to search for a track on Spotify
 * @returns changeSpotifyVolume - function to change the volume of the Spotify player
 * @returns transferSpotifyPlayback - function to transfer playback to a new device
 * @returns localPlaySongOnSpotify - function to play a song on Spotify locally
 */
export function useSpotify() {
  // Use state for the Spotify player
  const [player, setPlayer] = useState(undefined);
  const [spotifyToken, setSpotifyToken] = useState(sessionStorage.getItem('SPOTIFY_AUTH_TOKEN'));

  // Helper method to send a Spotify REST API
  const sendSpotifyRequest = async (url: string, method: string, body: string) => {
    const headers = {
      Authorization: 'Bearer ' + spotifyToken || '',
    };

    const options: RequestInit = {
      method: method,
      headers: headers,
    };

    // Include the body only if the request method is not GET
    if (method !== 'GET') {
      options.body = body;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('Error: ' + response.status);
    }

    return response;
  };

  /*
   * Transfer playback to a new device
   * @param deviceID - the ID of the device to transfer playback to
   * @param resumePlay - whether or not to resume playback on the new device
   */
  const transferSpotifyPlayback = async (deviceID: string, resumePlay: boolean) => {
    const url = 'https://api.spotify.com/v1/me/player';
    const body = {
      device_ids: [deviceID],
      play: resumePlay,
    };

    try {
      await sendSpotifyRequest(url, 'PUT', JSON.stringify(body));
      console.log('Playback transfer successful');
    } catch (error) {
      console.error('Error transferring playback: ', error);
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

        // Transfer playback to the new device
        transferSpotifyPlayback(device_id, true);
      });

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline ', device_id);
      });

      player.connect();
    };
  }, []); // We just want playback transferred once (at the beginning, not every time the queue updates)

  /*
   * Search for a track on Spotify
   * @param trackName - the name of the track to search for
   */
  const searchForTrack = async (trackName: string) => {
    // Send request to spotify API /search, limit by track and first 10 elements
    return await sendSpotifyRequest(
      'https://api.spotify.com/v1/search?q=track%3A' + trackName + '&type=track&limit=10',
      'GET',
      '',
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
            duration: track.duration_ms,
            startTime: 0,
          };

          searchResults.push(song);
        });
        return searchResults;
      });
  };

  /*
   * Change the volume of the Spotify player
   * @param volume - the volume to change to (0-100)
   */
  const changeSpotifyVolume = async (volume: number) => {
    const url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`;

    try {
      await sendSpotifyRequest(url, 'PUT', '');
      console.log('Volume changed successfully: ' + volume);
    } catch (error) {
      console.error('Error changing volume: ', error);
    }
  };

  /*
   * Helper to play a song on spotify locally
   * @param songURIs - Array of song URIs to play
   * @param position - Position in milliseconds to start the song at
   * @param deviceID - ID of the device to play the song on
   */
  const localPlaySongOnSpotify = async (
    songURIs: string[],
    position: number,
    deviceID: string = '',
  ) => {
    // If deviceID is specified, explicitly play on that device
    const url =
      deviceID === ''
        ? 'https://api.spotify.com/v1/me/player/play'
        : 'https://api.spotify.com/v1/me/player/play' + '?device_id=' + deviceID;

    const body = {
      uris: songURIs,
      position_ms: position,
    };

    try {
      await sendSpotifyRequest(url, 'PUT', JSON.stringify(body));
      console.log('Started playing successfully: ' + songURIs);
    } catch (error) {
      console.error('Error starting playback: ', error);
    }
  };

  return {
    player,
    searchForTrack,
    changeSpotifyVolume,
    transferSpotifyPlayback: transferSpotifyPlayback,
    localPlaySongOnSpotify,
  };
}
