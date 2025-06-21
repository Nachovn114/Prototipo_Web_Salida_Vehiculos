import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 24, marginBottom: 10, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, marginBottom: 10, fontWeight: 'bold' },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: 150, fontWeight: 'bold' },
  value: { flex: 1 },
  qrContainer: { marginTop: 20, alignItems: 'center' },
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 0, 
    right: 0, 
    textAlign: 'center',
    fontSize: 10,
    color: '#666'
  }
});

const ComprobantePDF = ({ solicitud }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState('');

  // Funciones para formatear fechas usando toLocaleDateString nativo
  const formatearFechaHora = (fecha) => {
    const date = new Date(fecha);
    const fechaFormateada = date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const horaFormateada = date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${fechaFormateada} ${horaFormateada}`;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(`https://fronteradigital.aduana.cl/verificar/${solicitud.id}`);
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };
    generateQR();
  }, [solicitud.id]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>COMPROBANTE DE SALIDA</Text>
          <Text style={styles.subtitle}>Sistema Frontera Digital - Servicio Nacional de Aduanas</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de la Solicitud</Text>
          <View style={styles.row}>
            <Text style={styles.label}>N° Solicitud:</Text>
            <Text style={styles.value}>{solicitud.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha y Hora:</Text>
            <Text style={styles.value}>
              {formatearFechaHora(solicitud.fechaHora)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Conductor</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{solicitud.conductor.nombre}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Documento:</Text>
            <Text style={styles.value}>{solicitud.conductor.documento}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehículo</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Patente:</Text>
            <Text style={styles.value}>{solicitud.vehiculo.patente}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Marca/Modelo:</Text>
            <Text style={styles.value}>{`${solicitud.vehiculo.marca} ${solicitud.vehiculo.modelo}`}</Text>
          </View>
        </View>

        <View style={styles.qrContainer}>
          {qrCodeDataUrl && (
            <Image 
              src={qrCodeDataUrl} 
              style={{ width: 100, height: 100 }} 
            />
          )}
        </View>

        <View style={styles.footer}>
          <Text>Documento generado electrónicamente - {formatearFecha(solicitud.fechaHora)}</Text>
          <Text>Sello digital: {btoa(`sello-${solicitud.id}-${Date.now()}`).substring(0, 24)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export const ComprobanteButton = ({ solicitud }) => (
  <PDFDownloadLink
    document={<ComprobantePDF solicitud={solicitud} />}
    fileName={`comprobante-salida-${solicitud.id}.pdf`}
  >
    {({ loading }) => (
      <Button disabled={loading}>
        <Download className="mr-2 h-4 w-4" />
        {loading ? 'Generando...' : 'Descargar Comprobante'}
      </Button>
    )}
  </PDFDownloadLink>
);