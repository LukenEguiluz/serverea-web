import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import User from "../pages/auth/User";

export default function Navbar() {
  const { user } = useAuth();
  const { isLoggedIn } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose(); // Cierra menú antes de logout
    await logout(); // Ejecuta logout (limpia token y estado)
    navigate("/"); // Redirige al inicio
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {isMobile && (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={(e) => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(mobileMenuOpen)}
              onClose={() => setMobileMenuOpen(false)}
            >
              <MenuItem component={NavLink} to="/" onClick={handleMenuClose}>
                Home
              </MenuItem>
              {isLoggedIn ? (
                <>
                  {/* <MenuItem
                    component={NavLink}
                    to="/auth/user"
                    onClick={handleMenuClose}
                  >
                    User
                  </MenuItem> */}
                  <MenuItem
                    component={NavLink}
                    to="/auth/user/boston"
                    onClick={handleMenuClose}
                  >
                    Boston
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                </>
              ) : (
                <MenuItem
                  component={NavLink}
                  to="/auth/login"
                  onClick={handleMenuClose}
                >
                  Login
                </MenuItem>
              )}
            </Menu>
          </>
        )}

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Mi Sitio Web
        </Typography>

        {!isMobile && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" component={NavLink} to="/">
              Home
            </Button>
            {isLoggedIn ? (
              <>
                {/* <Button color="inherit" component={NavLink} to="/auth/user">
                  User
                </Button> */}
                <Button
                  color="inherit"
                  component={NavLink}
                  to="/auth/user/boston"
                >
                  Boston
                </Button>
                {/* <Button color="inherit" onClick={handleLogout}>
                  Cerrar sesión
                </Button> */}
              </>
            ) : (
              <Button color="inherit" component={NavLink} to="/auth/login">
                Login
              </Button>
            )}
          </Box>
        )}

        {/* {isLoggedIn && !isMobile && (
          <IconButton onClick={handleMenuClick} sx={{ ml: 2 }}>
            <AccountCircleIcon sx={{ color: "white" }} />
          </IconButton>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {isLoggedIn && (
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          )}
        </Menu> */}
        {isLoggedIn && !isMobile && (
          <IconButton onClick={handleMenuClick} sx={{ ml: 2 }}>
            <AccountCircleIcon sx={{ color: "white" }} />
          </IconButton>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {isLoggedIn && (
            <>
              <User />
              <MenuItem disabled>
                <strong>
                  {user?.first_name} {user?.last_name}
                </strong>
              </MenuItem>
              <MenuItem disabled>{user?.email}</MenuItem>
              <MenuItem disabled>
                {user?.is_staff ? "Administrador" : "Usuario regular"}
              </MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
