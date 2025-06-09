// pages/Dashboard.jsx
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Typography variant="body1">
        Bienvenido. Aquí puedes acceder a las distintas funcionalidades del sistema.
      </Typography>
    </Box>
  );
};

export default Dashboard;
