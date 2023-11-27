import { Button, Box, Image } from '@chakra-ui/react';
import React from 'react';
import { Song } from '../../../hooks/useQueue';

interface SongProps {
  song: Song;
  onUpvote: () => void;
  onDownvote: () => void;
}

export default function SongDisplay({ song, onUpvote, onDownvote }: SongProps): JSX.Element {
  const [hasVoted, setHasVoted] = React.useState(false);

  return (
    <Box>
      {song.name} - {song.artist}
      <Box>
        <Button
          //disabled={hasVoted}
          size='xs'
          onClick={() => {
            setHasVoted(true);
            onUpvote();
          }}>
          Upvote
        </Button>
        <Button
          //disabled={hasVoted}
          size='xs'
          onClick={() => {
            setHasVoted(true);
            onDownvote();
          }}>
          Downvote
        </Button>
      </Box>
    </Box>
  );
}
