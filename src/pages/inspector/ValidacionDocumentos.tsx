import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, 
  List, ListItem, ListItemText, 
  ListItemIcon, Divider, Chip, 
  TextField, Alert, IconButton,
  Dialog, DialogTitle, DialogContent, 
  DialogActions, DialogContentText
} from '@mui/material';
import {
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

type Documento = {
  id: string;
  nombre: string;
  tipo: 'SOAP' | 'revisionTecnica' | 'licencia' | 'seguro' | 'documentacionVehiculo';
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  observaciones?: string;
  url?: string;
  fechaSubida: string;
};

type Solicitud = {
  id: string;
  conductor: string;
  patente: string;
  pais: 'Chile' | 'Argentina';
  documentos: Documento[];
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'observada';
  fechaSolicitud: string;
};

const ValidacionDocumentos: React.FC = () => {
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState<Solicitud>({
    id: 'SOL-2023-001',
    conductor: 'Juan Pérez',
    patente: 'AB123CD',
    pais: 'Chile',
    fechaSolicitud: '2023-06-22T10:30:00',
    estado: 'pendiente',
    documentos: [
      {
        id: 'doc1',
        nombre: 'SOAP vigente',
        tipo: 'SOAP',
        estado: 'pendiente',
        fechaSubida: '2023-06-22T10:15:00',
        url: '/documentos/soap-123.pdf'
      },
      {
        id: 'doc2',
        nombre: 'Revisión técnica',
        tipo: 'revisionTecnica',
        estado: 'pendiente',
        fechaSubida: '2023-06-22T10:16:00',
        url: '/documentos/revision-tecnica-123.pdf'
      },
      {
        id: 'doc3',
        nombre: 'Licencia de conducir',
        tipo: 'licencia',
        estado: 'pendiente',
        fechaSubida: '2023-06-22T10:17:00',
        url: '/documentos/licencia-123.pdf'
      },
      {
        id: 'doc4',
        nombre: 'Documentación del vehículo',
        tipo: 'documentacionVehiculo',
        estado: 'pendiente',
        fechaSubida: '2023-06-22T10:18:00',
        url: '/documentos/doc-vehiculo-123.pdf'
      },
      {
        id: 'doc5',
        nombre: 'Seguro del vehículo',
        tipo: 'seguro',
        estado: 'pendiente',
        fechaSubida: '2023-06-22T10:19:00',
        url: '/documentos/seguro-123.pdf'
      }
    ]
  });

  const [observaciones, setObservaciones] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: '',
    message: '',
    action: () => {}
  });

  const handleAprobarDocumento = (documentoId: string) => {
    setSolicitud(prev => ({
      ...prev,
      documentos: prev.documentos.map(doc =>
        doc.id === documentoId ? { ...doc, estado: 'aprobado' as const } : doc
      )
    }));
  };

  const handleRechazarDocumento = (documentoId: string) => {
    setSolicitud(prev => ({
      ...prev,
      documentos: prev.documentos.map(doc =>
        doc.id === documentoId 
          ? { 
              ...doc, 
              estado: 'rechazado' as const,
              observaciones: observaciones || 'Documento rechazado sin observaciones especificadas'
            } 
          : doc
      )
    }));
    setObservaciones('');
  };

  const handleAprobarSolicitud = () => {
    setDialogConfig({
      title: 'Confirmar Aprobación',
      message: '¿Está seguro de que desea aprobar esta solicitud?',
      action: () => {
        // Lógica para aprobar la solicitud
        setSolicitud(prev => ({ ...prev, estado: 'aprobada' }));
        setOpenDialog(false);
      }
    });
    setOpenDialog(true);
  };

  const handleRechazarSolicitud = () => {
    setDialogConfig({
      title: 'Confirmar Rechazo',
      message: '¿Está seguro de que desea rechazar esta solicitud?',
      action: () => {
        // Lógica para rechazar la solicitud
        setSolicitud(prev => ({ ...prev, estado: 'rechazada' }));
        setOpenDialog(false);
      }
    });
    setOpenDialog(true);
  };

  const handleVerDocumento = (url: string) => {
    // Lógica para visualizar el documento
    window.open(url, '_blank');
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return 'success';
      case 'rechazado':
        return 'error';
      case 'pendiente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const documentosPendientes = solicitud.documentos.filter(doc => doc.estado === 'pendiente').length;
  const hayDocumentosPendientes = documentosPendientes > 0;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Validación de Documentos
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#f9f9f9' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" color="primary">
              Solicitud #{solicitud.id}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Conductor: {solicitud.conductor}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Patente: {solicitud.patente} • {solicitud.pais}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Fecha de solicitud: {new Date(solicitud.fechaSolicitud).toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Chip 
              label={solicitud.estado.toUpperCase()} 
              color={
                solicitud.estado === 'aprobada' ? 'success' : 
                solicitud.estado === 'rechazada' ? 'error' : 'warning'
              }
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Documentos a validar
        {hayDocumentosPendientes && (
          <Chip 
            label={`${documentosPendientes} pendientes`} 
            color="warning" 
            size="small" 
            sx={{ ml: 2 }}
          />
        )}
      </Typography>

      <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 4 }}>
        {solicitud.documentos.map((documento, index) => (
          <React.Fragment key={documento.id}>
            <ListItem 
              alignItems="flex-start"
              sx={{
                borderLeft: 4,
                borderColor: documento.estado === 'aprobado' ? 'success.main' :
                              documento.estado === 'rechazado' ? 'error.main' : 'warning.main',
                mb: 1,
                bgcolor: documento.estado === 'pendiente' ? 'action.hover' : 'background.paper',
                borderRadius: 1
              }}
            >
              <ListItemIcon>
                <DescriptionIcon color={documento.estado === 'pendiente' ? 'action' : 'primary'} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'medium' }}>{documento.nombre}</Typography>
                    <Chip 
                      label={documento.estado.toUpperCase()} 
                      size="small" 
                      color={getEstadoColor(documento.estado)}
                      sx={{ ml: 2, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      Subido el {new Date(documento.fechaSubida).toLocaleString()}
                    </Typography>
                    {documento.observaciones && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="error">
                          <WarningIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          {documento.observaciones}
                        </Typography>
                      </Box>
                    )}
                  </>
                }
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleVerDocumento(documento.url || '#')}
                  title="Ver documento"
                >
                  <VisibilityIcon />
                </IconButton>
                {documento.estado === 'pendiente' && (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleAprobarDocumento(documento.id)}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => {
                        const obs = prompt('Ingrese las observaciones de rechazo:');
                        if (obs !== null) {
                          setObservaciones(obs);
                          handleRechazarDocumento(documento.id);
                        }
                      }}
                    >
                      Rechazar
                    </Button>
                  </>
                )}
              </Box>
            </ListItem>
            {index < solicitud.documentos.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<CancelIcon />}
          onClick={handleRechazarSolicitud}
          disabled={solicitud.estado !== 'pendiente'}
        >
          Rechazar Solicitud
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={handleAprobarSolicitud}
          disabled={hayDocumentosPendientes || solicitud.estado !== 'pendiente'}
        >
          Aprobar Solicitud
        </Button>
      </Box>

      {/* Diálogo de confirmación */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogConfig.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogConfig.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              dialogConfig.action();
              setOpenDialog(false);
            }} 
            color="primary"
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ValidacionDocumentos;
