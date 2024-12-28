import { useState, useEffect } from 'react'
import {
  Container,
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
const ProductInventoryTab = ({ productId }) => {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [editInventory, setEditInventory] = useState(null)

  const fetchInventory = async () => {
    try {
      const response = await fetch(
        API_ENDPOINTS.getInventoryByProductId(productId),
      )
      if (response.ok) {
        const data = await response.json()
        setInventory(data)
      } else if (response.status === 404) {
        // No inventory found, set to an empty array
        setInventory([])
      } else {
        console.error('Error fetching inventory:', await response.text())
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    }
  }

  const handleOpenDialog = (inventoryItem = null) => {
    setEditInventory(
      inventoryItem || {
        bin: '',
        location: '',
        source: '',
        onHand: 0,
        onHold: 0,
      },
    )
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setEditInventory(null)
  }

  const handleSave = async () => {
    try {
      if (!productId) {
        alert('Product ID is missing.')
        return
      }

      const updatedInventory = { ...editInventory, productId } // Ensure productId is included

      const response = await fetch(API_ENDPOINTS.upsertInventory, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInventory), // Pass the updated object
      })
      if (response.ok) {
        fetchInventory()
        handleCloseDialog()
      } else {
        console.error('Error saving inventory:', await response.json())
      }
    } catch (error) {
      console.error('Error saving inventory:', error)
    }
  }

  useEffect(() => {
    console.log('Product ID:', productId) // Ensure productId is being passed correctly
    if (productId) {
      fetchInventory()
    }
  }, [productId])

  return (
    <Container>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bin</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>On Hand</TableCell>
              <TableCell>On Hold</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={`${item.bin}-${item.location}`}>
                <TableCell>{item.bin}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.source}</TableCell>
                <TableCell>{item.onHand}</TableCell>
                <TableCell>{item.onHold}</TableCell>
                <TableCell>
                  <Button
                    variant='outlined'
                    onClick={() => handleOpenDialog(item)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant='contained'
        sx={{ mt: 2 }}
        onClick={() => handleOpenDialog()}
      >
        Add New Inventory
      </Button>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>
          {editInventory?._id ? 'Update Inventory' : 'Add Inventory'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label='Bin'
            fullWidth
            margin='normal'
            value={editInventory?.bin || ''}
            onChange={(e) =>
              setEditInventory({ ...editInventory, bin: e.target.value })
            }
          />
          <TextField
            label='Location'
            fullWidth
            margin='normal'
            value={editInventory?.location || ''}
            onChange={(e) =>
              setEditInventory({ ...editInventory, location: e.target.value })
            }
          />
          <TextField
            label='Source'
            fullWidth
            margin='normal'
            value={editInventory?.source || ''}
            onChange={(e) =>
              setEditInventory({ ...editInventory, source: e.target.value })
            }
          />
          <TextField
            label='On Hand'
            type='number'
            fullWidth
            margin='normal'
            value={editInventory?.onHand || 0}
            onChange={(e) =>
              setEditInventory({
                ...editInventory,
                onHand: parseInt(e.target.value, 10),
              })
            }
          />
          <TextField
            label='On Hold'
            type='number'
            fullWidth
            margin='normal'
            value={editInventory?.onHold || 0}
            onChange={(e) =>
              setEditInventory({
                ...editInventory,
                onHold: parseInt(e.target.value, 10),
              })
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

export default ProductInventoryTab
