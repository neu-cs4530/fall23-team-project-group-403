import { StackDivider, VStack } from '@chakra-ui/react';
import React from 'react';
import QueueDisplay from './Queue/QueueDisplay';
import SettingsDisplay from './Controls/SettingsDisplay';

export default function SpotifySidebar(): JSX.Element {
  return (
    <VStack
      align='left'
      spacing={5}
      border='2px'
      padding={2}
      marginLeft={2}
      borderColor='gray.500'
      height='100%'
      divider={<StackDivider borderColor='gray.200' />}
      borderRadius='4px'>
      <QueueDisplay />
      <SettingsDisplay />
    </VStack>
  );
}
