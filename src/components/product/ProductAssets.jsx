import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { Buffer } from 'buffer' // Import Buffer from the buffer package

const ProductAssets = () => {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [assets, setAssets] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch('http://localhost:3000/api/categories'),
          fetch('http://localhost:3000/api/brands'),
        ])

        setCategories(await categoriesRes.json())
        setBrands(await brandsRes.json())
      } catch (error) {
        console.error('Error fetching categories or brands:', error)
      }
    }

    fetchDropdownData()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products?category=${selectedCategory}&brand=${selectedBrand}`,
      )
      setProducts(await response.json())
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchAssets = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${selectedProduct}/assets`,
      )
      if (response.ok) {
        const data = await response.json()
        setAssets(data)
      } else if (response.status === 404) {
        // Handle 404 gracefully by setting assets to an empty array
        setAssets([])
      } else {
        // Handle other non-404 errors
        const errorText = await response.text()
        throw new Error(errorText || 'An error occurred while fetching assets.')
      }
    } catch (err) {
      console.error('Error fetching assets:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Product Assets
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
              {category.name}
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
              {brand.name}
            </MenuItem>
          ))}
        </TextField>
        <Button variant='contained' onClick={fetchProducts}>
          Fetch Products
        </Button>
      </Box>
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
      <Button variant='contained' onClick={fetchAssets} sx={{ mt: 2 }}>
        Fetch Assets
      </Button>
      <Typography variant='h5' gutterBottom sx={{ mt: 4 }}>
        Assets
      </Typography>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color='error'>Error: {error}</Typography>
      ) : assets.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Asset ID</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Extension</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset._id}>
                  <TableCell>
                    {asset.type === 'Image' && (
                      <img
                        src={`data:image/${
                          asset.extension
                        };base64,${Buffer.from(asset.binaryData).toString(
                          'base64',
                        )}`}
                        alt={asset.fileName}
                        style={{ width: '100px', height: 'auto' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{asset.productAssetId}</TableCell>
                  <TableCell>{asset.fileName}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>{asset.extension}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No assets available for this product.</Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant='contained' onClick={fetchAssets}>
          Refresh
        </Button>
      </Box>
    </Container>
  )
}

export default ProductAssets
