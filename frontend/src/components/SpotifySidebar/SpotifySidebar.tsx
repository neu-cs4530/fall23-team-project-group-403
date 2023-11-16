import {
  Heading,
  ListItem,
  OrderedList,
  StackDivider,
  VStack,
  Button,
  Input,
} from '@chakra-ui/react';
import React from 'react';
import { useQueue } from '../../hooks/useQueue';

export default function SpotifySidebar(): JSX.Element {
  const { queue } = useQueue();
  console.log(queue)
  if (queue.length === 0) {
    return <></>;
  }

  return (
    <VStack
      align='left'
      spacing={2}
      border='2px'
      padding={2}
      marginLeft={2}
      borderColor='gray.500'
      height='100%'
      divider={<StackDivider borderColor='gray.200' />}
      borderRadius='4px'>
      <Heading fontSize='xl' as='h1'>
        Spotify Controls
      </Heading>
      <div>
        Current Song: {queue[0].name} <Button size='xs'>Vote Skip</Button>
      </div>
      <Heading fontSize='l' as='h2'>
        Upcoming Songs
      </Heading>
      <OrderedList>
        {queue.slice(1).map((song, id) => (
          <ListItem key={id}>
            <div>
              {song.name}
              <Button size='xs'>Upvote</Button>
              <Button size='xs'>Downvote</Button>
            </div>
          </ListItem>
        ))}
      </OrderedList>
      <Heading fontSize='l' as='h2'>
        Spotify Controls
      </Heading>
      <div>
        Search: <Input size='sm' />
      </div>
      <div> Search Results </div>
      <div> </div>
    </VStack>
  );
}
