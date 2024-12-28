// React Component for Adding Product Reviews
import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material'
import API_ENDPOINTS from '../../config/apiConfig'

const AddProductReview = () => {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [reviews, setReviews] = useState([
    { user: '', comment: '', rating: '' },
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch(API_ENDPOINTS.getCategories),
          fetch(API_ENDPOINTS.getBrands),
        ])

        if (categoriesRes.ok && brandsRes.ok) {
          const categoryData = await categoriesRes.json()
          const brandData = await brandsRes.json()

          setCategories(
            categoryData.sort((a, b) =>
              a.categoryName.localeCompare(b.categoryName),
            ),
          )
          setBrands(
            brandData.sort((a, b) => a.brandName.localeCompare(b.brandName)),
          )
        } else {
          alert('Failed to fetch categories or brands.')
        }
      } catch (error) {
        console.error('Error fetching categories or brands:', error)
      }
    }

    fetchData()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        API_ENDPOINTS.getProductsByCategoryAnsBrand(
          selectedCategory,
          selectedBrand,
        ),
      )
      setProducts(await response.json())
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewChange = (index, field, value) => {
    const updatedReviews = [...reviews]
    updatedReviews[index][field] = value
    setReviews(updatedReviews)
  }

  const addReview = () => {
    setReviews([...reviews, { user: '', comment: '', rating: '' }])
  }

  const removeReview = (index) => {
    setReviews(reviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        API_ENDPOINTS.getReviewsByProductId(selectedProduct),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviews }),
        },
      )
      if (response.ok) {
        alert('Reviews added successfully!')
      } else {
        alert('Failed to add reviews.')
      }
    } catch (error) {
      console.error('Error adding reviews:', error)
    }
  }

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Add Product Reviews
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label='Category'
          select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          fullWidth
          margin='normal'
        >
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.categoryName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label='Brand'
          select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          fullWidth
          margin='normal'
        >
          {brands.map((brand) => (
            <MenuItem key={brand._id} value={brand._id}>
              {brand.brandName}
            </MenuItem>
          ))}
        </TextField>
        <Button variant='contained' onClick={fetchProducts}>
          Fetch Products
        </Button>
      </Box>
      {loading && <CircularProgress />}
      <TextField
        label='Product'
        select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        fullWidth
        margin='normal'
      >
        {products.map((product) => (
          <MenuItem key={product._id} value={product._id}>
            {product.productName}
          </MenuItem>
        ))}
      </TextField>

      <Typography variant='h5' gutterBottom sx={{ mt: 4 }}>
        Reviews
      </Typography>
      {reviews.map((review, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label='User'
            value={review.user}
            onChange={(e) => handleReviewChange(index, 'user', e.target.value)}
            fullWidth
          />
          <TextField
            label='Comment'
            value={review.comment}
            onChange={(e) =>
              handleReviewChange(index, 'comment', e.target.value)
            }
            fullWidth
          />
          <TextField
            label='Rating'
            type='number'
            value={review.rating}
            onChange={(e) =>
              handleReviewChange(index, 'rating', e.target.value)
            }
            fullWidth
          />
          <Button
            variant='outlined'
            color='error'
            onClick={() => removeReview(index)}
          >
            Remove
          </Button>
        </Box>
      ))}
      <Button variant='contained' onClick={addReview} sx={{ mb: 2 }}>
        Add Review
      </Button>
      <Button variant='contained' color='primary' onClick={handleSubmit}>
        Submit Reviews
      </Button>
    </Container>
  )
}

export default AddProductReview
