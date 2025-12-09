import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddAlertFormProps {
  onAddAlert: (alert: any) => void;
  devices: any[];
}

export function AddAlertForm({ onAddAlert, devices }: AddAlertFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    device_id: '',
    severity: 'medium',
    message: '',
    alert_type: '',
    status: 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.device_id || !formData.message || !formData.alert_type) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const alertData = {
      device_id: parseInt(formData.device_id),
      severity: formData.severity,
      message: formData.message,
      alert_type: formData.alert_type,
      status: formData.status,
    };

    onAddAlert(alertData);
    setOpen(false);
    setFormData({
      device_id: '',
      severity: 'medium',
      message: '',
      alert_type: '',
      status: 'active',
    });
  };

  const alertTypes = [
    'high_temperature',
    'low_temperature',
    'connection_lost',
    'battery_low',
    'sensor_malfunction',
    'threshold_exceeded',
    'maintenance_required',
    'security_breach',
    'data_anomaly',
    'system_error',
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Alerta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Alerta</DialogTitle>
          <DialogDescription>Ingresa los detalles de la alerta.</DialogDescription>
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
                    {device.name} - {device.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="alert_type">Tipo de Alerta *</Label>
            <Select value={formData.alert_type} onValueChange={(value) => setFormData({ ...formData, alert_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                {alertTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="severity">Severidad *</Label>
            <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Mensaje *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe la alerta..."
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
                <SelectItem value="active">Activa</SelectItem>
                <SelectItem value="acknowledged">Reconocida</SelectItem>
                <SelectItem value="resolved">Resuelta</SelectItem>
                <SelectItem value="dismissed">Descartada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Alerta</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}