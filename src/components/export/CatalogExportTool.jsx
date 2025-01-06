import { useState } from 'react'
import { Container, Typography, Button, TextField } from '@mui/material'
import API_ENDPOINTS from '../../config/apiConfig'

const CatalogExportTool = () => {
  const [fileName, setFileName] = useState('')
  const [message, setMessage] = useState('')
  const [isExportEnabled, setIsExportEnabled] = useState(false)

  const handleFileNameChange = (event) => {
    setFileName(event.target.value)
    setIsExportEnabled(event.target.value.trim() !== '')
  }

  const flattenData = (data) => {
    const flattened = []
    Object.keys(data).forEach((section) => {
      data[section].forEach((item) => {
        flattened.push({ section, ...item })
      })
    })
    return flattened
  }

  const convertToCSV = (data) => {
    if (!Array.isArray(data) || data.length === 0) return ''
    const headers = Object.keys(data[0])
    const rows = data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || '')).join(','),
    )
    return [headers.join(','), ...rows].join('\n')
  }

  const handleExport = async () => {
    if (!fileName.trim()) {
      setMessage('Please provide a file name.')
      return
    }

    try {
      const response = await fetch(API_ENDPOINTS.exportData, {
        method: 'GET',
      })

      if (response.ok) {
        const contentType = response.headers.get('Content-Type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()

          if (data && typeof data === 'object') {
            const flattenedData = flattenData(data)
            const csvData = convertToCSV(flattenedData)
            const blob = new Blob([csvData], {
              type: 'text/csv;charset=utf-8;',
            })

            const downloadLink = document.createElement('a')
            downloadLink.href = URL.createObjectURL(blob)
            downloadLink.download = `${fileName.trim()}.csv`
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)

            setMessage(`File saved as ${fileName.trim()}.csv`)
          } else {
            setMessage('Invalid data format received from the server.')
          }
        } else {
          const text = await response.text() // Log non-JSON response for debugging
          console.error('Unexpected Response:', text)
          setMessage('Unexpected response from server.')
        }
      } else {
        const errorText = await response.text()
        console.error('Error Response:', errorText)
        setMessage(`Failed to export data: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Export Error:', error)
      setMessage('An unexpected error occurred.')
    }
  }

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Catalog Export Tool
      </Typography>
      <TextField
        label='File Name (without extension)'
        fullWidth
        margin='normal'
        onChange={handleFileNameChange}
      />
      <Button
        variant='contained'
        color='primary'
        onClick={handleExport}
        disabled={!isExportEnabled}
        sx={{ mt: 2 }}
      >
        Export Catalog Data
      </Button>
      {message && (
        <Typography color='primary' variant='subtitle1' sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Container>
  )
}

export default CatalogExportTool
