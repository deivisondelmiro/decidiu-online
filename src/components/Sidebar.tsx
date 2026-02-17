import { LayoutDashboard, Calendar, Users, UserCheck, UserPlus, Building2, ChevronDown, ChevronUp, Package, Settings, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const navigate = useNavigate();
  const { permissoes, usuario } = useAuth();
  const [isCapacitacaoExpanded, setIsCapacitacaoExpanded] = useState(false);
  const [isAmbulatoriaExpanded, setIsAmbulatoriaExpanded] = useState(false);
  const [isDistribuicaoExpanded, setIsDistribuicaoExpanded] = useState(false);
  const [isGestaoExpanded, setIsGestaoExpanded] = useState(false);

  useEffect(() => {
    if (activeSection === 'capacitacao' || activeSection.startsWith('capacitacao-')) {
      setIsCapacitacaoExpanded(true);
    }
    if (activeSection === 'ambulatorial' || activeSection.startsWith('ambulatorial-')) {
      setIsAmbulatoriaExpanded(true);
    }
    if (activeSection === 'distribuicao' || activeSection.startsWith('distribuicao-')) {
      setIsDistribuicaoExpanded(true);
    }
    if (activeSection === 'gestao' || activeSection.startsWith('gestao-')) {
      setIsGestaoExpanded(true);
    }
  }, [activeSection]);

  const handleNavigation = (section: string, path: string) => {
    onSectionChange(section);
    navigate(path);
  };

  return (
    <div className="w-64 bg-[#1a4d2e] text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-green-800">
        <div className="flex items-center justify-center gap-3 py-1">
          <img
            src="/CRIAPNG.png"
            alt="Logo CRIA"
            className="h-12 object-contain"
          />
          <img
            src="/DecidiuPNG.png"
            alt="Logo DeciDIU"
            className="h-14 object-contain"
          />
        </div>
      </div>

      <div className="p-4">
        <div className="text-xs text-green-300 mb-2">Menu</div>

        {permissoes.acessoGestao && (
          <>
            <button
              onClick={() => {
                setIsGestaoExpanded(!isGestaoExpanded);
              }}
              className={`w-full text-left px-4 py-2 rounded mb-1 flex items-center justify-between ${
                activeSection === 'gestao' || activeSection.startsWith('gestao-') ? 'bg-green-600' : 'hover:bg-green-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings size={16} />
                Gestão
              </div>
              {isGestaoExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isGestaoExpanded && (
              <div className="ml-4 mt-2 mb-2 border-l-2 border-green-700 pl-2">
                <div className="text-xs text-green-300 mb-2">Submenu</div>

                <button
                  onClick={() => handleNavigation('gestao-dashboard', '/gestao/dashboard')}
                  className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                    activeSection === 'gestao-dashboard' ? 'bg-green-700' : 'hover:bg-green-700'
                  }`}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>

                {(permissoes.podeCriarProfissionais || permissoes.podeCriarAlunos) && (
                  <button
                    onClick={() => handleNavigation('gestao-cadastrar-profissional', '/gestao/cadastrar-profissional')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                      activeSection === 'gestao-cadastrar-profissional' ? 'bg-green-700' : 'hover:bg-green-700'
                    }`}
                  >
                    <UserPlus size={16} />
                    Cadastrar Profissional
                  </button>
                )}

                {permissoes.acessoGestao && (
                  <button
                    onClick={() => handleNavigation('gestao-lista-profissionais', '/gestao/profissionais')}
                    className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                      activeSection === 'gestao-lista-profissionais' ? 'bg-green-700' : 'hover:bg-green-700'
                    }`}
                  >
                    <List size={16} />
                    Lista de Profissionais
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {permissoes.acessoAmbulatorial && (
          <button
            onClick={() => {
              handleNavigation('ambulatorial', '/ambulatorial/dashboard');
              setIsAmbulatoriaExpanded(!isAmbulatoriaExpanded);
            }}
            className={`w-full text-left px-4 py-2 rounded mb-1 flex items-center justify-between ${
              activeSection === 'ambulatorial' || activeSection.startsWith('ambulatorial-') ? 'bg-green-600' : 'hover:bg-green-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 size={16} />
              Ambulatorial
            </div>
            {isAmbulatoriaExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}

        {isAmbulatoriaExpanded && permissoes.acessoAmbulatorial && (
          <div className="ml-4 mt-2 mb-2 border-l-2 border-green-700 pl-2">
            <div className="text-xs text-green-300 mb-2">Submenu</div>

            <button
              onClick={() => handleNavigation('ambulatorial-dashboard', '/ambulatorial/dashboard')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                activeSection === 'ambulatorial-dashboard' ? 'bg-green-700' : 'hover:bg-green-700'
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>

            {(permissoes.acessoTotal || !permissoes.apenasVisualizacao) && (
              <button
                onClick={() => handleNavigation('ambulatorial-pacientes', '/ambulatorial/pacientes')}
                className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                  activeSection === 'ambulatorial-pacientes' ? 'bg-green-700' : 'hover:bg-green-700'
                }`}
              >
                <Users size={16} />
                Pacientes
              </button>
            )}
          </div>
        )}

        {permissoes.acessoCapacitacao && (
          <button
            onClick={() => {
              handleNavigation('capacitacao', '/capacitacao/dashboard');
              setIsCapacitacaoExpanded(!isCapacitacaoExpanded);
            }}
            className={`w-full text-left px-4 py-2 rounded mb-1 flex items-center justify-between ${
              activeSection === 'capacitacao' || activeSection.startsWith('capacitacao-') ? 'bg-green-600' : 'hover:bg-green-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              Capacitação
            </div>
            {isCapacitacaoExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}

        {isCapacitacaoExpanded && permissoes.acessoCapacitacao && (
          <div className="ml-4 mt-2 mb-2 border-l-2 border-green-700 pl-2">
            <div className="text-xs text-green-300 mb-2">Submenu</div>

            <button
              onClick={() => handleNavigation('capacitacao-dashboard', '/capacitacao/dashboard')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                activeSection === 'capacitacao-dashboard' ? 'bg-green-700' : 'hover:bg-green-700'
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>

            {(permissoes.acessoTotal || !permissoes.apenasVisualizacao) && (
              <>
                <button
                  onClick={() => handleNavigation('capacitacao-agendamentos', '/capacitacao/agendamentos')}
                  className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                    activeSection === 'capacitacao-agendamentos' ? 'bg-green-700' : 'hover:bg-green-700'
                  }`}
                >
                  <Calendar size={16} />
                  Agendamentos
                </button>

                <button
                  onClick={() => handleNavigation('capacitacao-enfermeiras-alunas', '/capacitacao/enfermeiras-alunas')}
                  className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                    activeSection === 'capacitacao-enfermeiras-alunas' ? 'bg-green-700' : 'hover:bg-green-700'
                  }`}
                >
                  <UserCheck size={16} />
                  Enfermeiros(as) Alunos(as)
                </button>

                <button
                  onClick={() => handleNavigation('capacitacao-pacientes', '/capacitacao/pacientes')}
                  className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                    activeSection === 'capacitacao-pacientes' ? 'bg-green-700' : 'hover:bg-green-700'
                  }`}
                >
                  <Users size={16} />
                  Pacientes
                </button>
              </>
            )}
          </div>
        )}

        {permissoes.acessoDistribuicao && (
          <button
            onClick={() => {
              handleNavigation('distribuicao', '/distribuicao/dashboard');
              setIsDistribuicaoExpanded(!isDistribuicaoExpanded);
            }}
            className={`w-full text-left px-4 py-2 rounded mb-1 flex items-center justify-between ${
              activeSection === 'distribuicao' || activeSection.startsWith('distribuicao-') ? 'bg-green-600' : 'hover:bg-green-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={16} />
              Distribuição/Insumos
            </div>
            {isDistribuicaoExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}

        {isDistribuicaoExpanded && permissoes.acessoDistribuicao && (
          <div className="ml-4 mt-2 mb-2 border-l-2 border-green-700 pl-2">
            <div className="text-xs text-green-300 mb-2">Submenu</div>

            <button
              onClick={() => handleNavigation('distribuicao-dashboard', '/distribuicao/dashboard')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                activeSection === 'distribuicao-dashboard' ? 'bg-green-700' : 'hover:bg-green-700'
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>

            {(permissoes.acessoTotal || !permissoes.apenasVisualizacao) && (
              <>
                <button
                  onClick={() => handleNavigation('distribuicao-cadastro', '/distribuicao/cadastro-solicitacao')}
                  className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                    activeSection === 'distribuicao-cadastro' ? 'bg-green-700' : 'hover:bg-green-700'
                  }`}
                >
                  <UserPlus size={16} />
                  Cadastro de Solicitação
                </button>

                <button
                  onClick={() => handleNavigation('distribuicao-lista-espera', '/distribuicao/lista-espera')}
                  className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                    activeSection === 'distribuicao-lista-espera' ? 'bg-green-700' : 'hover:bg-green-700'
                  }`}
                >
                  <Calendar size={16} />
                  Lista de Espera
                </button>
              </>
            )}

            <button
              onClick={() => handleNavigation('distribuicao-municipios', '/distribuicao/distribuicao-municipios')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 text-sm ${
                activeSection === 'distribuicao-municipios' ? 'bg-green-700' : 'hover:bg-green-700'
              }`}
            >
              <Package size={16} />
              Distribuição para Municípios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
