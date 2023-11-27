import { Box, Text, Heading, Input, VStack, StackDivider, OrderedList, ListItem, Button } from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../../../hooks/useQueue';
import { useSpotify } from '../../../hooks/useSpotify';
import useTownController from '../../../hooks/useTownController';
import VolumeSlider from './VolumeSlider';
import { useQueue } from '../../../hooks/useQueue';

const SettingsDisplay = () => {
  const { sortedQueue, vote, addToQueue } = useQueue();
  const { searchForTrack, changeSpotifyVolume } = useSpotify();
  const coveyTownController = useTownController();
  const [songResults, setSongResults] = useState<Song[] | null>(null);
  const top5Results = songResults?.slice(0,5);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create a debounce function so we only send a new search API call after a time interval
  // This prevents us from sending a new API call for every key stroke
  const debounce = (func: () => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(func, delay);
    };
  };

  // Debounce search call, waits 300 ms before calling search API
  const debouncedSearch = debounce(async () => {
    const searchResults = await searchForTrack(inputRef.current?.value || '');
    setSongResults(searchResults);
  }, 300);

  const handleKeyInput = () => {
    debouncedSearch();
  };




  useEffect(() => {
    // Pause the town when the input is focused, we don't want to move while searching
    const handleFocusChange = () => {
      if (document.activeElement !== inputRef.current) {
        coveyTownController.unPause();
      } else {
        coveyTownController.pause();
      }
    };

    inputRef.current?.addEventListener('focus', handleFocusChange);
    inputRef.current?.addEventListener('blur', handleFocusChange);

    return () => {
      inputRef.current?.removeEventListener('focus', handleFocusChange);
      inputRef.current?.removeEventListener('blur', handleFocusChange);
    };
  }, [inputRef, coveyTownController]);

  return (
    <Box>
      <Heading fontSize='xl' as='h2' >
        Controls
      </Heading>

      <VStack
        spacing={5}
        borderColor='gray.500'
        alignItems={'stretch'}
        divider={<StackDivider borderColor='gray.200' />}
        borderRadius='4px'>
        <Box>
          <Heading fontSize='l' as='h3' marginBottom={2}>
            SEARCH SONG BY NAME <Input ref={inputRef} onKeyUp={handleKeyInput} size='sm' backgroundColor={'gray.100'}/>
          </Heading>
          <Heading fontSize='l' as='h3' marginBottom={1}>
            Search Results    (Name, Artist)
          </Heading>
          <OrderedList>
            {top5Results?.map(song => (
              <ListItem key={song.id}>
                { song.name } - { song.artist }
                <Button size={'xs'} onClick={() => addToQueue(song)}>Add</Button>
              </ListItem>
            ))}
          </OrderedList>
        </Box>
        <VolumeSlider value={50} onChange={(sliderValue: number) => changeSpotifyVolume(sliderValue)} />
      </VStack>
    </Box>
  );
};

export default SettingsDisplay;
