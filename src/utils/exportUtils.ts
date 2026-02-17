const CABECALHO_INSTITUCIONAL = [
  'Governo do Estado de Alagoas',
  'Secretaria de Estado da Primeira Infância – SECRIA',
  'Programa DeciDIU'
];

const formatarDataParaExportacao = (data: string | null | undefined): string => {
  if (!data) return '-';
  try {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return data || '-';
  }
};

const formatarTelefone = (tel: string | null | undefined): string => {
  if (!tel) return '-';
  const numeros = tel.replace(/\D/g, '');
  if (numeros.length === 11) {
    return `(${numeros.substr(0, 2)}) ${numeros.substr(2, 5)}-${numeros.substr(7)}`;
  } else if (numeros.length === 10) {
    return `(${numeros.substr(0, 2)}) ${numeros.substr(2, 4)}-${numeros.substr(6)}`;
  }
  return tel;
};

export const exportarCSV = (pacientes: any[], nomeArquivo: string = 'pacientes_ambulatorial.csv') => {
  if (!pacientes || pacientes.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  const headers = ['Nome', 'CPF', 'Cartão SUS', 'Município', 'Data de Nascimento', 'Telefone'];

  const cabecalhoInstitucional = CABECALHO_INSTITUCIONAL.join('\n') + '\n\n';

  const csvContent = [
    cabecalhoInstitucional,
    headers.join(';'),
    ...pacientes.map(p => [
      `"${p.nome_completo || '-'}"`,
      `"${p.cpf || '-'}"`,
      `"${p.cartao_sus || '-'}"`,
      `"${p.municipio || '-'}"`,
      `"${formatarDataParaExportacao(p.data_nascimento)}"`,
      `"${formatarTelefone(p.celular)}"`
    ].join(';'))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportarPDF = async (pacientes: any[], nomeArquivo: string = 'pacientes_ambulatorial.pdf') => {
  if (!pacientes || pacientes.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  try {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF() as any;

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    CABECALHO_INSTITUCIONAL.forEach((linha, index) => {
      const textWidth = doc.getTextWidth(linha);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(linha, xPosition, yPosition + (index * 7));
    });

    yPosition += (CABECALHO_INSTITUCIONAL.length * 7) + 10;
    doc.setLineWidth(0.5);
    doc.line(14, yPosition, pageWidth - 14, yPosition);
    yPosition += 10;

    const tableData = pacientes.map(p => [
      p.nome_completo || '-',
      p.cpf || '-',
      p.cartao_sus || '-',
      p.municipio || '-',
      formatarDataParaExportacao(p.data_nascimento),
      formatarTelefone(p.celular)
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Nome', 'CPF', 'Cartão SUS', 'Município', 'Data Nasc.', 'Telefone']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [45, 122, 79],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 }
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(nomeArquivo);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
};

export const exportarAgendamentosCSV = (agendamentos: any[], nomeArquivo: string = 'agendamentos_municipios.csv') => {
  if (!agendamentos || agendamentos.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  const headers = ['Município', 'Data', 'Status', 'Plano de Governança', 'Observações'];

  const cabecalhoInstitucional = CABECALHO_INSTITUCIONAL.join('\n') + '\n\n';

  const csvContent = [
    cabecalhoInstitucional,
    headers.join(';'),
    ...agendamentos.map(a => [
      `"${a.municipio || '-'}"`,
      `"${formatarDataParaExportacao(a.data_agendamento)}"`,
      `"${a.status || '-'}"`,
      `"${a.plano_governanca ? 'Sim' : 'Não'}"`,
      `"${(a.observacoes || '-').replace(/"/g, '""')}"`
    ].join(';'))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportarAgendamentosPDF = async (agendamentos: any[], nomeArquivo: string = 'agendamentos_municipios.pdf') => {
  if (!agendamentos || agendamentos.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  try {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF() as any;

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    CABECALHO_INSTITUCIONAL.forEach((linha, index) => {
      const textWidth = doc.getTextWidth(linha);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(linha, xPosition, yPosition + (index * 7));
    });

    yPosition += (CABECALHO_INSTITUCIONAL.length * 7) + 10;
    doc.setLineWidth(0.5);
    doc.line(14, yPosition, pageWidth - 14, yPosition);
    yPosition += 10;

    const tableData = agendamentos.map(a => [
      a.municipio || '-',
      formatarDataParaExportacao(a.data_agendamento),
      a.status || '-',
      a.plano_governanca ? 'Sim' : 'Não',
      a.observacoes || '-'
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Município', 'Data', 'Status', 'Plano Gov.', 'Observações']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [45, 122, 79],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 60 }
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(nomeArquivo);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
};

export const exportToPDF = async (dados: any[], nomeArquivo: string, titulo?: string) => {
  if (!dados || dados.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  try {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF() as any;

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    CABECALHO_INSTITUCIONAL.forEach((linha, index) => {
      const textWidth = doc.getTextWidth(linha);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(linha, xPosition, yPosition + (index * 7));
    });

    yPosition += (CABECALHO_INSTITUCIONAL.length * 7) + 10;

    if (titulo) {
      doc.setFontSize(14);
      const tituloWidth = doc.getTextWidth(titulo);
      const tituloXPosition = (pageWidth - tituloWidth) / 2;
      doc.text(titulo, tituloXPosition, yPosition);
      yPosition += 10;
    }

    doc.setLineWidth(0.5);
    doc.line(14, yPosition, pageWidth - 14, yPosition);
    yPosition += 10;

    const colunas = Object.keys(dados[0]);
    const tableData = dados.map(item => colunas.map(col => String(item[col] || '-')));

    doc.autoTable({
      startY: yPosition,
      head: [colunas],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [45, 122, 79],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(`${nomeArquivo}.pdf`);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
};

export const exportToExcel = (dados: any[], nomeArquivo: string) => {
  if (!dados || dados.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  const colunas = Object.keys(dados[0]);

  const cabecalhoInstitucional = CABECALHO_INSTITUCIONAL.join('\n') + '\n\n';

  const csvContent = [
    cabecalhoInstitucional,
    colunas.join(';'),
    ...dados.map(item =>
      colunas.map(col => `"${String(item[col] || '-').replace(/"/g, '""')}"`).join(';')
    )
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${nomeArquivo}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportarSolicitacoesCSV = (solicitacoes: any[], nomeArquivo: string = 'lista_espera_solicitacoes.csv') => {
  if (!solicitacoes || solicitacoes.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  const headers = ['Município', 'Tipo de Insumo', 'Qtd. Solicitada', 'Qtd. Autorizada', 'Solicitante', 'Data', 'Status', 'Motivo Negação'];

  const cabecalhoInstitucional = CABECALHO_INSTITUCIONAL.join('\n') + '\n\n';

  const csvContent = [
    cabecalhoInstitucional,
    headers.join(';'),
    ...solicitacoes.map(s => [
      `"${s.municipio_nome || '-'}"`,
      `"${s.tipo_insumo || '-'}"`,
      `"${s.quantidade_solicitada || '-'}"`,
      `"${s.quantidade_autorizada || '-'}"`,
      `"${s.nome_solicitante || '-'}"`,
      `"${formatarDataParaExportacao(s.data_solicitacao)}"`,
      `"${s.status || '-'}"`,
      `"${(s.motivo_negacao || '-').replace(/"/g, '""')}"`
    ].join(';'))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportarSolicitacoesPDF = async (solicitacoes: any[], nomeArquivo: string = 'lista_espera_solicitacoes.pdf') => {
  if (!solicitacoes || solicitacoes.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  try {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF('l') as any;

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    CABECALHO_INSTITUCIONAL.forEach((linha, index) => {
      const textWidth = doc.getTextWidth(linha);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(linha, xPosition, yPosition + (index * 7));
    });

    yPosition += (CABECALHO_INSTITUCIONAL.length * 7) + 5;

    doc.setFontSize(14);
    const titulo = 'Lista de Espera - Solicitações';
    const tituloWidth = doc.getTextWidth(titulo);
    const tituloXPosition = (pageWidth - tituloWidth) / 2;
    doc.text(titulo, tituloXPosition, yPosition);
    yPosition += 8;

    doc.setLineWidth(0.5);
    doc.line(14, yPosition, pageWidth - 14, yPosition);
    yPosition += 8;

    const tableData = solicitacoes.map(s => [
      s.municipio_nome || '-',
      s.tipo_insumo || '-',
      s.quantidade_solicitada || '-',
      s.quantidade_autorizada || '-',
      s.nome_solicitante || '-',
      formatarDataParaExportacao(s.data_solicitacao),
      s.status || '-',
      s.motivo_negacao || '-'
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Município', 'Tipo Insumo', 'Qtd. Sol.', 'Qtd. Aut.', 'Solicitante', 'Data', 'Status', 'Motivo Negação']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [45, 122, 79],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 35 },
        5: { cellWidth: 23 },
        6: { cellWidth: 30 },
        7: { cellWidth: 60 }
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(nomeArquivo);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
};

export const exportarDistribuicaoMunicipiosCSV = (distribuicao: any[], nomeArquivo: string = 'distribuicao_municipios.csv') => {
  if (!distribuicao || distribuicao.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  const headers = ['Município', 'Total Solicitações', 'Autorizadas', 'Não Autorizadas', 'Aguardando'];

  const cabecalhoInstitucional = CABECALHO_INSTITUCIONAL.join('\n') + '\n\n';

  const csvContent = [
    cabecalhoInstitucional,
    headers.join(';'),
    ...distribuicao.map(d => [
      `"${d.municipio || '-'}"`,
      `"${d.totalSolicitacoes || 0}"`,
      `"${d.totalAutorizadas || 0}"`,
      `"${d.totalNaoAutorizadas || 0}"`,
      `"${d.totalAguardando || 0}"`
    ].join(';'))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportarDistribuicaoMunicipiosPDF = async (distribuicao: any[], nomeArquivo: string = 'distribuicao_municipios.pdf') => {
  if (!distribuicao || distribuicao.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  try {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF() as any;

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    CABECALHO_INSTITUCIONAL.forEach((linha, index) => {
      const textWidth = doc.getTextWidth(linha);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(linha, xPosition, yPosition + (index * 7));
    });

    yPosition += (CABECALHO_INSTITUCIONAL.length * 7) + 5;

    doc.setFontSize(14);
    const titulo = 'Distribuição por Município';
    const tituloWidth = doc.getTextWidth(titulo);
    const tituloXPosition = (pageWidth - tituloWidth) / 2;
    doc.text(titulo, tituloXPosition, yPosition);
    yPosition += 8;

    doc.setLineWidth(0.5);
    doc.line(14, yPosition, pageWidth - 14, yPosition);
    yPosition += 8;

    const tableData = distribuicao.map(d => [
      d.municipio || '-',
      d.totalSolicitacoes || 0,
      d.totalAutorizadas || 0,
      d.totalNaoAutorizadas || 0,
      d.totalAguardando || 0
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Município', 'Total Solicitações', 'Autorizadas', 'Não Autorizadas', 'Aguardando']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [45, 122, 79],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 35 },
        4: { cellWidth: 30 }
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(nomeArquivo);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
};

export const exportarInstrutorasCSV = (instrutoras: any[], nomeArquivo: string = 'enfermeiros_instrutores.csv') => {
  if (!instrutoras || instrutoras.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  const headers = ['Nome', 'CPF', 'COREN', 'Telefone', 'Email', 'Especialidade', 'Unidade de Saúde'];

  const cabecalhoInstitucional = CABECALHO_INSTITUCIONAL.join('\n') + '\n\n';

  const csvContent = [
    cabecalhoInstitucional,
    headers.join(';'),
    ...instrutoras.map(i => [
      `"${i.nome || '-'}"`,
      `"${i.cpf || '-'}"`,
      `"${i.coren || '-'}"`,
      `"${formatarTelefone(i.telefone)}"`,
      `"${i.email || '-'}"`,
      `"${i.especialidade || '-'}"`,
      `"${i.unidade_saude || '-'}"`
    ].join(';'))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportarInstrutorsPDF = async (instrutoras: any[], nomeArquivo: string = 'enfermeiros_instrutores.pdf') => {
  if (!instrutoras || instrutoras.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  try {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF('l') as any;

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    CABECALHO_INSTITUCIONAL.forEach((linha, index) => {
      const textWidth = doc.getTextWidth(linha);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(linha, xPosition, yPosition + (index * 7));
    });

    yPosition += (CABECALHO_INSTITUCIONAL.length * 7) + 5;

    doc.setFontSize(14);
    const titulo = 'Enfermeiros(as) Instrutores(as)';
    const tituloWidth = doc.getTextWidth(titulo);
    const tituloXPosition = (pageWidth - tituloWidth) / 2;
    doc.text(titulo, tituloXPosition, yPosition);
    yPosition += 8;

    doc.setLineWidth(0.5);
    doc.line(14, yPosition, pageWidth - 14, yPosition);
    yPosition += 8;

    const tableData = instrutoras.map(i => [
      i.nome || '-',
      i.cpf || '-',
      i.coren || '-',
      formatarTelefone(i.telefone),
      i.email || '-',
      i.especialidade || '-',
      i.unidade_saude || '-'
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Nome', 'CPF', 'COREN', 'Telefone', 'Email', 'Especialidade', 'Unidade de Saúde']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [45, 122, 79],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 },
        4: { cellWidth: 45 },
        5: { cellWidth: 35 },
        6: { cellWidth: 45 }
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(nomeArquivo);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
};

export const exportarAlunasCSV = (alunas: any[], nomeArquivo: string = 'enfermeiros_alunos.csv') => {
  if (!alunas || alunas.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  const headers = ['Nome', 'CPF', 'Telefone', 'Email', 'Município', 'Instrutor(a)', 'Status', 'Progresso'];

  const cabecalhoInstitucional = CABECALHO_INSTITUCIONAL.join('\n') + '\n\n';

  const csvContent = [
    cabecalhoInstitucional,
    headers.join(';'),
    ...alunas.map(a => [
      `"${a.nome || '-'}"`,
      `"${a.cpf || '-'}"`,
      `"${formatarTelefone(a.telefone)}"`,
      `"${a.email || '-'}"`,
      `"${a.municipio || '-'}"`,
      `"${a.instrutora_nome || '-'}"`,
      `"${a.status || '-'}"`,
      `"${a.progresso || 0}%"`
    ].join(';'))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportarAlunasPDF = async (alunas: any[], nomeArquivo: string = 'enfermeiros_alunos.pdf') => {
  if (!alunas || alunas.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  try {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF('l') as any;

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    CABECALHO_INSTITUCIONAL.forEach((linha, index) => {
      const textWidth = doc.getTextWidth(linha);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(linha, xPosition, yPosition + (index * 7));
    });

    yPosition += (CABECALHO_INSTITUCIONAL.length * 7) + 5;

    doc.setFontSize(14);
    const titulo = 'Enfermeiros(as) Alunos(as)';
    const tituloWidth = doc.getTextWidth(titulo);
    const tituloXPosition = (pageWidth - tituloWidth) / 2;
    doc.text(titulo, tituloXPosition, yPosition);
    yPosition += 8;

    doc.setLineWidth(0.5);
    doc.line(14, yPosition, pageWidth - 14, yPosition);
    yPosition += 8;

    const tableData = alunas.map(a => [
      a.nome || '-',
      a.cpf || '-',
      formatarTelefone(a.telefone),
      a.email || '-',
      a.municipio || '-',
      a.instrutora_nome || '-',
      a.status || '-',
      `${a.progresso || 0}%`
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Nome', 'CPF', 'Telefone', 'Email', 'Município', 'Instrutor(a)', 'Status', 'Progresso']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [45, 122, 79],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 35 },
        5: { cellWidth: 35 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 }
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(nomeArquivo);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
};

export const exportarPacientesCapacitacaoCSV = (pacientes: any[], nomeArquivo: string = 'pacientes_capacitacao.csv') => {
  if (!pacientes || pacientes.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  const headers = ['Nome', 'CPF', 'Cartão SUS', 'Data de Nascimento', 'Município'];

  const cabecalhoInstitucional = CABECALHO_INSTITUCIONAL.join('\n') + '\n\n';

  const csvContent = [
    cabecalhoInstitucional,
    headers.join(';'),
    ...pacientes.map(p => [
      `"${p.nome_completo || '-'}"`,
      `"${p.cpf || '-'}"`,
      `"${p.cartao_sus || '-'}"`,
      `"${formatarDataParaExportacao(p.data_nascimento)}"`,
      `"${p.municipio || '-'}"`
    ].join(';'))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportarPacientesCapacitacaoPDF = async (pacientes: any[], nomeArquivo: string = 'pacientes_capacitacao.pdf') => {
  if (!pacientes || pacientes.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }

  try {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF() as any;

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    CABECALHO_INSTITUCIONAL.forEach((linha, index) => {
      const textWidth = doc.getTextWidth(linha);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(linha, xPosition, yPosition + (index * 7));
    });

    yPosition += (CABECALHO_INSTITUCIONAL.length * 7) + 5;

    doc.setFontSize(14);
    const titulo = 'Pacientes de Capacitação';
    const tituloWidth = doc.getTextWidth(titulo);
    const tituloXPosition = (pageWidth - tituloWidth) / 2;
    doc.text(titulo, tituloXPosition, yPosition);
    yPosition += 8;

    doc.setLineWidth(0.5);
    doc.line(14, yPosition, pageWidth - 14, yPosition);
    yPosition += 8;

    const tableData = pacientes.map(p => [
      p.nome_completo || '-',
      p.cpf || '-',
      p.cartao_sus || '-',
      formatarDataParaExportacao(p.data_nascimento),
      p.municipio || '-'
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Nome', 'CPF', 'Cartão SUS', 'Data de Nascimento', 'Município']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [45, 122, 79],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 35 },
        4: { cellWidth: 30 }
      },
      margin: { left: 14, right: 14 }
    });

    doc.save(nomeArquivo);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert('Erro ao gerar PDF. Por favor, tente novamente.');
  }
};
