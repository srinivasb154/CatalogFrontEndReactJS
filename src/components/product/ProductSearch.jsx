import { useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Link,
} from '@mui/material'
import ProductTab from './ProductTab'
import API_ENDPOINTS from '../../config/apiConfig'

const ProductSearch = () => {
  const [productName, setProductName] = useState('')
  const [sku, setSku] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [results, setResults] = useState([])
  const [page, setPage] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedProductReviews, setSelectedProductReviews] = useState([])
  const rowsPerPage = 5

  const getProductReviews = async (prodId) => {
    const reviewsResponse = await fetch(
      API_ENDPOINTS.getReviewsByProductId(prodId),
    )
    const reviewsData = await reviewsResponse.json()
    console.log('reviewsData')
    console.log(reviewsData)
    setSelectedProductReviews(reviewsData)
  }

  const handleSearch = async () => {
    const searchCriteria = {}
    if (productName) searchCriteria.productName = productName
    if (sku) searchCriteria.sku = sku
    if (category) searchCriteria.category = category
    if (brand) searchCriteria.brand = brand

    try {
      const searchProd = API_ENDPOINTS.searchProducts;
      console.log(searchProd);
      const response = await fetch(API_ENDPOINTS.searchProducts, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchCriteria),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
        console.log('Search Results:', data)
      } else {
        console.error('Error fetching search results:', response.statusText)
        alert('Failed to fetch search results. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An unexpected error occurred. Please try again later.')
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    getProductReviews(product._id)
  }

  return (
    <Container sx={{ mt: 4 }}>
      {selectedProduct ? (
        <ProductTab
          product={selectedProduct}
          reviews={selectedProductReviews}
          onBack={() => setSelectedProduct(null)}
        />
      ) : (
        <>
          <Typography variant='h4' gutterBottom>
            Search Product
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              label='Product Name'
              variant='outlined'
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <TextField
              label='SKU'
              variant='outlined'
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <TextField
              label='Category'
              variant='outlined'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <TextField
              label='Brand'
              variant='outlined'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Box>
          <Button
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
            onClick={handleSearch}
          >
            Search
          </Button>

          {results.length > 0 && (
            <Container sx={{ mt: 4 }}>
              <Typography variant='h5' gutterBottom>
                Search Results:
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Short Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Link
                              href='#'
                              onClick={() => handleProductClick(result)}
                              underline='hover'
                            >
                              {result.productName}
                            </Link>
                          </TableCell>
                          <TableCell>{result.sku}</TableCell>
                          <TableCell>{result.shortDescription}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component='div'
                count={results.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[rowsPerPage]}
              />
            </Container>
          )}
        </>
      )}
    </Container>
  )
}

export default ProductSearch
