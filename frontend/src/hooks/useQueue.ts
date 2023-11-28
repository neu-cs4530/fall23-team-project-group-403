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

export type QueueDoc = {
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

  /*
   * Creates a new queue document in the database
   * @param townID - ID of the town the queue is for
   * @param newTownName - Name of the town the queue is for
   * @returns - ID of the new queue document
   * @throws - Error if townID or newTownName is empty
   */
  const createNewQueue = async (townID: string, newTownName: string) => {
    if (townID == '' || newTownName == '') {
      throw new Error('Invalid townID or newTownName');
    }

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
  };

  useEffect(() => {
    /*
     * Fetches the queue from the database
     * @returns - Function to unsubscribe from the onSnapshot listener
     */
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

  /*
   * Adds a song to the queue
   * @param s - Song to add to the queue
   * @throws - Error if the song already exists in the queue
   */
  const addToQueue = async (s: Song) => {
    const queueCollection = collection(db, 'Queue');
    const q = query(queueCollection, where('townID', '==', townController?.townID));
    const querySnapshot = await getDocs(q);

    const promises = querySnapshot.docs.map(async currentDoc => {
      const docRef = doc(queueCollection, currentDoc.id);
      const currentQueue = currentDoc.data().queue;

      // Check if song is in queue
      const songIndex = currentQueue.findIndex((song: Song) => song.id === s.id);

      if (songIndex === -1) {
        // Song is not in queue
        // Add the song to the queue
        currentQueue.push(s);
      } else {
        // Song is already in queue
        throw new Error('Song already in the queue!');
      }

      // Update the queue in the document
      await updateDoc(docRef, { queue: currentQueue });
    });

    // Wait for all promises to resolve or reject
    await Promise.all(promises);
  };

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
