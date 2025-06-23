import { Box, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';

const AdminDashboard = () => {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        mb: 4,
        color: theme.palette.primary.main,
        fontWeight: 'bold'
      }}>
        Panel de Administración
      </Typography>
      
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={3}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Usuarios Registrados
            </Typography>
            <Typography variant="h4">1,254</Typography>
            <Typography variant="caption" color="success.main">
              +12% desde el mes pasado
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} md={6} lg={3}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Solicitudes Hoy
            </Typography>
            <Typography variant="h4">42</Typography>
            <Typography variant="caption" color="success.main">
              +5% desde ayer
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} md={6} lg={3}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Pendientes
            </Typography>
            <Typography variant="h4">8</Typography>
            <Typography variant="caption" color="warning.main">
              3 sin revisar
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} md={6} lg={3}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Tiempo Promedio
            </Typography>
            <Typography variant="h4">12m</Typography>
            <Typography variant="caption" color="success.main">
              -2m desde la semana pasada
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12}>
          <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Actividad Reciente
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%',
                backgroundColor: 'action.hover',
                borderRadius: 1
              }}>
                <Typography color="textSecondary">Gráfico de actividad</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;