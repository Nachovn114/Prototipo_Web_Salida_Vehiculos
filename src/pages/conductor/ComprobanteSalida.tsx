import React from 'react';
import { Box, Typography, Paper, Divider, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 800,
  margin: '2rem auto',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(30, 60, 114, 0.1)',
}));

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  paddingBottom: '1rem',
  borderBottom: '2px solid #1e3c72',
});

const SuccessIcon = styled(CheckCircleOutlineIcon)({
  fontSize: '4rem',
  color: '#2e7d32',
  margin: '1rem 0',
});

const InfoRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '1rem 0',
  padding: '0.5rem 0',
});

const ComprobanteSalida: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // This would typically come from your application state or API
  const comprobanteData = {
    numero: 'C-2023-001234',
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
    nombreConductor: 'Juan Pérez',
    rut: '12.345.678-9',
    patente: 'AB123CD',
    paisOrigen: 'Chile',
    paisDestino: 'Argentina',
    puntoControl: 'Paso Los Libertadores',
    estado: 'Aprobado',
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/conductor');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <StyledPaper elevation={3}>
        <Header>
          <Typography variant="h4" component="h1" color="primary">
            {t('comprobante.titulo')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 40, height: 24, bgcolor: '#0039a6' }} />
            <Box sx={{ width: 40, height: 24, bgcolor: '#d52b1e' }} />
          </Box>
        </Header>

        <Box sx={{ textAlign: 'center', my: 4 }}>
          <SuccessIcon />
          <Typography variant="h5" color="success.main" gutterBottom>
            {t('comprobante.aprobado')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('comprobante.mensaje')}
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#1e3c72' }}>
            {t('comprobante.detalles')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  {t('comprobante.numero')}:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {comprobanteData.numero}
                </Typography>
              </InfoRow>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  {t('comprobante.fecha')}:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {comprobanteData.fecha}
                </Typography>
              </InfoRow>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  {t('comprobante.hora')}:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {comprobanteData.hora}
                </Typography>
              </InfoRow>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  {t('comprobante.conductor')}:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {comprobanteData.nombreConductor}
                </Typography>
              </InfoRow>
            </Grid>
            <Grid item xs={12} md={6}>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  {t('comprobante.rut')}:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {comprobanteData.rut}
                </Typography>
              </InfoRow>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  {t('comprobante.patente')}:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {comprobanteData.patente}
                </Typography>
              </InfoRow>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  {t('comprobante.ruta')}:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {comprobanteData.paisOrigen} → {comprobanteData.paisDestino}
                </Typography>
              </InfoRow>
              <InfoRow>
                <Typography variant="body2" color="text.secondary">
                  {t('comprobante.puntoControl')}:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {comprobanteData.puntoControl}
                </Typography>
              </InfoRow>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{ minWidth: 120 }}
          >
            {t('botones.volver')}
          </Button>
          <Button
            variant="contained"
            onClick={handlePrint}
            sx={{ 
              bgcolor: '#1e3c72',
              '&:hover': { bgcolor: '#152c5e' },
              minWidth: 120 
            }}
          >
            {t('botones.imprimir')}
          </Button>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default ComprobanteSalida;
