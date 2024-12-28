import { useState } from 'react'
import { Container, TextField, Button, Typography } from '@mui/material'

// eslint-disable-next-line react/prop-types
const CreateCategory = ({ onBack }) => {
  const [categoryName, setCategoryName] = useState('')
  const [parentCategory, setParentCategory] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async () => {
    const newCategory = { categoryName, parentCategory, description }
    try {
      const response = await fetch('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      })

      if (response.ok) {
        alert('Category created successfully!')
        onBack()
      } else {
        alert('Failed to create category. Please try again.')
      }
    } catch (error) {
      alert('An unexpected error occurred. Please try again later.')
    }
  }

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
        Create Category
      </Typography>
      <TextField
        label='Category Name'
        variant='outlined'
        fullWidth
        margin='normal'
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <TextField
        label='Parent Category'
        variant='outlined'
        fullWidth
        margin='normal'
        value={parentCategory}
        onChange={(e) => setParentCategory(e.target.value)}
      />
      <TextField
        label='Description'
        variant='outlined'
        fullWidth
        margin='normal'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
      />
      <Button
        variant='contained'
        color='primary'
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Container>
  )
}

export default CreateCategory
