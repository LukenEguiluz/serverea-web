import { useState } from "react";
import { Container, Paper, Typography, Button, Input } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";

const FinanceAI = () => {
  const [fileName, setFileName] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      console.log("Archivo subido:", file);
    }
  };

  const handleDownloadTemplate = () => {
    window.open("/plantilla.xlsx", "_blank");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h5" gutterBottom>
          Finance AI
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Sube un archivo <strong>.xlsx</strong> con tus datos financieros para
          analizarlos automáticamente. También puedes descargar una plantilla
          con el formato adecuado.
        </Typography>

        <Button
          component="label"
          variant="contained"
          fullWidth
          startIcon={<UploadFileIcon />}
          sx={{ mb: 2 }}
        >
          Subir archivo Excel
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            sx={{ display: "none" }}
          />
        </Button>

        {fileName && (
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            Archivo seleccionado: {fileName}
          </Typography>
        )}

        <Button
          variant="outlined"
          fullWidth
          startIcon={<DownloadIcon />}
          onClick={handleDownloadTemplate}
        >
          Descargar plantilla
        </Button>
      </Paper>
    </Container>
  );
};

export default FinanceAI;
