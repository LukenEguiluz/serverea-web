import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';

const LayoutPrivado = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar /> {/* barra lateral izquierda */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default LayoutPrivado;
