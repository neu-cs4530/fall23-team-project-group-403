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
import SongDisplay from './SongDisplay';

export default function SpotifySidebar(): JSX.Element {
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
      borderRadius='4px'>
      <SongDisplay />
      <Heading fontSize='l' as='h3'> Spotify Controls </Heading>
      <div>
        Search: <Input size='sm' />
      </div>
      <div> Search Results </div>
    </VStack>
  );
}
