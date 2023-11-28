import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';

import context from '../contexts/TownControllerContext';

export type Song = {
  id: string; // Spotify Track ID
  uri: string; // Spotify Track URI
  name: string;
  artist: string;
  voteCount: number; // Number of votes for this song
  albumCover: string; // URL for the Album Cover
  duration: number; // Duration of the song in milliseconds
  startTime: number;
};

type QueueDoc = {
  name: string;
  townID: string;
  newTownName: string;
  creationDate: Date;
  queue: Song[];
};

export function useQueue() {
  const [spotifyToken, setSpotifyToken] = useState(sessionStorage.getItem('SPOTIFY_AUTH_TOKEN'));
  const db = getFirestore();
  const townController = useContext(context);

  const defaultSong = {
    id: '4PTG3Z6ehGkBFwjybzWkR8',
    uri: 'spotify:track:4PTG3Z6ehGkBFwjybzWkR8',
    name: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    voteCount: 0,
    albumCover: 'https://i.scdn.co/image/ab67616d0000b27315ebbedaacef61af244262a8',
    duration: 213573,
    startTime: Date.now(),
  }
  const [queue, setQueue] = useState<Song[]>([]);
  // Sort the upcoming songs queue by vote count (exclude the first song, which is the currently playing song)
  const sortedQueue = queue.length > 0 ? [queue[0], ...queue.slice(1).sort((a, b) => b.voteCount - a.voteCount)] : [];

  const createNewQueue = async (townID: string, newTownName: string) => {
    try {
      // Add to Queue Collection
      const queueCollection = collection(db, 'Queue');
      const newQueue = {
        name: 'Test',
        townID: townID || '',
        newTownName: newTownName || '',
        creationDate: new Date(),
        // Hardcode the list of songs for this iteration
        queue: [
          {
            id: '7to68V64Cu6zk0UDo5tyw3',
            uri: 'spotify:track:7to68V64Cu6zk0UDo5tyw3',
            name: 'Confidence',
            artist: 'Ocean Alley',
            voteCount: 0,
            albumCover: 'https://i.scdn.co/image/ab67616d0000b27346329ac2946a9313ff6b52f3',
            duration: 253076,
            startTime: Date.now(),
          },
          {
            id: '27L8sESb3KR79asDUBu8nW',
            uri: 'spotify:track:27L8sESb3KR79asDUBu8nW',
            name: "Stacy's Mom",
            artist: 'Fountains Of Wayne',
            voteCount: 0,
            albumCover: 'https://i.scdn.co/image/ab67616d0000b273079e826265dffc3a8a26bac5',
            duration: 197986,
            startTime: 0,
          },
          {
            id: '3PfIrDoz19wz7qK7tYeu62',
            uri: 'spotify:track:3PfIrDoz19wz7qK7tYeu62',
            name: "Don't Start Now",
            artist: 'Dua Lipa',
            voteCount: 0,
            albumCover: 'https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f',
            duration: 183290,
            startTime: 0,
          },
          {
            id: '3SUusuA9jH1v6PVwtYMbdv',
            uri: 'spotify:track:3SUusuA9jH1v6PVwtYMbdv',
            name: 'Last Nite',
            artist: 'The Strokes',
            voteCount: 0,
            albumCover: 'https://i.scdn.co/image/ab67616d0000b27313f2466b83507515291acce4',
            duration: 193373,
            startTime: 0,
          },
          {
            id: '4iZ4pt7kvcaH6Yo8UoZ4s2',
            uri: 'spotify:track:4iZ4pt7kvcaH6Yo8UoZ4s2',
            name: 'Snooze',
            artist: 'SZA',
            voteCount: 0,
            albumCover: 'https://i.scdn.co/image/ab67616d0000b27370dbc9f47669d120ad874ec1',
            duration: 201800,
            startTime: 0,
          },
          {
            id: '4KULAymBBJcPRpk1yO4dOG',
            uri: 'spotify:track:4KULAymBBJcPRpk1yO4dOG',
            name: 'I Remember Everything (feat. Kacey Musgraves)',
            artist: 'Zach Bryan',
            voteCount: 0,
            albumCover: 'https://i.scdn.co/image/ab67616d0000b273e5a25ed08d1e7e0fbb440cef',
            duration: 227195,
            startTime: 0,
          },
          {
            id: '2FRnf9qhLbvw8fu4IBXx78',
            uri: 'spotify:track:2FRnf9qhLbvw8fu4IBXx78',
            name: 'Last Christmas',
            artist: 'Wham!',
            voteCount: 0,
            albumCover: 'https://i.scdn.co/image/ab67616d0000b273f2d2adaa21ad616df6241e7d',
            duration: 262960,
            startTime: 0,
          },
          {
            id: '5mjYQaktjmjcMKcUIcqz4s',
            uri: 'spotify:track:5mjYQaktjmjcMKcUIcqz4s',
            name: 'Strangers',
            artist: 'Kenya Grace',
            voteCount: 0,
            albumCover: 'https://i.scdn.co/image/ab67616d0000b2734756c2e9ae436437cd75e9f3',
            duration: 172964,
            startTime: 0,
          },
          {
            id: '7cyKrN1y4q59bc1gJX3QEG',
            uri: 'spotify:track:7cyKrN1y4q59bc1gJX3QEG',
            name: 'Start A Fire',
            artist: 'John Legend',
            voteCount: 0,
            albumCover: 'https://i.scdn.co/image/ab67616d0000b2730bdf4dd39843ad48c5b66bc4',
            duration: 192093,
            startTime: 0,
          },
        ],
      };
      const docRef = await addDoc(queueCollection, newQueue);

      return docRef.id;
    } catch (error) {
      console.error('Error creating a new queue', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchQueue = async () => {
      if (townController?.townID) {
        const q = query(collection(db, 'Queue'), where('townID', '==', townController?.townID));

        // Use firebase onSnapshot to listen for DB changes
        const unsubscribe = onSnapshot(q, snapshot => {
          const newQueue = snapshot.docs.flatMap(doc => doc.data().queue);
          setQueue(newQueue);
        });

        return () => {
          unsubscribe();
        };
      }
    };

    fetchQueue();
  }, [db, townController?.townID]);

  const addToQueue = async (s: Song) => {
    const queueCollection = collection(db, 'Queue');
    const q = query(queueCollection, where('townID', '==', townController?.townID));
    const querySnapshot = await getDocs(q);
    // Check if the song already exists in the database
    if (querySnapshot.empty) {
      await addDoc(queueCollection, { id: s.id, name: s.name, artist: s.artist, voteCount: s.voteCount });
    }
    querySnapshot.forEach(async currentDoc => {
        const docRef = doc(queueCollection, currentDoc.id);
        const currentQueue = currentDoc.data().queue;
        // Check if song is in queue
        const songIndex = currentQueue.findIndex((song: Song) => song.id === s.id);
        if (songIndex === -1) { 
          // Song is not in queue
          // Add the song to the queue
          currentQueue.push(s);
        }
        // Update the queue in the document
        await updateDoc(docRef, { queue: currentQueue });
      });
  }

  const vote = async (songID: string, number: 1 | -1) => {
    const queueCollection = collection(db, 'Queue');
    const q = query(queueCollection, where('townID', '==', townController?.townID));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async currentDoc => {
      const docRef = doc(queueCollection, currentDoc.id);

      const currentQueue = currentDoc.data().queue;

      // Find the index of the song in the queue
      const songIndex = currentQueue.findIndex((song: Song) => song.id === songID);

      if (songIndex !== -1) {
        // Update the voteCount for the specific song
        currentQueue[songIndex].voteCount += number;

        // Check if the vote count is below -3
        if (currentQueue[songIndex].voteCount < -3) {
          // Remove the song from the queue
          currentQueue.splice(songIndex, 1);
        }

        // Update the queue in the document
        await updateDoc(docRef, { queue: currentQueue });
      }
    });
  };
  

  // Local helper to play a specific song (without a target device)
  const localPlaySongWithoutDevice = async (songURIs: string[], position: number) => {
    const url = 'https://api.spotify.com/v1/me/player/play';
    const body = {
      uris: songURIs,
      position_ms: position,
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

      // console.log('Playback device: ' + deviceID);
      console.log('Started playing successfully: ' + songURIs);
    } catch (error) {
      console.error('Error starting playback: ', error);
    }
  };

  // Helper to update the currently playing song (used for skip, and when a song ends)
  // shoouldChangeSong is a boolean that determines if the song should be changed (ie skipped, or if it should just play the currently playing song)
  // currentURI is the URI of the currently playing song (used as confirmation to prevent double skips) (used to check if the song was skipped by someone else)
  const updateCurrentlyPlayingSong = async (shouldChangeSong: boolean, currentURI: string) => {
    // Get this town ID's queue
    const queueCollection = collection(db, 'Queue');
    const q = query(queueCollection, where('townID', '==', townController?.townID));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async currentDoc => {
      const docRef = doc(queueCollection, currentDoc.id);
      const currentQueue: Song[] = currentDoc.data().queue;

      // When we get the queue, it's unsorted, so we have to sort it
      const localSortedQueue = [currentQueue[0], ...currentQueue.slice(1).sort((a, b) => b.voteCount - a.voteCount)]

      // Get the currently playing song
      let currentlyPlayingSong = localSortedQueue[0]

      if (currentlyPlayingSong.uri !== currentURI) {
        // This means that the song was skipped by someone else already, so shouldChangeSong should be false
        shouldChangeSong = false;
      }

      // If we want to change the song
      if (shouldChangeSong) {
        // Remove the first song from the queue
        const newQueue = localSortedQueue.slice(1);

        // If the new queue is empty, then add the default song to the queue
        if (newQueue.length === 0) {
          // Append the default song to the queue
          newQueue.push(defaultSong);
        }

        // Update the start time
        newQueue[0].startTime = Date.now();

        // Update the queue in the document
        await updateDoc(docRef, { queue: newQueue});

        // Set currently playing
        currentlyPlayingSong = newQueue[0];
      }
      // Play the currently playing song
      const songStartPosition = currentlyPlayingSong.startTime !== 0 ? Date.now() - currentlyPlayingSong.startTime : 0
      console.log("Calling localPlaySongWithoutDevice: " + currentlyPlayingSong.name + ", " + currentlyPlayingSong.uri + " - at time: " + songStartPosition)
      // Call the local helper to play the song
      localPlaySongWithoutDevice(
        [currentlyPlayingSong.uri],
        currentlyPlayingSong.startTime !== 0 ? Date.now() - currentlyPlayingSong.startTime : 0,
      );
    });
  }

  return { createNewQueue, sortedQueue, vote, addToQueue, updateCurrentlyPlayingSong };
}
