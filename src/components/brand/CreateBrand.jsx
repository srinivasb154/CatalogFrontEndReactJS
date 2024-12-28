import { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';

// eslint-disable-next-line react/prop-types
const CreateBrand = ({ onBack }) => {
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [assets, setAssets] = useState('');

  const handleSubmit = async () => {
    const newBrand = { brandName, description, assets };
    try {
      const response = await fetch('http://localhost:3000/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBrand),
      });

      if (response.ok) {
        alert('Brand created successfully!');
        onBack();
      } else {
        alert('Failed to create brand. Please try again.');
      }
    } catch (error) {
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button onClick={onBack} variant="contained" color="secondary" sx={{ mb: 2 }}>
        Back to Search
      </Button>
      <Typography variant="h4" gutterBottom>
        Create Brand
      </Typography>
      <TextField
        label="Brand Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
      />
      <TextField
        label="Assets"
        variant="outlined"
        fullWidth
        margin="normal"
        value={assets}
        onChange={(e) => setAssets(e.target.value)}
      />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
        Submit
      </Button>
    </Container>
  );
};

export default CreateBrand;