// Componant that shows the current song and the upcoming songs
// Allows users to vote on upcoming songs
// Allows users to vote to skip the current song
import React, { useState, useEffect } from 'react';
import SongBox from './SongBox';
import {
  Heading,
  ListItem,
  OrderedList,
  StackDivider,
  VStack,
  Button,
  Input,
  useToast,
  toast,
} from '@chakra-ui/react';

const SONGS = [
  { id: '1', name: 'song1', positive_votes: 0, negative_votes: 0 },
  { id: '2', name: 'song2' },
  { id: '3', name: 'song3' },
];

export default function SongsDisplay(): JSX.Element {
  const { queue } = useQueue();
  console.log(queue);
  if (queue.length === 0) {
    return <></>;
  }
  const [songs, setSongs] = useState(queue);
  const toast = useToast();
  return (
    <div>
      <div>
        Current Song: {songs[0].name} <Button size='xs'>Vote Skip</Button>
      </div>
      <Heading fontSize='l' as='h2'>
        Upcoming Songs
      </Heading>
      <OrderedList>
        {songs.slice(1).map(song => (
          <ListItem key={song.id}>
            <SongBox
              title={song.name}
              artist={'artist'}
              rating={0}
              onUpvote={() => { toast({
                  title: 'Upvote: ' + song.name,
                  duration: 1000,
                  isClosable: true,
                });
              }}
              onDownvote={() => {
                toast({
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
