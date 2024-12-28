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
import CategoryDetails from './CategoryDetails'
import CreateCategory from './CreateCategory'

const CategorySearch = () => {
  const [categoryName, setCategoryName] = useState('')
  const [parentCategory, setParentCategory] = useState('')
  const [results, setResults] = useState([])
  const [page, setPage] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [createMode, setCreateMode] = useState(false)
  const rowsPerPage = 10

  const handleSearch = async () => {
    const searchCriteria = {}
    if (categoryName) searchCriteria.categoryName = categoryName
    if (parentCategory) searchCriteria.parentCategory = parentCategory

    try {
      const response = await fetch(
        'http://localhost:3000/api/categories/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchCriteria),
        },
      )

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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
  }

  const handleCreateCategory = () => {
    setCreateMode(true)
  }

  return (
    <Container sx={{ mt: 4 }}>
      {createMode ? (
        <CreateCategory onBack={() => setCreateMode(false)} />
      ) : selectedCategory ? (
        <CategoryDetails
          category={selectedCategory}
          onBack={() => setSelectedCategory(null)}
        />
      ) : (
        <>
          <Typography variant='h4' gutterBottom>
            Search Category
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              data-testid='category-name'
              label='Category Name'
              variant='outlined'
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <TextField
              data-testid='parent-category'
              label='Parent Category'
              variant='outlined'
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Button
              data-testid='search-button'
              variant='contained'
              color='primary'
              onClick={handleSearch}
            >
              Search
            </Button>
            <Button
              variant='contained'
              color='secondary'
              onClick={handleCreateCategory}
            >
              Create Category
            </Button>
          </Box>

          {results.length > 0 && (
            <Container sx={{ mt: 4 }}>
              <Typography variant='h5' gutterBottom>
                Search Results:
              </Typography>
              <TableContainer data-testid='category-table' component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category Name</TableCell>
                      <TableCell>Parent Category</TableCell>
                      <TableCell>Description</TableCell>
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
                              onClick={() => handleCategoryClick(result)}
                            >
                              {result.categoryName}
                            </Link>
                          </TableCell>
                          <TableCell>{result.parentCategory}</TableCell>
                          <TableCell>{result.description}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                data-testid='pagination'
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

export default CategorySearch
