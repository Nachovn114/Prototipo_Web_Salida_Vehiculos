import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DeclaracionCarga: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    tipoCarga: '',
    descripcion: '',
    peso: '',
    valor: '',
    cantidadBultos: '',
    observaciones: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Datos de la carga:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {t('declaracionCarga.titulo', 'Declaración de Carga')}
          </h1>
          <p className="text-gray-600">
            {t('declaracionCarga.subtitulo', 'Complete los detalles de la carga que transporta')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="tipoCarga" className="block text-sm font-medium text-gray-700">
                {t('declaracionCarga.tipoCarga', 'Tipo de Carga')} *
              </label>
              <Select
                value={formData.tipoCarga}
                onValueChange={(value) => setFormData({...formData, tipoCarga: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('declaracionCarga.seleccioneTipo', 'Seleccione un tipo')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{t('declaracionCarga.general', 'Carga General')}</SelectItem>
                  <SelectItem value="peligrosa">{t('declaracionCarga.peligrosa', 'Carga Peligrosa')}</SelectItem>
                  <SelectItem value="perecible">{t('declaracionCarga.perecible', 'Carga Perecible')}</SelectItem>
                  <SelectItem value="animales">{t('declaracionCarga.animales', 'Animales Vivos')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="peso" className="block text-sm font-medium text-gray-700">
                {t('declaracionCarga.peso', 'Peso (kg)')} *
              </label>
              <Input
                type="number"
                id="peso"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="valor" className="block text-sm font-medium text-gray-700">
                {t('declaracionCarga.valor', 'Valor (USD)')} *
              </label>
              <Input
                type="number"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cantidadBultos" className="block text-sm font-medium text-gray-700">
                {t('declaracionCarga.cantidadBultos', 'Cantidad de Bultos')} *
              </label>
              <Input
                type="number"
                id="cantidadBultos"
                name="cantidadBultos"
                value={formData.cantidadBultos}
                onChange={handleChange}
                required
              />
            </div>
          </div>


          <div className="space-y-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              {t('declaracionCarga.descripcion', 'Descripción de la Carga')} *
            </label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              placeholder={t('declaracionCarga.descripcionPlaceholder', 'Describa detalladamente la carga')}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
              {t('declaracionCarga.observaciones', 'Observaciones')}
            </label>
            <Textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={2}
              placeholder={t('declaracionCarga.observacionesPlaceholder', 'Indique cualquier información adicional relevante')}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline">
              {t('comun.cancelar', 'Cancelar')}
            </Button>
            <Button type="submit" className="bg-[#1e3c72] hover:bg-[#1a3364]">
              {t('comun.guardar', 'Guardar Declaración')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeclaracionCarga;
