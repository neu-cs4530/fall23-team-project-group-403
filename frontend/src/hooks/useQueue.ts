import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
  DocumentData,
  doc,
  updateDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';

import context from '../contexts/TownControllerContext';

export function useQueue() {
  const db = getFirestore();
  const townController = useContext(context);

  const [queue, setQueue] = useState<DocumentData[]>([]);

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
            id: '0',
            name: 'Never Gonna Give You Up',
            artist: 'Rick Astley',
            voteCount: 0,
          },
          {
            id: '1',
            name: 'Last Nite',
            artist: 'The Strokes',
            voteCount: 0,
          },
          {
            id: '2',
            name: 'Heading South',
            artist: 'Zach Bryan',
            voteCount: 0,
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

  const vote = async (songID: string, number: 1 | -1) => {
    const queueCollection = collection(db, 'Queue');
    const q = query(queueCollection, where('townID', '==', townController?.townID));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (townDoc) => {
      const docRef = doc(queueCollection, townDoc.id);
      // Check if the current document's songID matches the provided songID
      if (townDoc.data.id === songID) {
        const updatedVoteCount = townDoc.data.name + number;
        // Update the voteCount for the specific song
        await updateDoc(docRef, { voteCount: updatedVoteCount });
      }
    });
  };
  return { createNewQueue, queue, vote };
}
