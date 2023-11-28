import { renderHook, act } from '@testing-library/react-hooks';
import { Song, useQueue } from './useQueue';
import { addDoc, collection, updateDoc, doc, getDocs } from 'firebase/firestore';
import { waitFor } from '@testing-library/react';

jest.mock('firebase/firestore');

describe('useQueue', () => {
  const mockedDoc = doc as jest.Mock;
  const mockedGetDocs = getDocs as jest.Mock;
  const mockedAddDoc = addDoc as jest.Mock;
  const mockedCollection = collection as jest.Mock;
  const mockedUpdateDoc = updateDoc as jest.Mock;

  const song1: Song = {
    id: '3WMj8moIAXJhHsyLaqIIHI',
    uri: 'spotify:track:3WMj8moIAXJhHsyLaqIIHI',
    name: 'Something in the Orange',
    artist: 'Zach Bryan',
    voteCount: 0,
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273f9017bcd001d030d46850226',
  };

  const song2: Song = {
    id: '12345678',
    uri: 'spotify:track:12345678',
    name: 'My Song',
    artist: 'Jared R',
    voteCount: 0,
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273f9017bcd001d030d46850226',
  };

  beforeEach(() => {
    mockedDoc.mockReturnValue({
      update: mockedUpdateDoc,
    });

    mockedGetDocs.mockReturnValue({
      docs: [
        {
          id: 'mocked-doc-id',
          data: () => ({
            queue: [song1],
          }),
        },
      ],
    });

    mockedCollection.mockReturnValue({
      add: mockedAddDoc,
    });

    mockedAddDoc.mockImplementation(async (collectionRef, data) => ({
      id: 'mocked-doc-id',
      data: () => data,
    }));

    mockedUpdateDoc.mockImplementation(async (docRef, data) => ({
      id: 'mocked-doc-id',
      data: () => data,
    }));

    // clear the mocks
    jest.clearAllMocks();
  });

  describe('createNewQueue tests', () => {
    it('createNewQueue should add a new document to the Queue collection', async () => {
      // Render the hook prior to calling any methods
      const { result } = renderHook(() => useQueue());

      await act(async () => {
        // Call the createNewQueue method
        await result.current.createNewQueue('mockedTownID', 'mockedTownName');
      });

      await waitFor(() => expect(mockedAddDoc).toHaveBeenCalled());

      // Check that the method was called with the expected document information
      expect(mockedAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: 'Test',
          townID: 'mockedTownID',
          newTownName: 'mockedTownName',
          creationDate: expect.any(Date),
          queue: expect.any(Array),
        }),
      );
    });

    it('should throw an error if townID is empty', async () => {
      // Render the hook
      const { result } = renderHook(() => useQueue());

      // Use act with an async function
      await act(async () => {
        // Call the createNewQueue method
        await expect(result.current.createNewQueue('', 'mockedTownName')).rejects.toThrowError(
          'Invalid townID or newTownName',
        );
      });
    });

    it('should throw an error if newTownName is empty', async () => {
      // Render the hook
      const { result } = renderHook(() => useQueue());

      // Use act with an async function
      await act(async () => {
        // Call the createNewQueue method
        await expect(result.current.createNewQueue('mockedTownID', '')).rejects.toThrowError(
          'Invalid townID or newTownName',
        );
      });
    });
  });

  describe('addToQueue tests', () => {
    it('addToQueue should add a song to the queue', async () => {
      const mockedUpdateDoc = updateDoc as jest.Mock;

      // Mock the updateDoc implementation
      mockedUpdateDoc.mockImplementationOnce(async (docRef, data) => ({
        id: 'mocked-doc-id',
        data: () => data,
      }));

      // Render the hook
      const { result } = renderHook(() => useQueue());

      await act(async () => {
        await result.current.addToQueue(song2);
      });

      expect(mockedDoc).toHaveBeenCalled();

      expect(mockedUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          queue: [song1, song2],
        }),
      );
    });

    it('should throw an error if the song is already in the active queue', async () => {
      // Render the hook
      const { result } = renderHook(() => useQueue());

      await act(async () => {
        try {
          // Call the addToQueue method
          await result.current.addToQueue(song1);
        } catch (error: any) {
          // Assert that the error message is as expected
          expect(error.message).toBe('Song already in the queue!');
        }
      });
    });
  });

  describe('vote tests', () => {
    const runVoteTest = async (mockQueueDoc: any, voteCount: 1 | -1, expectedVoteCount: number) => {
      // Render the hook
      const { result } = renderHook(() => useQueue());

      (getDocs as jest.Mock).mockReturnValueOnce(mockQueueDoc);

      await act(async () => {
        // Call the vote method
        await result.current.vote('3WMj8moIAXJhHsyLaqIIHI', voteCount);
      });

      // Wait for any asynchronous operations to complete
      await waitFor(() => expect(mockedUpdateDoc).toHaveBeenCalled());

      // Verify the vount count updated properly
      expect(mockedUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          queue: [
            {
              id: '3WMj8moIAXJhHsyLaqIIHI',
              uri: 'spotify:track:3WMj8moIAXJhHsyLaqIIHI',
              name: 'Something in the Orange',
              artist: 'Zach Bryan',
              voteCount: expectedVoteCount, // Vote count should be updated based on the parameter
              albumCover: 'https://i.scdn.co/image/ab67616d0000b273f9017bcd001d030d46850226',
            },
          ],
        }),
      );
    };

    it('vote should increase vote count for a song when positive 1 passed in', async () => {
      // Add fake data to the queue mock document
      song1.voteCount = 0;
      const mockQueueDoc = [
        {
          id: 'mocked-doc-id',
          data: () => ({
            queue: [song1],
          }),
        },
      ];
      await runVoteTest(mockQueueDoc, 1, 1);
    });

    it('vote should decrease vote count for a song when negative 1 passed in', async () => {
      // Add fake data to the queue mock document
      song1.voteCount = 0;
      const mockQueueDoc = [
        {
          id: 'mocked-doc-id',
          data: () => ({
            queue: [song1],
          }),
        },
      ];
      await runVoteTest(mockQueueDoc, -1, -1);
    });

    it('vote should increase vote count for a song with positive vote count', async () => {
      // Add fake data to the queue mock document
      song1.voteCount = 1;
      const mockQueueDoc = [
        {
          id: 'mocked-doc-id',
          data: () => ({
            queue: [song1],
          }),
        },
      ];
      await runVoteTest(mockQueueDoc, 1, 2);
    });

    it('vote should decrease vote count for a song with negative vote count', async () => {
      // Add fake data to the queue mock document
      song1.voteCount = -1;
      const mockQueueDoc = [
        {
          id: 'mocked-doc-id',
          data: () => ({
            queue: [song1],
          }),
        },
      ];
      await runVoteTest(mockQueueDoc, -1, -2);
    });

    it('should remove a song when there are more than 3 downvotes', async () => {
      // Add fake data to the queue mock document
      song1.voteCount = -4;
      const mockQueueDoc = [
        {
          id: 'mocked-doc-id',
          data: () => ({
            queue: [song1],
          }),
        },
      ];

      const { result } = renderHook(() => useQueue());

      (getDocs as jest.Mock).mockReturnValueOnce(mockQueueDoc);

      await act(async () => {
        // Call the vote method
        await result.current.vote('3WMj8moIAXJhHsyLaqIIHI', -1);
      });

      // Wait for any asynchronous operations to complete
      await waitFor(() => expect(mockedUpdateDoc).toHaveBeenCalled());

      // Verify the vount count updated properly
      expect(mockedUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          queue: [],
        }),
      );
    });

    it('should not update the doc if an invalid songID is passed in', async () => {
      jest.resetAllMocks();
      // Add fake data to the queue mock document
      song1.voteCount = -4;
      const mockQueueDoc = [
        {
          id: 'mocked-doc-id',
          data: () => ({
            queue: [song1],
          }),
        },
      ];

      const { result } = renderHook(() => useQueue());

      (getDocs as jest.Mock).mockReturnValueOnce(mockQueueDoc);

      await act(async () => {
        // Call the vote method
        await result.current.vote('invalid-id', 1);
      });

      // Wait for any asynchronous operations to complete
      await waitFor(() => expect(mockedUpdateDoc).not.toHaveBeenCalled());
    });
  });
});
