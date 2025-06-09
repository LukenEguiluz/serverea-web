import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Typography,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/apiConfig";

const ResumenCargaTXT = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const initialData = useMemo(() => state?.datos || [], [state]);
  const [numeroArchivo] = useState(state?.numeroArchivo);
  const [datos, setDatos] = useState(initialData);
  const [editRow, setEditRow] = useState(null);
  const [camposGlobales, setCamposGlobales] = useState({
    "Documento de reposicion":
      initialData[0]?.["Documento de reposicion"] || "",
    "No. de envio": initialData[0]?.["No. de envio"] || "",
    "Orden de compra": initialData[0]?.["Orden de compra"] || "",
    "Ticket de salida": initialData[0]?.["Ticket de salida"] || "",
    "Almacen BSCI": initialData[0]?.["Almacen BSCI"] || "",
  });
  const [editCampos, setEditCampos] = useState({});

  const etiquetasDuplicadas = useMemo(() => {
    const conteo = {};
    datos.forEach((d) => {
      conteo[d["Etiqueta RFID"]] = (conteo[d["Etiqueta RFID"]] || 0) + 1;
    });
    return new Set(
      Object.entries(conteo)
        .filter(([, count]) => count > 1)
        .map(([key]) => key)
    );
  }, [datos]);

  const handleCampoGlobal = (campo, valor) => {
    setCamposGlobales({ ...camposGlobales, [campo]: valor });
  };

  const aplicarCampoGlobal = (campo) => {
    const nuevos = datos.map((row) => ({
      ...row,
      [campo]: camposGlobales[campo],
    }));
    setDatos(nuevos);
  };

  const handleRowEdit = (i, field, value) => {
    const copia = [...datos];
    copia[i][field] = value;
    setDatos(copia);
  };

  const handleDescargarExcel = async () => {
    try {
      const res = await axiosInstance.post(
        `/api/boston/generar-excel/${numeroArchivo}/`,
        { datos },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `archivo_${numeroArchivo}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("❌ Error al descargar el archivo Excel.");
      console.error("Error al generar Excel:", error);
    }
  };

  return (
    <Box mt={4} sx={{ overflowX: "auto" }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/boston")}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<FileDownloadIcon />}
          onClick={handleDescargarExcel}
          disabled={datos.length === 0 || !numeroArchivo}
        >
          Descargar y publicar
        </Button>
      </Stack>

      {Object.keys(camposGlobales).map((campo) => (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          mb={1}
          key={campo}
        >
          <Typography variant="body2">
            <strong>{campo}:</strong> {camposGlobales[campo]}
          </Typography>
          <Tooltip title={`Editar ${campo}`}>
            <IconButton
              size="small"
              onClick={() => setEditCampos({ ...editCampos, [campo]: true })}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {editCampos[campo] && (
            <>
              <TextField
                size="small"
                value={camposGlobales[campo]}
                onChange={(e) => handleCampoGlobal(campo, e.target.value)}
              />
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  aplicarCampoGlobal(campo);
                  setEditCampos({ ...editCampos, [campo]: false });
                }}
              >
                Aplicar
              </Button>
            </>
          )}
        </Stack>
      ))}

      <Box sx={{ minWidth: 650 }}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#333" }}>
                {["Código", "Lote", "Caducidad", "Etiqueta RFID", ""].map(
                  (header, i) => (
                    <TableCell
                      key={i}
                      sx={{ color: "#fff", fontWeight: "bold", minWidth: 160 }}
                    >
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {datos.map((row, idx) => (
                <TableRow key={idx}>
                  {["Codigo", "Lote", "Caducidad", "Etiqueta RFID"].map(
                    (key) => (
                      <TableCell
                        key={key}
                        sx={{
                          minWidth: 160,
                          bgcolor:
                            key === "Etiqueta RFID" &&
                            etiquetasDuplicadas.has(row[key])
                              ? "#fdd"
                              : undefined,
                        }}
                      >
                        {editRow === idx ? (
                          <TextField
                            value={row[key]}
                            size="small"
                            onChange={(e) =>
                              handleRowEdit(idx, key, e.target.value)
                            }
                          />
                        ) : (
                          row[key]
                        )}
                      </TableCell>
                    )
                  )}
                  <TableCell>
                    <IconButton
                      onClick={() => setEditRow(editRow === idx ? null : idx)}
                    >
                      {editRow === idx ? <DoneIcon /> : <EditIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {etiquetasDuplicadas.size > 0 && (
        <Typography variant="body2" color="error" mt={2}>
          ⚠️ Hay etiquetas RFID duplicadas marcadas en rojo. Corrígelas antes de
          descargar.
        </Typography>
      )}
    </Box>
  );
};

export default ResumenCargaTXT;
