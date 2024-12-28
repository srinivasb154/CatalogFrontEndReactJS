import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Link } from '@mui/material';
import BrandDetails from './BrandDetails';
import CreateBrand from './CreateBrand';

const BrandSearch = () => {
  const [brandName, setBrandName] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [createMode, setCreateMode] = useState(false);
  const rowsPerPage = 10;

  const handleSearch = async () => {
    const searchCriteria = {};
    if (brandName) searchCriteria.brandName = brandName;

    try {
      const response = await fetch('http://localhost:3000/api/brands/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchCriteria),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        console.log('Search Results:', data);
      } else {
        console.error('Error fetching search results:', response.statusText);
        alert('Failed to fetch search results. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  const handleCreateBrand = () => {
    setCreateMode(true);
  };

  return (
    <Container sx={{ mt: 4 }}>
      {createMode ? (
        <CreateBrand onBack={() => setCreateMode(false)} />
      ) : selectedBrand ? (
        <BrandDetails brand={selectedBrand} onBack={() => setSelectedBrand(null)} />
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Search Brand
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              label="Brand Name"
              variant="outlined"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCreateBrand}>
              Create Brand
            </Button>
          </Box>

          {results.length > 0 && (
            <Container sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Search Results:
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Brand Name</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Link href="#" onClick={() => handleBrandClick(result)}>
                            {result.brandName}
                          </Link>
                        </TableCell>
                        <TableCell>{result.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
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
  );
};

export default BrandSearch;