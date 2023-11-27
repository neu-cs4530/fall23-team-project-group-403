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
};

type QueueDoc = {
  name: string;
  townID: string;
  newTownName: string;
  creationDate: Date;
  currentSong: Song; // This is how we track what song is playing, skippable?
  queue: Song[];
};

export function useQueue() {
  const db = getFirestore();
  const townController = useContext(context);

  const [queue, setQueue] = useState<Song[]>([]);
  // Sort the upcoming songs queue by vote count
  const sortedQueue = queue.sort((a, b) => b.voteCount - a.voteCount);

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
        queue: [],
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
  

  return { createNewQueue, sortedQueue, vote, addToQueue };
}
