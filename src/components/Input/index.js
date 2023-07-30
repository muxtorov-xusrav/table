import * as React from 'react';
import Box from '@mui/material/Box';
import { Input } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function InputWithIcon({ filter, setFilter }) {
  return (
    <Box>
      <Box
        sx={{
          width: 600,
          background: '#5A5C66',
          marginBottom: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Input
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
          sx={{
            width: '100%',
            padding: '5px',
            color: 'white',
          }}
        />
        <SearchIcon
          sx={{ position: 'absolute', right: 10, fontSize: 25, color: 'white' }}
        />
      </Box>
    </Box>
  );
}
