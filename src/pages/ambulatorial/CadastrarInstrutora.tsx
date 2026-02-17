import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Eye, EyeOff, Upload } from 'lucide-react';
import { ambulatorialAPI } from '../../lib/api';
import { maskCPF, maskPhone, maskCEP } from '../../utils/masks';
import { validatePassword, PasswordStrengthIndicator } from '../../utils/passwordValidation';
import FormStepper from '../../components/FormStepper';

const steps = [
  { number: 1, name: 'Dados Pessoais' },
  { number: 2, name: 'Dados Profissionais' },
  { number: 3, name: 'Endereço' },
  { number: 4, name: 'Credenciais' },
];

export default function CadastrarInstrutora() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    tipo_registro: 'COREN',
    numero_registro: '',
    telefone: '',
    email: '',
    especialidade: '',
    unidade_saude: '',
    cep: '',
    logradouro: '',
    municipio: '',
    bairro: '',
    numero: '',
    complemento: '',
    senha: '',
    confirmarSenha: '',
    diploma_filename: '',
    diploma_content: '',
  });
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === 'cpf') {
      maskedValue = maskCPF(value);
    } else if (name === 'telefone') {
      maskedValue = maskPhone(value);
    } else if (name === 'cep') {
      maskedValue = maskCEP(value);
    }

    setFormData({ ...formData, [name]: maskedValue });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Por favor, selecione apenas arquivos PDF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1] || '';
        setFormData({
          ...formData,
          diploma_filename: file.name,
          diploma_content: base64,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.nome) {
        alert('Por favor, preencha o nome completo.');
        return false;
      }
      if (!formData.cpf) {
        alert('Por favor, preencha o CPF.');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.tipo_registro) {
        alert('Por favor, selecione o tipo de registro profissional.');
        return false;
      }
      if (!formData.numero_registro) {
        alert('Por favor, preencha o número do registro.');
        return false;
      }
      if (!formData.telefone) {
        alert('Por favor, preencha o telefone.');
        return false;
      }
      if (!formData.email) {
        alert('Por favor, preencha o email.');
        return false;
      }
      if (!formData.especialidade) {
        alert('Por favor, preencha a especialidade.');
        return false;
      }
      if (!formData.unidade_saude) {
        alert('Por favor, preencha a unidade de saúde.');
        return false;
      }
    }

    if (step === 4) {
      if (!formData.senha) {
        alert('Por favor, preencha a senha.');
        return false;
      }

      const validacao = validatePassword(formData.senha, formData.cpf);
      if (!validacao.isValid) {
        alert('A senha não atende aos requisitos de segurança:\n\n' + validacao.errors.join('\n'));
        return false;
      }

      if (!formData.confirmarSenha) {
        alert('Por favor, confirme a senha.');
        return false;
      }

      if (formData.senha !== formData.confirmarSenha) {
        alert('As senhas não coincidem.');
        return false;
      }
    }

    return true;
  };

  const handleSaveDados = async () => {
    try {
      alert('Dados salvos temporariamente!');
    } catch (error: any) {
      console.error('Erro ao salvar dados:', error);
      alert(`Erro ao salvar dados: ${error.message || 'Tente novamente.'}`);
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === steps.length) {
      await handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(4)) {
      return;
    }

    const validationResult = await ambulatorialAPI.validateEnfermeiraInstrutora({
      cpf: formData.cpf,
      email: formData.email,
      numero_registro: formData.numero_registro,
    });

    if (!validationResult.valid) {
      alert('Já existe cadastro com este CPF, e-mail ou número de registro:\n\n' + validationResult.errors.join('\n'));
      return;
    }

    setLoading(true);
    try {
      await ambulatorialAPI.createEnfermeiraInstrutora(formData);
      alert('Profissional cadastrado com sucesso!');
      navigate('/ambulatorial/instrutoras');
    } catch (error: any) {
      console.error('Erro ao cadastrar profissional:', error);
      alert(error.message || 'Erro ao cadastrar profissional. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Dados Pessoais</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CPF <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            maxLength={14}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Este será usado como login</p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Dados Profissionais</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Registro Profissional <span className="text-red-500">*</span>
          </label>
          <select
            name="tipo_registro"
            value={formData.tipo_registro}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            required
          >
            <option value="COREN">COREN</option>
            <option value="CRM">CRM</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número do Registro ({formData.tipo_registro}) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="numero_registro"
            value={formData.numero_registro}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            maxLength={15}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Especialidade <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="especialidade"
            value={formData.especialidade}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unidade de Saúde (vínculo) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="unidade_saude"
            value={formData.unidade_saude}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diploma (PDF)
          </label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload size={20} />
              <span>{formData.diploma_filename || 'Selecionar arquivo'}</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {formData.diploma_filename && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, diploma_filename: '', diploma_content: '' })}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remover
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Máximo 5MB</p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Endereço</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CEP
            </label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              maxLength={9}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Município
            </label>
            <input
              type="text"
              name="municipio"
              value={formData.municipio}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logradouro
            </label>
            <input
              type="text"
              name="logradouro"
              value={formData.logradouro}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bairro
            </label>
            <input
              type="text"
              name="bairro"
              value={formData.bairro}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número
            </label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complemento
            </label>
            <input
              type="text"
              name="complemento"
              value={formData.complemento}
              onChange={handleInputChange}
              placeholder="Apartamento, casa..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Credenciais de Acesso</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <PasswordStrengthIndicator password={formData.senha} cpf={formData.cpf} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Senha <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={mostrarConfirmarSenha ? 'text' : 'password'}
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formData.confirmarSenha && formData.senha !== formData.confirmarSenha && (
            <p className="text-sm text-red-600 mt-1">As senhas não coincidem</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/ambulatorial/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Cadastrar Profissional - Ambulatorial</h1>
      </div>

      <h2 className="text-xl text-gray-600 mb-6">
        {steps.find(s => s.number === currentStep)?.name}
      </h2>

      <FormStepper steps={steps} currentStep={currentStep} />

      <div className="max-w-2xl mt-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <div className="flex gap-4 mt-6">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          )}

          <button
            onClick={handleSaveDados}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Save size={20} />
            Salvar Dados
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2 bg-[#2d7a4f] hover:bg-[#236b43] text-white px-6 py-3 rounded-lg font-semibold transition-colors ml-auto disabled:opacity-50"
          >
            {currentStep === steps.length ? (
              <>
                <Save size={20} />
                {loading ? 'Salvando...' : 'Finalizar Cadastro'}
              </>
            ) : (
              <>
                Próxima Página
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
