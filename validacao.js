// validacao.js — Regras de validação dos endpoints

function validarAgendamento(dados, parcial = false) {
  const erros = [];

  if (!parcial || dados.nomePet !== undefined) {
    if (!dados.nomePet || dados.nomePet.trim().length < 2)
      erros.push({ campo: 'nomePet', mensagem: 'Nome do pet deve ter pelo menos 2 caracteres.' });
    else if (dados.nomePet.trim().length > 50)
      erros.push({ campo: 'nomePet', mensagem: 'Nome do pet deve ter no máximo 50 caracteres.' });
  }

  if (!parcial || dados.tutor !== undefined) {
  if (!dados.tutor || dados.tutor.trim().length < 3)
    erros.push({ campo: 'tutor', mensagem: 'Nome do tutor deve ter pelo menos 3 caracteres.' });
  else if (dados.tutor.trim().length > 100)
    erros.push({ campo: 'tutor', mensagem: 'Nome do tutor deve ter no máximo 100 caracteres.' });
}

  if (!parcial || dados.telefone !== undefined) {
    const nums = (dados.telefone || '').replace(/\D/g, '');
    if (nums.length < 9 || nums.length > 13)
      erros.push({ campo: 'telefone', mensagem: 'Telefone deve ter entre 9 e 13 dígitos.' });
  }

  const servicosValidos = ['banho', 'tosa', 'banho-tosa'];
  if (!parcial || dados.servico !== undefined) {
    if (!servicosValidos.includes(dados.servico))
      erros.push({ campo: 'servico', mensagem: `Serviço inválido. Use: ${servicosValidos.join(', ')}.` });
  }

  const portesValidos = ['pequeno', 'medio', 'grande'];
  if (!parcial || dados.porte !== undefined) {
    if (!portesValidos.includes(dados.porte))
      erros.push({ campo: 'porte', mensagem: `Porte inválido. Use: ${portesValidos.join(', ')}.` });
  }

  if (!parcial || dados.data !== undefined) {
    if (!dados.data || !/^\d{4}-\d{2}-\d{2}$/.test(dados.data)) {
      erros.push({ campo: 'data', mensagem: 'Data inválida. Use o formato YYYY-MM-DD.' });
    } else {
      const hoje = new Date(); hoje.setHours(0,0,0,0);
      const dataReq = new Date(dados.data + 'T00:00:00');
      if (dataReq < hoje)
        erros.push({ campo: 'data', mensagem: 'A data não pode ser no passado.' });
    }
  }

  const horariosValidos = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'];
  if (!parcial || dados.horario !== undefined) {
    if (!horariosValidos.includes(dados.horario))
      erros.push({ campo: 'horario', mensagem: `Horário inválido. Use: ${horariosValidos.join(', ')}.` });
  }

  const statusValidos = ['agendado', 'concluido', 'cancelado'];
  if (dados.status !== undefined && !statusValidos.includes(dados.status))
    erros.push({ campo: 'status', mensagem: `Status inválido. Use: ${statusValidos.join(', ')}.` });

  return erros;
}

module.exports = { validarAgendamento };
