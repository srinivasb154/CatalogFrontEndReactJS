/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import {
  Tabs,
  Tab,
  Button,
  Box,
  Typography,
  AppBar,
  Container,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material'
import ProductInventoryTab from './ProductInventoryTab'
import ProductPricing from './ProductPricing'

// TabPanel Component
function TabPanel(props) {
  // eslint-disable-next-line react/prop-types
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

// Main Product Details Component
// eslint-disable-next-line react/prop-types
export default function ProductTab({ product, reviews, onBack }) {
  const [value, setValue] = useState(0)
  const [productData, setProductData] = useState(null)
  const [reviewsData, setReviewsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [productId, setProductId] = useState('')

  // Set productData when initialProduct is provided
  useEffect(() => {
    if (product) {
      setProductData(product)
      setLoading(false)
      setReviewsData(reviews)
    }
  }, [product])

  // Synchronize productId with productData
  useEffect(() => {
    if (productData && productData._id) {
      setProductId(productData._id) // Extract productId from productData
    }
    console.log(productId)
  }, [productData])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (!productData) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant='h6' color='error'>
            Failed to load product details. Please try again later.
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      <Button
        onClick={onBack}
        variant='contained'
        color='secondary'
        sx={{ mb: 2 }}
      >
        Back to Product Search
      </Button>
      <Box sx={{ width: '100%', mt: 4 }}>
        <AppBar position='static' color='default'>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor='primary'
            textColor='primary'
            variant='fullWidth'
            aria-label='product details tabs'
          >
            <Tab label='Description' {...a11yProps(0)} />
            <Tab label='Specifications' {...a11yProps(1)} />
            <Tab label='Reviews' {...a11yProps(2)} />
            <Tab label='Inventory' {...a11yProps(3)} />
            <Tab label='Pricing' {...a11yProps(4)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Typography variant='h6'>Product Name</Typography>
          <Typography>{productData.productName}</Typography>
          <Typography variant='h6'>SKU</Typography>
          <Typography>{productData.sku}</Typography>
          <Typography variant='h6'>Short Description</Typography>
          <Typography>{productData.shortDescription}</Typography>
          <Typography variant='h6'>Long Description</Typography>
          <Typography>{productData.longDescription}</Typography>
          <Typography variant='h6'>Shipping Notes</Typography>
          <Typography>{productData.shippingNotes}</Typography>
          <Typography variant='h6'>Warranty Info</Typography>
          <Typography>{productData.warrantyInfo}</Typography>
          <Typography variant='h6'>Brand</Typography>
          <Typography>{productData.brandId}</Typography>
          <Typography variant='h6'>Category</Typography>
          <Typography>{productData.categoryId}</Typography>
          <Typography variant='h6'>Visible To FrontEnd</Typography>
          <Typography>{productData.visibleToFrontEnd}</Typography>
          <Typography variant='h6'>Featured Product</Typography>
          <Typography>{productData.featuredProduct}</Typography>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant='h6'>Specifications</Typography>
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant='h5' gutterBottom>
                  Specifications
                </Typography>
                {Object.entries(product.specifications).map(
                  ([key, value]) =>
                    key !== '_id' &&
                    (typeof value === 'object'
                      ? Object.entries(value).map(
                          ([subKey, subValue]) =>
                            subKey !== '_id' &&
                            subValue && (
                              <Typography
                                key={`${key}-${subKey}`}
                                variant='body1'
                              >
                                <strong>
                                  {subKey.charAt(0).toUpperCase() +
                                    subKey.slice(1)}
                                  :
                                </strong>{' '}
                                {subValue}
                              </Typography>
                            ),
                        )
                      : value && (
                          <Typography key={key} variant='body1'>
                            <strong>
                              {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </strong>{' '}
                            {value}
                          </Typography>
                        )),
                )}
              </Box>
            )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Typography variant='h6'>Reviews</Typography>
          {reviewsData.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviewsData.map((review) => (
                    <TableRow key={review._id}>
                      <TableCell>{review.user}</TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>{review.rating}</TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No reviews available for this product.</Typography>
          )}
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Typography variant='h6'>Inventory</Typography>
          <ProductInventoryTab productId={productId} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Typography variant='h6'>Pricing</Typography>
          <ProductPricing productId={productId} />
        </TabPanel>
      </Box>
    </Container>
  )
}
