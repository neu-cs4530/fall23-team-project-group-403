import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
  DocumentData,
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
            name: 'Never Gonna Give You Up',
            artist: 'Rick Astley',
            upvote: 0,
            downvote: 0,
          },
          {
            name: 'Last Nite',
            artist: 'The Strokes',
            upvote: 0,
            downvote: 0,
          },
          {
            name: 'Heading South',
            artist: 'Zach Bryan',
            upvote: 0,
            downvote: 0,
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

  return { createNewQueue, queue };
}
