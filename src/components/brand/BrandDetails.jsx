/* eslint-disable react/prop-types */
import { Container, Typography, Button } from '@mui/material';

const BrandDetails = ({ brand, onBack }) => {
  return (
    <Container sx={{ mt: 4 }}>
      <Button onClick={onBack} variant="contained" color="secondary" sx={{ mb: 2 }}>
        Back to Search
      </Button>
      <Typography variant="h4" gutterBottom>
        Brand Details
      </Typography>
      <Typography variant="body1"><strong>Brand Name:</strong> {brand.brandName}</Typography>
      <Typography variant="body1"><strong>Description:</strong> {brand.description}</Typography>
      <Typography variant="body1"><strong>Assets:</strong> {brand.assets}</Typography>
    </Container>
  );
};

export default BrandDetails;
