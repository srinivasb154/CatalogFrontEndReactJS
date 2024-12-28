import { useState, useEffect } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  MenuItem,
} from '@mui/material'
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import API_ENDPOINTS from '../../config/apiConfig'

const CreateProducts = () => {
  const [productName, setProductName] = useState('')
  const [sku, setSku] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [longDescription, setLongDescription] = useState(
    EditorState.createEmpty(),
  )
  const [shippingNotes, setShippingNotes] = useState('')
  const [warrantyInfo, setWarrantyInfo] = useState('')
  const [visibleToFrontEnd, setVisibleToFrontEnd] = useState(false)
  const [featuredProduct, setFeaturedProduct] = useState(false)
  const [brandId, setBrandId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        const [categoryResponse, brandResponse] = await Promise.all([
          fetch(API_ENDPOINTS.getCategories),
          fetch(API_ENDPOINTS.getBrands),
        ])

        if (brandResponse.ok && categoryResponse.ok) {
          const categoryData = await categoryResponse.json()
          const brandData = await brandResponse.json()

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
        console.error('Error fetching categories and brands:', error)
        alert('An unexpected error occurred.')
      }
    }

    fetchBrandsAndCategories()
  }, [])

  const handleEditorChange = (editorState) => {
    setLongDescription(editorState)
  }

  const handleSubmit = async () => {
    const productData = {
      productName,
      sku,
      shortDescription,
      longDescription: longDescription.getCurrentContent().getPlainText(),
      shippingNotes,
      warrantyInfo,
      visibleToFrontEnd,
      featuredProduct,
      brandId,
      categoryId,
    }

    try {
      const response = await fetch(API_ENDPOINTS.postProducts, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Product created successfully:', result)
        alert('Product created successfully!')
      } else {
        console.error('Error creating product:', response.statusText)
        alert('Failed to create product. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An unexpected error occurred. Please try again later.')
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        Create New Product
      </Typography>
      <TextField
        placeholder="product-name"
        label='Product Name'
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        fullWidth
        margin='normal'
        required
      />
      <TextField
        placeholder="sku"
        label='SKU'
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        fullWidth
        margin='normal'
      />
      <TextField
        placeholder="short-description"
        label='Short Description'
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
        fullWidth
        margin='normal'
      />
      <Typography variant='h6' gutterBottom>
        Long Description
      </Typography>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '16px',
        }}
      >
        <Editor
          editorState={longDescription}
          onEditorStateChange={handleEditorChange}
          toolbar={{
            options: [
              'inline',
              'blockType',
              'list',
              'textAlign',
              'link',
              'history',
            ],
          }}
        />
      </div>
      <TextField
        placeholder="shipping-notes"
        label='Shipping Notes'
        value={shippingNotes}
        onChange={(e) => setShippingNotes(e.target.value)}
        fullWidth
        margin='normal'
      />
      <TextField
        placeholder="warranty-info"
        label='Warranty Information'
        value={warrantyInfo}
        onChange={(e) => setWarrantyInfo(e.target.value)}
        fullWidth
        margin='normal'
      />
      <FormControlLabel
        control={
          <Switch
            checked={visibleToFrontEnd}
            onChange={(e) => setVisibleToFrontEnd(e.target.checked)}
          />
        }
        label='Visible to Front End'
      />
      <FormControlLabel
        control={
          <Switch
            checked={featuredProduct}
            onChange={(e) => setFeaturedProduct(e.target.checked)}
          />
        }
        label='Featured Product'
      />
      <TextField
        placeholder="category"
        label='Category'
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        fullWidth
        margin='normal'
        select
      >
        {categories.map((category) => (
          <MenuItem key={category._id} value={category._id}>
            {category.categoryName}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        placeholder="brand"
        label='Brand'
        value={brandId}
        onChange={(e) => setBrandId(e.target.value)}
        fullWidth
        margin='normal'
        select
      >
        {brands.map((brand) => (
          <MenuItem key={brand._id} value={brand._id}>
            {brand.brandName}
          </MenuItem>
        ))}
      </TextField>
      <Button
        placeholder="submit"
        variant='contained'
        color='primary'
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Submit
      </Button>
    </Container>
  )
}

export default CreateProducts
