import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, Box, Heading } from '@chakra-ui/react';

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ value, onChange }) => {
  return (
    <Box>
      <Heading fontSize='l' as='h3' marginBottom={1}>Volume</Heading>
      <Slider aria-label='Volume Slider' defaultValue={value} onChangeEnd={onChange} min={0} max={100}>
        <SliderTrack>
          <SliderFilledTrack bgColor={'green.500'} />
        </SliderTrack>
        <SliderThumb boxSize={4} bgColor={'green.200'} />
      </Slider>
    </Box>
  );
};

export default VolumeSlider;
