/*
  # Adicionar campos profissionais e de endereço à tabela usuarios

  ## Descrição
  Adiciona campos necessários para armazenar informações profissionais e de endereço
  dos usuários com cargos administrativos (Administrador, Coordenador, Visitante).

  ## Novos Campos

  ### Dados Profissionais
  - `profissao` (text): Profissão do usuário
  - `vinculo_empregaticio` (text): Tipo de vínculo empregatício

  ### Endereço
  - `cep` (text): CEP do endereço
  - `municipio` (text): Município de residência
  - `logradouro` (text): Logradouro (rua, avenida, etc.)
  - `bairro` (text): Bairro
  - `numero` (text): Número do endereço
  - `complemento` (text, opcional): Complemento do endereço

  ## Observações
  - Todos os campos são opcionais (nullable) para manter compatibilidade com registros existentes
  - Campos serão obrigatórios apenas na camada de aplicação para novos cadastros
*/

-- Adicionar campos profissionais
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS profissao text,
ADD COLUMN IF NOT EXISTS vinculo_empregaticio text;

-- Adicionar campos de endereço
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS cep text,
ADD COLUMN IF NOT EXISTS municipio text,
ADD COLUMN IF NOT EXISTS logradouro text,
ADD COLUMN IF NOT EXISTS bairro text,
ADD COLUMN IF NOT EXISTS numero text,
ADD COLUMN IF NOT EXISTS complemento text;