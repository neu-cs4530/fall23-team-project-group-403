import { useEffect, useState } from 'react';
import { useQueue } from './useQueue';

export function useSongStatus() {
    const { queue, updateCurrentlyPlayingSong } = useQueue();
    const [hasBeenCalled, setHasBeenCalled] = useState(false);
    const checkIfSongIsOverInterval = 1000; // 1 second

    useEffect(() => {
        const intervalID = setInterval(() => {

            // Check if the device ID has been set in the session storage yet (if not then we're not ready to play music yet)
            const device_id = sessionStorage.getItem('SPOTIFY_DEVICE_ID');
            if (device_id === null) {
                console.log("Device ID Null because device is not ready yet, waiting until device is ready)")
                return;
            }

            // If this is the first time this function is being called (hasBeenCalled = false)
            if (!hasBeenCalled) {
                // Player just joined the town, start initial playback
                setHasBeenCalled(true);
                console.log("Calling updateCurrentlyPlayingSong to start initial playback")
                updateCurrentlyPlayingSong(false, '');
            }
            else {
                // Every other time this function is called (check for song being over)

                if (queue.length === 0) {
                    console.log("Issue: Queue is empty")
                }

                // A buffer if we want to update the song early (ie 5 seconds before the song is over)
                const buffer = 0 // -5000; // 5 second buffer
                const endTime = queue[0].startTime + queue[0].duration + buffer;

                // If now is past the end time, the song is over
                if (Date.now() >= endTime) {
                    console.log("Song is over, calling updateCurrentlyPlayingSong")
                    // Call with the currently playing URI to prevent duplicate skips
                    updateCurrentlyPlayingSong(true, queue[0].uri);
                }
            }
        }, checkIfSongIsOverInterval);

        return () => {
            clearInterval(intervalID);
        }
    }, [queue, hasBeenCalled])
}
    