import { ListItem, OrderedList, Button } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

interface SongProps {
  title: string;
  artist: string;
  rating: number;
  onUpvote: () => void;
  onDownvote: () => void;
}

export default function Song({
  title,
  artist,
  rating,
  onUpvote,
  onDownvote,
}: SongProps): JSX.Element {
  const [ hasVoted, setHasVoted ] = React.useState(false);

  return (
      <div>
        {title} - {artist}
        <Button disabled={hasVoted} size='xs' onClick={() => {setHasVoted(true); onUpvote();}}>Upvote</Button>
        <Button disabled={hasVoted} size='xs' onClick={() => {setHasVoted(true); onDownvote();}}>Downvote</Button>
      </div>
  );
}
