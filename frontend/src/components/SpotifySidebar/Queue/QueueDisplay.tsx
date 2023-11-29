import React from 'react';
import SongBox from './SongBox';
import { useQueue } from '../../../hooks/useQueue';

import {
  Heading,
  ListItem,
  OrderedList,
  Button,
  useToast,
  Text,
  Box,
  Image,
} from '@chakra-ui/react';

/*
 * Component to display the current song and the upcoming songs
 * in the queue. Allows users to skip the current song and vote for upcoming songs
 */
export default function QueueDisplay(): JSX.Element {
  const { sortedQueue, vote, skipSong } = useQueue();
  const voteToast = useToast();

  if (sortedQueue.length === 0) {
    return <></>;
  }

  const handleSkipClick = () => {
    console.log('Skip clicked, skipping song');
    // Call skip song
    skipSong();
  };

  return (
    <Box>
      <Heading fontSize='xl' as='h3'>
        Current Song
      </Heading>
      <Text marginBottom={2}>
        {sortedQueue[0].name + ' by ' + sortedQueue[0].artist}
        <Button marginX={2} size='xs' onClick={handleSkipClick}>
          Skip
        </Button>
      </Text>
      <Image src={sortedQueue[0].albumCover} width={20} />
      <Heading fontSize='xl' as='h3' marginY={2}>
        Upcoming Songs
      </Heading>
      <Box maxHeight={550} overflowY='auto' >
        <OrderedList>
          {sortedQueue.slice(1).map(song => (
            <ListItem key={song.id} marginLeft='2'>
              <SongBox
                song={song}
                onUpvote={() => {
                  voteToast({
                    title: 'Upvote: ' + song.name,
                    duration: 1000,
                    isClosable: true,
                  });
                  vote(song.id, 1);
                }}
                onDownvote={() => {
                  voteToast({
                    title: 'Downvote: ' + song.name,
                    duration: 1000,
                    isClosable: true,
                  });
                  vote(song.id, -1);
                }}
              />
            </ListItem>
          ))}
        </OrderedList>
      </Box>
    </Box>
  );
}
