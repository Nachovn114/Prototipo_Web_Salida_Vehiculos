import React, { useState } from 'react';
import { Card, Upload, Button, message, Steps, Form, Input } from 'antd';
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Step } = Steps;

interface Documento {
  tipo: string;
  estado: 'pendiente' | 'validado' | 'rechazado';
  observaciones?: string;
}

const ValidacionDocumental: React.FC = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([
    { tipo: 'SOAP', estado: 'pendiente' },
    { tipo: 'Licencia de Conducir', estado: 'pendiente' },
    { tipo: 'Pasaporte', estado: 'pendiente' },
  ]);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleValidar = (index: number, estado: 'validado' | 'rechazado') => {
    const nuevosDocumentos = [...documentos];
    nuevosDocumentos[index].estado = estado;
    setDocumentos(nuevosDocumentos);
    
    message.success(`Documento ${estado === 'validado' ? 'validado' : 'rechazado'} correctamente`);
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'validado':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'rechazado':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <Card title="Validación Documental" className="mb-6">
        <Steps current={1} className="mb-8">
          <Step title="Recepción" description="Documentos recibidos" />
          <Step title="Validación" description="En proceso" />
          <Step title="Aprobación" description="Pendiente" />
        </Steps>

        <div className="space-y-6">
          {documentos.map((doc, index) => (
            <Card key={doc.tipo} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">{doc.tipo}</h3>
                  <p className="text-gray-500">
                    Estado: {doc.estado.charAt(0).toUpperCase() + doc.estado.slice(1)}
                    {getEstadoIcon(doc.estado)}
                  </p>
                </div>
                <div className="space-x-2">
                  <Upload
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>Subir Documento</Button>
                  </Upload>
                  {doc.estado === 'pendiente' && (
                    <>
                      <Button 
                        type="primary" 
                        onClick={() => handleValidar(index, 'validado')}
                      >
                        Validar
                      </Button>
                      <Button 
                        danger 
                        onClick={() => handleValidar(index, 'rechazado')}
                      >
                        Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {doc.estado === 'rechazado' && (
                <Form.Item label="Observaciones" className="mt-4">
                  <Input.TextArea rows={2} placeholder="Ingrese motivo del rechazo" />
                </Form.Item>
              )}
            </Card>
          ))}
        </div>
      </Card>

      <Card title="Resumen de Validación">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <h4 className="text-lg font-medium">Total Documentos</h4>
            <p className="text-2xl">{documentos.length}</p>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-medium">Validados</h4>
            <p className="text-2xl text-green-600">
              {documentos.filter(d => d.estado === 'validado').length}
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-medium">Pendientes</h4>
            <p className="text-2xl text-yellow-600">
              {documentos.filter(d => d.estado === 'pendiente').length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ValidacionDocumental; 