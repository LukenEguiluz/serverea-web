// src/pages/Boston/AgregarClientes.jsx
import React, { useEffect, useState } from "react";
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
  Box,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/apiConfig";

const AgregarClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: "", codigo: "" });
  const [modoEdicion, setModoEdicion] = useState(null); // índice del cliente en edición
  const [clienteEditado, setClienteEditado] = useState({});
  const navigate = useNavigate();

  const fetchClientes = async () => {
    try {
      const res = await axiosInstance.get("/api/boston/clientes/");
      setClientes(res.data);
    } catch (err) {
      console.error("Error al obtener clientes", err);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleAgregar = async () => {
    if (!nuevoCliente.nombre || !nuevoCliente.codigo)
      return alert("Nombre y Código son obligatorios.");

    try {
      const res = await axiosInstance.post(
        "/api/boston/clientes/",
        nuevoCliente
      );
      setClientes([...clientes, res.data]);
      setNuevoCliente({ nombre: "", codigo: "" });
    } catch (err) {
      alert("Error al agregar cliente.");
      console.error(err);
    }
  };

  const handleGuardarEdicion = async (id, index) => {
    try {
      const res = await axiosInstance.put(
        `/api/boston/clientes/${id}/`,
        clienteEditado
      );
      const actualizados = [...clientes];
      actualizados[index] = res.data;
      setClientes(actualizados);
      setModoEdicion(null);
    } catch (err) {
      alert("Error al guardar cambios.");
      console.error(err);
    }
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">Carga de Clientes</Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/auth/user/boston")}
          >
            Regresar
          </Button>
        </Stack>

        <TextField
          fullWidth
          placeholder="Buscar por nombre o código"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
          <TextField
            label="Nombre"
            value={nuevoCliente.nombre}
            onChange={(e) =>
              setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Código"
            value={nuevoCliente.codigo}
            onChange={(e) =>
              setNuevoCliente({ ...nuevoCliente, codigo: e.target.value })
            }
            fullWidth
          />
          <IconButton
            onClick={handleAgregar}
            color="primary"
            sx={{ alignSelf: "center" }}
          >
            <AddIcon />
          </IconButton>
        </Stack>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<FileUploadIcon />}
          sx={{ mb: 2 }}
        >
          Cargar desde Excel
        </Button>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Código</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientesFiltrados.map((cli, i) => (
                <TableRow key={cli.id}>
                  <TableCell>
                    {modoEdicion === i ? (
                      <TextField
                        value={clienteEditado.nombre}
                        onChange={(e) =>
                          setClienteEditado({
                            ...clienteEditado,
                            nombre: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      cli.nombre
                    )}
                  </TableCell>
                  <TableCell>
                    {modoEdicion === i ? (
                      <TextField
                        value={clienteEditado.codigo}
                        onChange={(e) =>
                          setClienteEditado({
                            ...clienteEditado,
                            codigo: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      cli.codigo
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {modoEdicion === i ? (
                      <>
                        <IconButton
                          onClick={() => handleGuardarEdicion(cli.id, i)}
                        >
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={() => setModoEdicion(null)}>
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        onClick={() => {
                          setModoEdicion(i);
                          setClienteEditado({
                            nombre: cli.nombre,
                            codigo: cli.codigo,
                          });
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AgregarClientes;
