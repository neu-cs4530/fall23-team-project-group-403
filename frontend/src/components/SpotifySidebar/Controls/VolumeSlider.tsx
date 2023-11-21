import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, Box, Text } from '@chakra-ui/react';

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ value, onChange }) => {
  return (
    <Box>
      <Text>Volume</Text>
      <Slider aria-label='Volume Slider' defaultValue={value} onChange={onChange} min={0} max={100}>
        <SliderTrack>
          <SliderFilledTrack bgColor={'green.500'} />
        </SliderTrack>
        <SliderThumb boxSize={4} bgColor={'green.200'} />
      </Slider>
    </Box>
  );
};

export default VolumeSlider;
