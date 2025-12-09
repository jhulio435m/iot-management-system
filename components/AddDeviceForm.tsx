import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AddDeviceFormProps {
  onAdd: (device: any) => void;
  projects: any[];
  deviceTypes: any[];
  locations: any[];
}

export function AddDeviceForm({ onAdd, projects, deviceTypes, locations }: AddDeviceFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    device_type_id: '',
    location_id: '',
    name: '',
    mac_address: '',
    ip_address: '',
    status: 'offline',
    firmware_version: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.project_id || !formData.device_type_id || !formData.name || !formData.mac_address) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    // Validar formato MAC address (XX:XX:XX:XX:XX:XX)
    const macRegex = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/;
    if (!macRegex.test(formData.mac_address)) {
      toast.error('Formato de MAC address inválido. Usa XX:XX:XX:XX:XX:XX');
      return;
    }

    const deviceData = {
      project_id: parseInt(formData.project_id),
      device_type_id: parseInt(formData.device_type_id),
      location_id: formData.location_id ? parseInt(formData.location_id) : null,
      name: formData.name,
      mac_address: formData.mac_address,
      ip_address: formData.ip_address || null,
      status: formData.status,
      firmware_version: formData.firmware_version || null,
      last_seen: new Date().toISOString(),
    };

    onAdd(deviceData);
    setOpen(false);
    setFormData({
      project_id: '',
      device_type_id: '',
      location_id: '',
      name: '',
      mac_address: '',
      ip_address: '',
      status: 'offline',
      firmware_version: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Dispositivo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Dispositivo IoT</DialogTitle>
          <DialogDescription>Agrega un nuevo dispositivo a tu proyecto.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="project_id">Proyecto *</Label>
            <Select value={formData.project_id} onValueChange={(value) => setFormData({ ...formData, project_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un proyecto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name} ({project.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="device_type_id">Tipo de Dispositivo *</Label>
            <Select value={formData.device_type_id} onValueChange={(value) => setFormData({ ...formData, device_type_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {deviceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name} - {type.manufacturer || 'N/A'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location_id">Ubicación (Opcional)</Label>
            <Select value={formData.location_id} onValueChange={(value) => setFormData({ ...formData, location_id: value === 'none' ? '' : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una ubicación (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin ubicación</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name} - {location.city}, {location.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Nombre del Dispositivo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Sensor Hub Principal"
              required
            />
          </div>

          <div>
            <Label htmlFor="mac_address">Dirección MAC *</Label>
            <Input
              id="mac_address"
              value={formData.mac_address}
              onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })}
              placeholder="AA:BB:CC:DD:EE:FF"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Formato: XX:XX:XX:XX:XX:XX</p>
          </div>

          <div>
            <Label htmlFor="ip_address">Dirección IP</Label>
            <Input
              id="ip_address"
              value={formData.ip_address}
              onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
              placeholder="192.168.1.100"
            />
          </div>

          <div>
            <Label htmlFor="status">Estado *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">En Línea</SelectItem>
                <SelectItem value="offline">Fuera de Línea</SelectItem>
                <SelectItem value="maintenance">En Mantenimiento</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="firmware_version">Versión de Firmware</Label>
            <Input
              id="firmware_version"
              value={formData.firmware_version}
              onChange={(e) => setFormData({ ...formData, firmware_version: e.target.value })}
              placeholder="v2.1.3"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Dispositivo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}