// Componant that shows the current song and the upcoming songs
// Allows users to vote on upcoming songs
// Allows users to vote to skip the current song
import React from 'react';
import SongBox from './SongBox';
import { useQueue } from '../../hooks/useQueue';

import { Heading, ListItem, OrderedList, Button, useToast, Text } from '@chakra-ui/react';

export default function SongsDisplay(): JSX.Element {
  const { queue } = useQueue();
  const voteToast = useToast();

  if (queue.length === 0) {
    return <></>;
  }

  return (
    <div>
      <Heading fontSize='l' as='h2'>
        Current Song:
      </Heading>
      <Text>
        {queue[0].name} <Button size='xs'>Vote Skip</Button>
      </Text>
      <Heading fontSize='l' as='h2'>
        Upcoming Songs
      </Heading>
      <OrderedList>
        {queue.slice(1).map(song => (
          <ListItem key={song.id}>
            <SongBox
              title={song.name}
              artist={song.artist}
              rating={0}
              onUpvote={() => {
                voteToast({
                  title: 'Upvote: ' + song.name,
                  duration: 1000,
                  isClosable: true,
                });
              }}
              onDownvote={() => {
                voteToast({
                  title: 'Downvote: ' + song.name,
                  duration: 1000,
                  isClosable: true,
                });
              }}
            />
          </ListItem>
        ))}
      </OrderedList>
    </div>
  );
}
