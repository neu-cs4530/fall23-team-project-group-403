import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useSpotify } from './useSpotify';

describe('useSpotify', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Mock sessionStorage.getItem to return a mock token
    jest.spyOn(window.sessionStorage.__proto__, 'getItem').mockReturnValue('mocked-token');
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('searchForTrack tests', () => {
    it('searchForTrack should return a list of songs', async () => {
      const mockFetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          tracks: {
            items: [
              {
                id: '1',
                uri: 'spotify:track:1',
                name: 'Song 1',
                artists: [{ name: 'Artist 1' }],
                album: { images: [{ url: 'https://example.com/image1.jpg' }] },
                duration_ms: 200000,
              },
            ],
          },
        }),
      });

      global.fetch = mockFetch;
      const { result } = renderHook(() => useSpotify());

      // Call the searchForTrack method
      const searchResults = await result.current.searchForTrack('Test');

      // Verify the mock fetch function was called with the correct arguments
      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object));

      // Verify the search results
      expect(searchResults).toEqual([
        {
          id: '1',
          uri: 'spotify:track:1',
          name: 'Song 1',
          artist: 'Artist 1',
          voteCount: 0,
          albumCover: 'https://example.com/image1.jpg',
          duration: 200000,
          startTime: 0,
        },
      ]);
    });
  });

  describe('changeSpotfiyVolume tests', () => {
    it('changeSpotifyVolume should change volume successfully with value 50', async () => {
      const mockFetch = jest.fn().mockResolvedValueOnce({
        ok: true,
      });

      global.fetch = mockFetch;
      const { result } = renderHook(() => useSpotify());

      // Call the changeSpotifyVolume method
      await result.current.changeSpotifyVolume(50);

      // Verify the mock fetch function was called with the correct arguments
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me/player/volume?volume_percent=50',
        expect.objectContaining({ method: 'PUT' }),
      );
    });
  });
  
  describe('transferSpotifyPlayback tests', () => {
    it('transferSpotifyPlayback should transfer playback to a new device', async () => {
      const mockFetch = jest.fn().mockResolvedValueOnce({
        ok: true,
      });

      global.fetch = mockFetch;
      const { result } = renderHook(() => useSpotify());

      // Call the transferSpotifyPlayback method
      await act(async () => {
        await result.current.transferSpotifyPlayback('new-device-id', true);
      });

      // Verify the mock fetch function was called with the correct arguments
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me/player',
        expect.objectContaining({
          body: '{"device_ids":["new-device-id"],"play":true}',
          headers: { Authorization: 'Bearer mocked-token' },
          method: 'PUT',
        }),
      );
    });
  });

  describe('localPlaySongOnSpotify tests', () => {
    it('localPlaySongOnSpotify should play a song on Spotify locally', async () => {
      const mockFetch = jest.fn().mockResolvedValueOnce({
        ok: true,
      });

      global.fetch = mockFetch;
      const { result } = renderHook(() => useSpotify());

      // Call the localPlaySongOnSpotify method
      await act(async () => {
        await result.current.localPlaySongOnSpotify(['spotify:track:1'], 0, 'device-id');
      });

      // Verify the mock fetch function was called with the correct arguments
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.spotify.com/v1/me/player/play?device_id=device-id',
        expect.objectContaining({
          body: '{"uris":["spotify:track:1"],"position_ms":0}',
          headers: { Authorization: 'Bearer mocked-token' },
          method: 'PUT',
        }),
      );
    });
  });
});
