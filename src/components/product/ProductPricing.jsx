import { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import API_ENDPOINTS from '../../config/apiConfig'

// eslint-disable-next-line react/prop-types
const ProductPricing = ({ productId }) => {
  const [pricing, setPricing] = useState([])
  const [open, setOpen] = useState(false)
  const [editPricing, setEditPricing] = useState(null)

  const fetchPricing = async () => {
    try {
      const response = await fetch(
        API_ENDPOINTS.getPricingByProductId(productId),
      )
      if (response.ok) {
        const data = await response.json()
        setPricing(data)
      } else if (response.status === 404) {
        setPricing([]) // No pricing found
      } else {
        console.error('Error fetching pricing:', await response.text())
      }
    } catch (error) {
      console.error('Unexpected error fetching pricing:', error)
    }
  }

  const handleOpenDialog = (pricingItem = null) => {
    setEditPricing(
      pricingItem || {
        msrp: '',
        map: '',
        cost: '',
        sell: '',
        base: '',
        startDate: '',
        endDate: '',
      },
    )
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setEditPricing(null)
  }

  const handleSave = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.upsertPricing, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editPricing, productId, createdBy: 'Admin' }),
      })
      if (response.ok) {
        fetchPricing() // Refresh pricing list
        handleCloseDialog()
      } else {
        console.error('Error saving pricing:', await response.json())
      }
    } catch (error) {
      console.error('Error saving pricing:', error)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchPricing()
    }
  }, [productId])

  return (
    <Container>
      <Typography variant='h5' gutterBottom>
        Product Pricing
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>MSRP</TableCell>
              <TableCell>MAP</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Sell</TableCell>
              <TableCell>Base</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pricing.length > 0 ? (
              pricing.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.msrp}</TableCell>
                  <TableCell>{item.map}</TableCell>
                  <TableCell>{item.cost}</TableCell>
                  <TableCell>{item.sell}</TableCell>
                  <TableCell>{item.base}</TableCell>
                  <TableCell>
                    {new Date(item.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {item.endDate
                      ? new Date(item.endDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='outlined'
                      onClick={() => handleOpenDialog(item)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align='center'>
                  No pricing data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant='contained'
        sx={{ mt: 2 }}
        onClick={() => handleOpenDialog()}
      >
        Add Pricing
      </Button>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>
          {editPricing?._id ? 'Update Pricing' : 'Add Pricing'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label='MSRP'
            type='number'
            fullWidth
            margin='normal'
            value={editPricing?.msrp || ''}
            onChange={(e) =>
              setEditPricing({
                ...editPricing,
                msrp: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            label='MAP'
            type='number'
            fullWidth
            margin='normal'
            value={editPricing?.map || ''}
            onChange={(e) =>
              setEditPricing({
                ...editPricing,
                map: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            label='Cost'
            type='number'
            fullWidth
            margin='normal'
            value={editPricing?.cost || ''}
            onChange={(e) =>
              setEditPricing({
                ...editPricing,
                cost: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            label='Sell'
            type='number'
            fullWidth
            margin='normal'
            value={editPricing?.sell || ''}
            onChange={(e) =>
              setEditPricing({
                ...editPricing,
                sell: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            label='Base'
            type='number'
            fullWidth
            margin='normal'
            value={editPricing?.base || ''}
            onChange={(e) =>
              setEditPricing({
                ...editPricing,
                base: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            label='Start Date'
            type='date'
            fullWidth
            margin='normal'
            value={editPricing?.startDate || ''}
            onChange={(e) =>
              setEditPricing({ ...editPricing, startDate: e.target.value })
            }
          />
          <TextField
            label='End Date'
            type='date'
            fullWidth
            margin='normal'
            value={editPricing?.endDate || ''}
            onChange={(e) =>
              setEditPricing({ ...editPricing, endDate: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant='contained'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ProductPricing
