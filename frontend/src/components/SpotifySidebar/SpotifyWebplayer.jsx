import React, { useState, useEffect } from 'react';

function SpotifyWebplayer(props) {

    // Use state for the Spotify player
    const [player, setPlayer] = useState(undefined);

    // Function to prompt playback of a specific song on a specific device
    const playSpotifySongOnDevice = async (songURIs, token, deviceID) => { // Can later add offset or position
        const url = 'https://api.spotify.com/v1/me/player/play' + '?device_id=' + deviceID;
        const body = {
            uris: songURIs // ['spotify:track:4PTG3Z6ehGkBFwjybzWkR8']
        }

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            console.log('Playback device: ' + deviceID);
            console.log('Started playing successfully: ' + songURIs);
        } catch (error) {
            console.error('Error starting playback: ', error);
        }
    }

    useEffect(() => {
        // Load the Spotify Web Playback SDK script
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        // When the script is loaded, initialize the player
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Covey Town',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID ', device_id);
                
                // Device is now ready, ID = SPOTIFY_DEVICE_ID
                sessionStorage.setItem('SPOTIFY_DEVICE_ID', device_id);

                // If you want to stop getting rick rolled every time you log into Covey Town:
                // PRADA (Explicit)
                // spotify:track:59NraMJsLaMCVtwXTSia8i
                // NEVER GONNA GIVE YOU UP
                // spotify:track:4PTG3Z6ehGkBFwjybzWkR8

                // Play a specified song on the new device
                playSpotifySongOnDevice(['spotify:track:4PTG3Z6ehGkBFwjybzWkR8'], sessionStorage.getItem('SPOTIFY_AUTH_TOKEN'), device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline ', device_id);
            });

            player.connect();
        };
    }, []);

    return (
        <>
            <div className='container'>
                <div className='main-wrapper'>

                </div>
            </div>
        </>
    );
}

export default SpotifyWebplayer