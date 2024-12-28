import { useState } from 'react'
import {
  Container,
  Typography,
  List,
  ListItem,
  Link,
  Button,
} from '@mui/material'
import CreateProducts from './product/CreateProducts'
import ProductSearch from './product/ProductSearch'
import AddProductReview from './product/AddProductReview'
import AddProductAssets from './product/AddProductAssets'
import ProductAssets from './product/ProductAssets'
import ProductImportTool from './import/ProductImportTool'

const ProductScreen = () => {
  const [currentProductScreen, setCurrentProductScreen] = useState('options')

  const handleProductScreenNavigation = (screen) => {
    console.log(`Navigating within ProductScreen to: ${screen}`)
    setCurrentProductScreen(screen)
  }

  return (
    <Container sx={{ mt: 4 }}>
      {currentProductScreen === 'options' && (
        <>
          <Typography variant='h4' gutterBottom>
            Product Options
          </Typography>
          <List>
            <ListItem>
              <Link
                href='#'
                onClick={() => handleProductScreenNavigation('createProduct')}
                underline='hover'
              >
                Create New Product
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href='#'
                onClick={() => handleProductScreenNavigation('searchProduct')}
                underline='hover'
              >
                Search Product
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href='#'
                onClick={() =>
                  handleProductScreenNavigation('addProductReviews')
                }
                underline='hover'
              >
                Add Product Reviews
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href='#'
                onClick={() =>
                  handleProductScreenNavigation('addProductAssets')
                }
                underline='hover'
              >
                Add Product Assets
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href='#'
                onClick={() =>
                  handleProductScreenNavigation('getProductAssets')
                }
                underline='hover'
              >
                Product Assets
              </Link>
            </ListItem>
            <ListItem>
              <Link
                href='#'
                onClick={() => handleProductScreenNavigation('importProducts')}
                underline='hover'
              >
                Import Products
              </Link>
            </ListItem>
          </List>
        </>
      )}

      {currentProductScreen === 'createProduct' && (
        <>
          <Button
            onClick={() => handleProductScreenNavigation('options')}
            sx={{ mb: 2 }}
          >
            Back to Product Options
          </Button>
          <CreateProducts />
        </>
      )}

      {currentProductScreen === 'searchProduct' && (
        <>
          <Button
            onClick={() => handleProductScreenNavigation('options')}
            sx={{ mb: 2 }}
          >
            Back to Options
          </Button>
          <ProductSearch />
        </>
      )}

      {currentProductScreen === 'addProductReviews' && (
        <>
          <Button
            onClick={() => handleProductScreenNavigation('options')}
            sx={{ mb: 2 }}
          >
            Back to Options
          </Button>
          <AddProductReview />
        </>
      )}

      {currentProductScreen === 'addProductAssets' && (
        <>
          <Button
            onClick={() => handleProductScreenNavigation('options')}
            sx={{ mb: 2 }}
          >
            Back to Options
          </Button>
          <AddProductAssets />
        </>
      )}

      {currentProductScreen === 'getProductAssets' && (
        <>
          <Button
            onClick={() => handleProductScreenNavigation('options')}
            sx={{ mb: 2 }}
          >
            Back to Options
          </Button>
          <ProductAssets />
        </>
      )}

      {currentProductScreen === 'importProducts' && (
        <>
          <Button
            onClick={() => handleProductScreenNavigation('options')}
            sx={{ mb: 2 }}
          >
            Back to Options
          </Button>
          <ProductImportTool />
        </>
      )}
    </Container>
  )
}

export default ProductScreen
