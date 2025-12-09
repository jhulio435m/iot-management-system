import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddMaintenanceFormProps {
  onAddMaintenance: (maintenance: any) => void;
  devices: any[];
  technicians: any[];
}

export function AddMaintenanceForm({ onAddMaintenance, devices, technicians }: AddMaintenanceFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    device_id: '',
    technician_id: '',
    maintenance_type: 'preventive',
    description: '',
    status: 'scheduled',
    scheduled_date: '',
    cost: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.device_id || !formData.technician_id || !formData.description) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const maintenanceData = {
      device_id: parseInt(formData.device_id),
      technician_id: parseInt(formData.technician_id),
      maintenance_type: formData.maintenance_type,
      description: formData.description,
      status: formData.status,
      scheduled_date: formData.scheduled_date ? new Date(formData.scheduled_date).toISOString() : null,
      cost: formData.cost ? parseFloat(formData.cost) : null,
    };

    onAddMaintenance(maintenanceData);
    setOpen(false);
    setFormData({
      device_id: '',
      technician_id: '',
      maintenance_type: 'preventive',
      description: '',
      status: 'scheduled',
      scheduled_date: '',
      cost: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Mantenimiento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Mantenimiento</DialogTitle>
          <DialogDescription>Ingresa los detalles del mantenimiento a realizar.</DialogDescription>
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
                    {device.name} ({device.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="technician_id">Técnico Asignado *</Label>
            <Select value={formData.technician_id} onValueChange={(value) => setFormData({ ...formData, technician_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un técnico" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="maintenance_type">Tipo de Mantenimiento *</Label>
            <Select value={formData.maintenance_type} onValueChange={(value) => setFormData({ ...formData, maintenance_type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preventive">Preventivo</SelectItem>
                <SelectItem value="corrective">Correctivo</SelectItem>
                <SelectItem value="emergency">Emergencia</SelectItem>
                <SelectItem value="upgrade">Actualización</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe el mantenimiento a realizar..."
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Estado *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Programado</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="scheduled_date">Fecha Programada</Label>
            <Input
              id="scheduled_date"
              type="datetime-local"
              value={formData.scheduled_date}
              onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="cost">Costo Estimado ($)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="150.00"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Mantenimiento</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}