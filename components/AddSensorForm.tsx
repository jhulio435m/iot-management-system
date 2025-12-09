import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AddSensorFormProps {
  onAdd: (sensor: any) => void;
  devices: any[];
}

export function AddSensorForm({ onAdd, devices }: AddSensorFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    device_id: '',
    name: '',
    sensor_type: '',
    unit: '',
    min_value: '',
    max_value: '',
    calibration_date: '',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.device_id || !formData.name || !formData.sensor_type || !formData.unit) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const sensorData = {
      device_id: parseInt(formData.device_id),
      name: formData.name,
      sensor_type: formData.sensor_type,
      unit: formData.unit,
      min_value: formData.min_value ? parseFloat(formData.min_value) : null,
      max_value: formData.max_value ? parseFloat(formData.max_value) : null,
      calibration_date: formData.calibration_date || null,
      is_active: formData.is_active,
    };

    onAdd(sensorData);
    setOpen(false);
    setFormData({
      device_id: '',
      name: '',
      sensor_type: '',
      unit: '',
      min_value: '',
      max_value: '',
      calibration_date: '',
      is_active: true,
    });
  };

  const sensorTypes = [
    'temperature',
    'humidity',
    'pressure',
    'motion',
    'light',
    'sound',
    'air_quality',
    'vibration',
    'proximity',
    'flow',
    'level',
    'voltage',
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Sensor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Sensor</DialogTitle>
          <DialogDescription>Ingresa los detalles del nuevo sensor.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="device_id">Dispositivo *</Label>
            <Select value={formData.device_id} onValueChange={(value) => setFormData({ ...formData, device_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un dispositivo" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device) => (
                  <SelectItem key={device.id} value={device.id.toString()}>
                    {device.name} ({device.mac_address})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Nombre del Sensor *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Sensor de Temperatura Ambiente"
              required
            />
          </div>

          <div>
            <Label htmlFor="sensor_type">Tipo de Sensor *</Label>
            <Select value={formData.sensor_type} onValueChange={(value) => setFormData({ ...formData, sensor_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                {sensorTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="unit">Unidad de Medida *</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="°C, %, Pa, lux, etc."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min_value">Valor Mínimo</Label>
              <Input
                id="min_value"
                type="number"
                step="0.0001"
                value={formData.min_value}
                onChange={(e) => setFormData({ ...formData, min_value: e.target.value })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="max_value">Valor Máximo</Label>
              <Input
                id="max_value"
                type="number"
                step="0.0001"
                value={formData.max_value}
                onChange={(e) => setFormData({ ...formData, max_value: e.target.value })}
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="calibration_date">Fecha de Calibración</Label>
            <Input
              id="calibration_date"
              type="date"
              value={formData.calibration_date}
              onChange={(e) => setFormData({ ...formData, calibration_date: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="is_active" className="cursor-pointer">Sensor Activo</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Sensor</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}