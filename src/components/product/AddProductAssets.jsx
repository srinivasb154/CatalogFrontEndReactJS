// React Component for Product Assets Management
import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import API_ENDPOINTS from '../../config/apiConfig'

const AddProductAssets = () => {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [assets, setAssets] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [fileData, setFileData] = useState([]) // Store binary file data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch(API_ENDPOINTS.getCategories),
          fetch(API_ENDPOINTS.getBrands),
        ])
        setCategories(await categoriesRes.json())
        setBrands(await brandsRes.json())
      } catch (error) {
        console.error('Error fetching categories or brands:', error)
      }
    }

    fetchData()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        API_ENDPOINTS.getProductsByCategoryAnsBrand(
          selectedCategory,
          selectedBrand,
        ),
      )
      setProducts(await response.json())
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setSelectedFiles([])
  }

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files)
    setSelectedFiles(files)

    const fileDataPromises = files.map(async (file) => {
      const binaryData = await file.arrayBuffer()
      return {
        fileName: file.name,
        binaryData,
      }
    })

    const resolvedFileData = await Promise.all(fileDataPromises)
    setFileData(resolvedFileData)
  }

  const handleOk = () => {
    const newAssets = selectedFiles.map((file, index) => {
      const extension = file.name.split('.').pop()
      let type = 'Other'
      if (file.type.includes('image')) type = 'Image'
      else if (file.type.includes('video')) type = 'Video'
      else if (
        ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)
      )
        type = 'Document'

      return {
        productAssetId: assets.length + index + 1,
        fileName: file.name,
        type,
        extension,
      }
    })

    newAssets.map((element) => {
      setAssets((prevArray) => [...prevArray, element])
    })

    handleClose()
  }

  const saveAssets = async () => {
    if (!selectedProduct) {
      alert('Please select a product to save assets.')
      return
    }

    try {
      // Create a FormData object
      const formData = new FormData()

      // Add productId to the FormData
      formData.append('productId', selectedProduct)

      // Add assets array to the FormData as a JSON string
      formData.append('assets', JSON.stringify(assets))

      // Add files to the FormData
      // eslint-disable-next-line no-unused-vars
      fileData.forEach((file, index) => {
        formData.append(`files`, new Blob([file.binaryData]), file.fileName)
      })

      // Send FormData to the API
      const response = await fetch(
        API_ENDPOINTS.getAssetsByProductId(selectedProduct),
        {
          method: 'POST',
          body: formData,
        },
      )

      if (response.ok) {
        alert('Assets saved successfully!')
      } else {
        const errorResponse = await response.json()
        alert(`Failed to save assets: ${errorResponse.error}`)
      }
    } catch (error) {
      console.error('Error saving assets:', error)
      alert('An unexpected error occurred while saving assets.')
    }
  }

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Add Product Assets
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
      <Typography variant='h5' gutterBottom sx={{ mt: 4 }}>
        Uploaded Assets
      </Typography>
      {assets.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset ID</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Extension</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.productAssetId}>
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
        <Typography>No assets uploaded yet.</Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant='contained' onClick={handleOpen}>
          Upload Asset
        </Button>
        <Button variant='contained' color='primary' onClick={saveAssets}>
          Save Assets
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle>Upload Asset</DialogTitle>
        <DialogContent>
          <input type='file' multiple onChange={handleFileSelect} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOk}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AddProductAssets
