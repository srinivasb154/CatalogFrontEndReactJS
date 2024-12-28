import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StoreIcon from '@mui/icons-material/Store';
import ProductScreen from './ProductScreen';
import CategorySearch from './category/CategorySearch';
import BrandSearch from './brand/BrandSearch';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentScreen, setCurrentScreen] = useState('home');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('Search for:', searchQuery);
    // Add functionality to fetch/search products based on the query
  };

  const handleNavigation = (section) => {
    console.log(`Navigating to: ${section}`);
    setCurrentScreen(section);
  };

  return (
    <Box>
      {/* Top App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Product Catalog Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: 1, p: 0.5 }}>
            <InputBase
              placeholder="Search…"
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ ml: 1, flex: 1 }}
            />
            <IconButton type="button" sx={{ p: '10px' }} onClick={handleSearchSubmit}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Horizontal Menu Bar */}
      <AppBar position="static" color="default">
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Button startIcon={<HomeIcon />} color="inherit" onClick={() => handleNavigation('home')}>Home</Button>
          <Button startIcon={<LocalOfferIcon />} color="inherit" onClick={() => handleNavigation('products')}>Products</Button>
          <Button startIcon={<CategoryIcon />} color="inherit" onClick={() => handleNavigation('categories')}>Categories</Button>
          <Button startIcon={<StoreIcon />} color="inherit" onClick={() => handleNavigation('brands')}>Brands</Button>
        </Toolbar>
      </AppBar>

       {/* Conditional Rendering of Screens */}
       {currentScreen === 'products' && <ProductScreen />}
       {currentScreen === 'categories' && <CategorySearch />}
       {currentScreen === 'brands' && <BrandSearch />}
       
    </Box>
  );
}