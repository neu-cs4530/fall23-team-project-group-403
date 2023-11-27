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
  const { queue, vote } = useQueue();
  const voteToast = useToast();

  if (queue.length === 0) {
    return <></>;
  }

  // Sort the upcoming songs queue by vote count
  const sortedQueue = queue.sort((a, b) => b.voteCount - a.voteCount);

  return (
    <Box>
        <Heading fontSize='xl' as='h3'>
          Current Song
        </Heading>
        <Text>
          {queue[0].name} <Button size='xs'>Vote Skip</Button>
        </Text>
        <Image src={queue[0].albumCover} width={20} />

        <Heading fontSize='xl' as='h3'>
          Upcoming Songs
        </Heading>
        <OrderedList>
          {sortedQueue.slice(1).map(song => (
            <ListItem key={song.id}>
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
  );
}
