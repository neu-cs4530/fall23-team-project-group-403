import {
  Heading,
  ListItem,
  OrderedList,
  StackDivider,
  VStack,
  Button,
  Input,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
import React from 'react';
import SongDisplay from './SongDisplay';
import { useQueue } from '../../hooks/useQueue';

export default function SpotifySidebar(): JSX.Element {
  const { queue } = useQueue();
  console.log(queue);
  if (queue.length === 0) {
    return <></>;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // fetch songs
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <VStack
      align='left'
      spacing={2}
      border='2px'
      padding={2}
      marginLeft={2}
      borderColor='gray.500'
      height='100%'
      divider={ <StackDivider borderColor='gray.200'/> }
      divider={ <StackDivider borderColor='gray.200'/> }
      borderRadius='4px'>
      <SongDisplay />
      <Heading fontSize='l' as='h3'> Spotify Controls </Heading>
      <SongDisplay />
      <Heading fontSize='l' as='h3'> Spotify Controls </Heading>
      <div>
        Search: <Input size='sm' />
      </div>
      <div> Search Results </div>
    </VStack>
  );
}
