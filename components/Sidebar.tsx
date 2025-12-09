import { 
  Home, 
  FolderKanban, 
  MapPin, 
  Cpu, 
  Gauge, 
  TrendingUp, 
  AlertCircle, 
  Wrench,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'projects', label: 'Proyectos', icon: FolderKanban },
  { id: 'locations', label: 'Ubicaciones', icon: MapPin },
  { id: 'devices', label: 'Dispositivos', icon: Cpu },
  { id: 'sensors', label: 'Sensores', icon: Gauge },
  { id: 'readings', label: 'Lecturas', icon: TrendingUp },
  { id: 'alerts', label: 'Alertas', icon: AlertCircle },
  { id: 'maintenance', label: 'Mantenimiento', icon: Wrench },
];

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleViewChange = (view: string) => {
    onViewChange(view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-40
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Cpu className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">IoT Manager</h1>
                <p className="text-xs text-gray-600">Sistema de Gestión</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleViewChange(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-colors duration-200
                        ${
                          isActive
                            ? 'bg-purple-100 text-purple-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p className="font-medium">v1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}