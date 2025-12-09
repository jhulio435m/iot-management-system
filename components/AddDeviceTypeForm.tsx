import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddDeviceTypeFormProps {
  onAdd: (deviceType: any) => void;
}

export function AddDeviceTypeForm({ onAdd }: AddDeviceTypeFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manufacturer: '',
    specifications: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Por favor completa el nombre del tipo de dispositivo');
      return;
    }

    let specsJson = null;
    if (formData.specifications) {
      try {
        specsJson = JSON.parse(formData.specifications);
      } catch (error) {
        toast.error('Las especificaciones deben ser JSON válido');
        return;
      }
    }

    const deviceTypeData = {
      name: formData.name,
      description: formData.description || null,
      manufacturer: formData.manufacturer || null,
      specifications: specsJson,
    };

    onAdd(deviceTypeData);
    setOpen(false);
    setFormData({
      name: '',
      description: '',
      manufacturer: '',
      specifications: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Tipo de Dispositivo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Tipo de Dispositivo</DialogTitle>
          <DialogDescription>
            Crea un nuevo tipo de dispositivo para tu sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre * (UNIQUE)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Sensor de Temperatura Industrial"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Sensor de alta precisión para ambientes industriales..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="manufacturer">Fabricante</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              placeholder="Siemens, Schneider Electric, etc."
            />
          </div>

          <div>
            <Label htmlFor="specifications">Especificaciones (JSON)</Label>
            <Textarea
              id="specifications"
              value={formData.specifications}
              onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
              placeholder='{"voltage": "24V", "range": "-40 a 85°C", "protocol": "Modbus"}'
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato JSON. Ejemplo: {`{"voltage": "24V", "power": "5W"}`}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Tipo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}