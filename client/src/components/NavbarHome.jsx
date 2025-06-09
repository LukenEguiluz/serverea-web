import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const NavbarHome = ({ onLoginClick, userEmail }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setOpenConfirm(false);
    navigate("/");
    // window.location.reload(); // 🔄 recarga la página
    // navigate(0);
  };

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Botón Dashboard a la izquierda si está logueado */}
          {userEmail ? (
            <IconButton color="primary" onClick={() => navigate("/dashboard")}>
              <DashboardIcon />
            </IconButton>
          ) : (
            <Box />
          )}

          {/* Centro: Título */}
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Mi Sitio Web
          </Typography>

          {/* Derecha: Usuario o botón login */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {userEmail ? (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <AccountCircleIcon sx={{ color: "text.secondary" }} />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", userSelect: "none" }}
                >
                  {userEmail}
                </Typography>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      setOpenConfirm(true); // 👉 abre confirmación
                    }}
                  >
                    Cerrar sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="primary" variant="outlined" onClick={onLoginClick}>
                Iniciar sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Confirmación de logout */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>¿Estás seguro de que deseas cerrar sesión?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>
          <Button color="error" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavbarHome;
