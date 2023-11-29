import { IconButton, Box, Image, Text, HStack } from '@chakra-ui/react';
import { ThumbUpAlt, ThumbDownAlt } from '@material-ui/icons'
import React from 'react';
import { Song } from '../../../hooks/useQueue';

interface SongProps {
  song: Song;
  onUpvote: () => void;
  onDownvote: () => void;
}

export default function SongDisplay({ song, onUpvote, onDownvote }: SongProps): JSX.Element {
  const [hasVoted, setHasVoted] = React.useState(false);

  const votes = song.voteCount;
  const votePrefix = votes > 0 ? '+' : '';
  let voteColor = 'black'
  if (votes > 0) {
    voteColor = 'green'
  } else if (votes < 0) {
    voteColor = 'red'
  }

  return (
    <Box>
      {song.name} - {song.artist}
      <HStack>
        <IconButton
          aria-label='upvote button'
          disabled={hasVoted}
          icon={<ThumbUpAlt />}
          size='xs'
          variant={'ghost'}
          onClick={() => {
            setHasVoted(true);
            onUpvote();
          }}>
        </IconButton>
        <IconButton
          aria-label='downvote button'
          disabled={hasVoted}
          icon={<ThumbDownAlt />}
          size='xs'
          variant={'ghost'}
          onClick={() => {
            setHasVoted(true);
            onDownvote();
          }}>
        </IconButton> 
        <Text fontSize='xs' color={voteColor}>{votePrefix + votes}</Text>
      </HStack>
    </Box>
  );
}
