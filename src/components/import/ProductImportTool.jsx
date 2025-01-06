import { useState } from 'react'
import {
  Container,
  Typography,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import API_ENDPOINTS from '../../config/apiConfig'

const ProductImportTool = () => {
  const [file, setFile] = useState(null)
  const [mode, setMode] = useState('add')
  const [message, setMessage] = useState('')

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleModeChange = (event) => {
    setMode(event.target.value)
  }

  const handleImport = async () => {
    if (!file) {
      setMessage('Please select a file.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('mode', mode)

    try {
      const response = await fetch(API_ENDPOINTS.importProducts, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        setMessage(result.message)
      } else {
        setMessage(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error importing products:', error)
      setMessage('An unexpected error occurred.')
    }
  }

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Product Import Tool
      </Typography>
      <RadioGroup value={mode} onChange={handleModeChange} row>
        <FormControlLabel value='add' control={<Radio />} label='Add' />
        <FormControlLabel value='replace' control={<Radio />} label='Replace' />
      </RadioGroup>
      <TextField
        type='file'
        fullWidth
        margin='normal'
        onChange={handleFileChange}
      />
      <Button variant='contained' onClick={handleImport}>
        Import Products
      </Button>
      {message && (
        <Typography color='primary' variant='subtitle1' sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Container>
  )
}

export default ProductImportTool
