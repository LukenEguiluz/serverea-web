// src/pages/Boston/AgregarProductos.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  InputAdornment,
  Grid,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/apiConfig";

const AgregarProductos = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [nuevoProducto, setNuevoProducto] = useState({
    gtin: "",
    codigo: "",
    descripcion: "",
  });
  const [excelFile, setExcelFile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 20;

  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axiosInstance.get("/api/boston/productos/");
      setProductos(res.data);
    } catch (err) {
      console.error("❌ Error al obtener productos", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = async () => {
    if (!nuevoProducto.gtin || !nuevoProducto.codigo)
      return alert("GTIN y Código son obligatorios.");

    try {
      const res = await axiosInstance.post(
        "/api/boston/productos/",
        nuevoProducto
      );
      setProductos([...productos, res.data]);
      setNuevoProducto({ gtin: "", codigo: "", descripcion: "" });
    } catch (err) {
      console.error("❌ Error al agregar producto", err);
      alert("Error al agregar producto.");
    }
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      setExcelFile(file);
    } else {
      alert("Por favor selecciona un archivo Excel (.xlsx)");
    }
  };

  const handleCargarExcel = async () => {
    if (!excelFile) return alert("Selecciona un archivo primero.");

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const res = await axiosInstance.post(
        "/api/boston/productos-carga-masiva/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data?.mensaje || "Carga completa");
      setExcelFile(null);
      fetchProductos();
    } catch (error) {
      console.error("❌ Error en la carga masiva", error);
      const backendError =
        error.response?.data?.error || JSON.stringify(error.response?.data);
      alert("Error al cargar productos:\n" + backendError);
    }
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.codigo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );
  const productosVisibles = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  const handlePaginaAnterior = () => {
    setPaginaActual((prev) => Math.max(1, prev - 1));
  };

  const handlePaginaSiguiente = () => {
    setPaginaActual((prev) => Math.min(totalPaginas, prev + 1));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">Carga de Productos</Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/auth/user/boston")}
          >
            Regresar
          </Button>
        </Stack>

        <TextField
          fullWidth
          placeholder="Buscar por código o descripción"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="GTIN"
              value={nuevoProducto.gtin}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, gtin: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Código"
              value={nuevoProducto.codigo}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, codigo: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Descripción"
              value={nuevoProducto.descripcion}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  descripcion: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <IconButton onClick={handleAgregar} color="primary" sx={{ mt: 1 }}>
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>

        {loading ? (
          <Stack alignItems="center" py={6}>
            <CircularProgress />
            <Typography mt={2}>Cargando productos...</Typography>
          </Stack>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>GTIN</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Descripción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosVisibles.map((prod, i) => (
                    <TableRow key={i}>
                      <TableCell>{prod.gtin}</TableCell>
                      <TableCell>{prod.codigo}</TableCell>
                      <TableCell>{prod.descripcion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" justifyContent="center" spacing={2} mb={3}>
              <IconButton
                onClick={handlePaginaAnterior}
                disabled={paginaActual === 1}
              >
                <ArrowLeftIcon />
              </IconButton>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Página {paginaActual} de {totalPaginas}
              </Typography>
              <IconButton
                onClick={handlePaginaSiguiente}
                disabled={paginaActual === totalPaginas}
              >
                <ArrowRightIcon />
              </IconButton>
            </Stack>
          </>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            component="label"
            variant="contained"
            fullWidth
            startIcon={<UploadFileIcon />}
          >
            Subir archivo Excel
            <input
              type="file"
              accept=".xlsx"
              hidden
              onChange={handleExcelUpload}
            />
          </Button>

          <Button
            variant="outlined"
            fullWidth
            disabled={!excelFile}
            onClick={handleCargarExcel}
          >
            Cargar archivo al sistema
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AgregarProductos;
