import { useState } from 'react';
import { Container, Typography, TextField, List, ListItem, ListItemText, Button } from '@mui/material';

const SearchByCategory = () => {
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    console.log('Searching for category:', category);
    // Mock API call or data filtering logic
    setResults([`Product 1 in ${category}`, `Product 2 in ${category}`]);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Product by Category
      </Typography>
      <TextField
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
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

export default SearchByCategory;