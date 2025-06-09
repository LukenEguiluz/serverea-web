// src/pages/CargaMaterialBoston.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Box,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/apiConfig";

const CargaMaterialBoston = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: "", codigo: "" });

  useEffect(() => {
    axiosInstance.get("/api/boston/clientes/").then((res) => {
      setClientes(res.data);
    });
  }, []);

  const handleSelectFile = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile || !uploadedFile.name.endsWith(".txt")) {
      return alert("Por favor selecciona un archivo .txt válido.");
    }
    setFile(uploadedFile);
    setFileName(uploadedFile.name);
  };

  const handleAgregarCliente = async () => {
    try {
      const res = await axiosInstance.post(
        "/api/boston/clientes/",
        nuevoCliente
      );
      setClientes([...clientes, res.data]);
      setClienteSeleccionado(res.data.codigo);
      setDialogoAbierto(false);
    } catch (err) {
      alert("Error al agregar cliente");
    }
  };

  const handleProcesarArchivo = async () => {
    if (!file || !clienteSeleccionado)
      return alert("Selecciona archivo y cliente");

    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("cliente_codigo", clienteSeleccionado);

    try {
      const res = await axiosInstance.post(
        "/api/boston/cargar-txt/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const result = res.data;
      navigate("/auth/user/resumen-carga", {
        state: {
          datos: result.datos,
          numeroArchivo: result.numero_archivo,
        },
      });
    } catch (err) {
      alert("Error al procesar el archivo");
      console.error(err);
    }
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h5" gutterBottom>
            Carga de Material - Boston Scientific
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Este módulo permite subir archivos <strong>.txt</strong> para la
            creación automática de archivos Excel compatibles con la plataforma{" "}
            <strong>doHealth</strong>.
          </Typography>

          <Stack spacing={2}>
            <TextField
              select
              label="Selecciona cliente"
              value={clienteSeleccionado}
              onChange={(e) => setClienteSeleccionado(e.target.value)}
              fullWidth
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.codigo} value={cliente.codigo}>
                  {cliente.nombre} ({cliente.codigo})
                </MenuItem>
              ))}
              <MenuItem value="nuevo" onClick={() => setDialogoAbierto(true)}>
                + Agregar nuevo cliente
              </MenuItem>
            </TextField>

            <Button
              component="label"
              variant="contained"
              fullWidth
              startIcon={<UploadFileIcon />}
            >
              Seleccionar archivo .txt
              <Input
                type="file"
                accept=".txt"
                onChange={handleSelectFile}
                sx={{ display: "none" }}
              />
            </Button>

            {fileName && (
              <>
                <Typography variant="body2" color="primary">
                  Archivo seleccionado: {fileName}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<FileUploadIcon />}
                  onClick={handleProcesarArchivo}
                >
                  Procesar archivo
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Container>

      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<LibraryAddIcon />}
          onClick={() => navigate("/auth/user/carga-clientes")}
        >
          Clientes
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<LibraryAddIcon />}
          onClick={() => navigate("/auth/user/carga-productos")}
        >
          Productos
        </Button>
      </Box>

      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)}>
        <DialogTitle>Agregar nuevo cliente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del cliente"
            fullWidth
            value={nuevoCliente.nombre}
            onChange={(e) =>
              setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Código del cliente"
            fullWidth
            value={nuevoCliente.codigo}
            onChange={(e) =>
              setNuevoCliente({ ...nuevoCliente, codigo: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoAbierto(false)}>Cancelar</Button>
          <Button onClick={handleAgregarCliente} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CargaMaterialBoston;
