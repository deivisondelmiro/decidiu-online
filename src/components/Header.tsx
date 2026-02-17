import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userName: string;
}

export default function Header({ userName }: HeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-end items-center gap-4">
      <button className="p-2 hover:bg-gray-100 rounded">
        <Bell size={20} />
      </button>
      <div className="flex items-center gap-2">
        <User size={20} />
        <span className="text-sm">{userName}</span>
        <span className="text-gray-400">|</span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 font-medium"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </div>
  );
}
