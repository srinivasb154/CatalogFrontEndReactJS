/* eslint-disable react/prop-types */
import { Container, Typography, Button } from '@mui/material'

const CategoryDetails = ({ category, onBack }) => {
  return (
    <Container sx={{ mt: 4 }}>
      <Button
        onClick={onBack}
        variant='contained'
        color='secondary'
        sx={{ mb: 2 }}
      >
        Back to Search
      </Button>
      <Typography variant='h4' gutterBottom>
        Category Details
      </Typography>
      <Typography variant='body1'>
        <strong>Category Name:</strong> {category.categoryName}
      </Typography>
      <Typography variant='body1'>
        <strong>Parent Category:</strong> {category.parentCategory}
      </Typography>
      <Typography variant='body1'>
        <strong>Description:</strong> {category.description}
      </Typography>
    </Container>
  )
}

export default CategoryDetails
