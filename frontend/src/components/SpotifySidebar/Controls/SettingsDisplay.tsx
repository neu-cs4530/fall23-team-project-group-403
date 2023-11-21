import { Box, Text, Heading, Input, VStack, StackDivider } from '@chakra-ui/react';
import VolumeSlider from './VolumeSlider';

const SettingsDisplay = ({}) => {
  return (
    <Box>
      <Heading fontSize='l' as='h3' marginBottom={2}>
        Spotify Controls
      </Heading>

      <VStack
        spacing={5}
        borderColor='gray.500'
        alignItems={'stretch'}
        divider={<StackDivider borderColor='gray.200' />}
        borderRadius='4px'>
        <Box>
          <Text>
            Search <Input size='sm' />
          </Text>
          <Text> Search Results </Text>
        </Box>
        <VolumeSlider value={50} onChange={(sliderValue: number) => console.log(sliderValue)} />
      </VStack>
    </Box>
  );
};

export default SettingsDisplay;
