import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, Select, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

interface ItemCarga {
  id: string;
  descripcion: string;
  cantidad: number;
  peso: number;
  estado: 'pendiente' | 'verificado' | 'rechazado';
  observaciones?: string;
}

const RevisionCarga: React.FC = () => {
  const [items, setItems] = useState<ItemCarga[]>([
    {
      id: '1',
      descripcion: 'Cajas de frutas',
      cantidad: 50,
      peso: 1000,
      estado: 'pendiente'
    },
    {
      id: '2',
      descripcion: 'Electrónicos',
      cantidad: 10,
      peso: 500,
      estado: 'pendiente'
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemCarga | null>(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
    },
    {
      title: 'Peso (kg)',
      dataIndex: 'peso',
      key: 'peso',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado: string) => {
        const colors = {
          pendiente: 'gold',
          verificado: 'green',
          rechazado: 'red'
        };
        return <Tag color={colors[estado as keyof typeof colors]}>{estado.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, record: ItemCarga) => (
        <Space>
          <Button 
            type="primary"
            onClick={() => handleVerificar(record)}
            disabled={record.estado !== 'pendiente'}
          >
            Verificar
          </Button>
          <Button 
            danger
            onClick={() => handleRechazar(record)}
            disabled={record.estado !== 'pendiente'}
          >
            Rechazar
          </Button>
        </Space>
      )
    }
  ];

  const handleVerificar = (item: ItemCarga) => {
    setSelectedItem(item);
    setIsModalVisible(true);
    form.setFieldsValue({
      estado: 'verificado',
      observaciones: ''
    });
  };

  const handleRechazar = (item: ItemCarga) => {
    setSelectedItem(item);
    setIsModalVisible(true);
    form.setFieldsValue({
      estado: 'rechazado',
      observaciones: ''
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (selectedItem) {
        const nuevosItems = items.map(item => 
          item.id === selectedItem.id 
            ? { ...item, estado: values.estado, observaciones: values.observaciones }
            : item
        );
        setItems(nuevosItems);
        setIsModalVisible(false);
      }
    });
  };

  return (
    <div className="p-6">
      <Card title="Revisión de Carga" className="mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Resumen de Carga</h3>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <Card size="small">
              <Statistic title="Total Items" value={items.length} />
            </Card>
            <Card size="small">
              <Statistic 
                title="Pendientes" 
                value={items.filter(i => i.estado === 'pendiente').length}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
            <Card size="small">
              <Statistic 
                title="Verificados" 
                value={items.filter(i => i.estado === 'verificado').length}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
            <Card size="small">
              <Statistic 
                title="Rechazados" 
                value={items.filter(i => i.estado === 'rechazado').length}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={items}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title="Verificación de Carga"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="estado"
            label="Estado"
            rules={[{ required: true, message: 'Por favor seleccione un estado' }]}
          >
            <Select>
              <Option value="verificado">Verificado</Option>
              <Option value="rechazado">Rechazado</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="observaciones"
            label="Observaciones"
            rules={[{ required: true, message: 'Por favor ingrese observaciones' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RevisionCarga; 