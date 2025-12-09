import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddReadingFormProps {
  onAddReading: (reading: any) => void;
  sensors: any[];
}

export function AddReadingForm({ onAddReading, sensors }: AddReadingFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sensor_id: '',
    value: '',
    quality_score: '1.00',
    timestamp: new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sensor_id || !formData.value) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const qualityScore = parseFloat(formData.quality_score);
    if (qualityScore < 0 || qualityScore > 1) {
      toast.error('La calidad debe estar entre 0 y 1');
      return;
    }

    const readingData = {
      sensor_id: parseInt(formData.sensor_id),
      value: parseFloat(formData.value),
      quality_score: qualityScore,
      timestamp: new Date(formData.timestamp).toISOString(),
    };

    onAddReading(readingData);
    setOpen(false);
    setFormData({
      sensor_id: '',
      value: '',
      quality_score: '1.00',
      timestamp: new Date().toISOString().slice(0, 16),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Lectura
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Lectura de Sensor</DialogTitle>
          <DialogDescription>Ingresa los detalles de la lectura del sensor.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="sensor_id">Sensor *</Label>
            <Select value={formData.sensor_id} onValueChange={(value) => setFormData({ ...formData, sensor_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un sensor" />
              </SelectTrigger>
              <SelectContent>
                {sensors.map((sensor) => (
                  <SelectItem key={sensor.id} value={sensor.id.toString()}>
                    {sensor.name} ({sensor.sensor_type}) - {sensor.devices?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value">Valor de Lectura *</Label>
            <Input
              id="value"
              type="number"
              step="0.0001"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="25.5"
              required
            />
            {formData.sensor_id && (
              <p className="text-xs text-gray-500 mt-1">
                Unidad: {sensors.find(s => s.id.toString() === formData.sensor_id)?.unit || 'N/A'}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="quality_score">Calidad (0-1) *</Label>
            <Input
              id="quality_score"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={formData.quality_score}
              onChange={(e) => setFormData({ ...formData, quality_score: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              0 = Baja calidad, 1 = Excelente calidad
            </p>
          </div>

          <div>
            <Label htmlFor="timestamp">Fecha y Hora *</Label>
            <Input
              id="timestamp"
              type="datetime-local"
              value={formData.timestamp}
              onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Lectura</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}