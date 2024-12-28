import { useState } from 'react';
import { Container, Typography, TextField, List, ListItem, ListItemText, Button } from '@mui/material';

const SearchByBrand = () => {
  const [brand, setBrand] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    console.log('Searching for brand:', brand);
    // Mock API call or data filtering logic
    setResults([`Product 1 of ${brand}`, `Product 2 of ${brand}`]);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Product by Brand
      </Typography>
      <TextField
        label="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>
        Search
      </Button>
      <List sx={{ mt: 4 }}>
        {results.map((result, index) => (
          <ListItem key={index}>
            <ListItemText primary={result} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default SearchByBrand;
