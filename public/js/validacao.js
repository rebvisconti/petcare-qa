// validacao.js — Regras de validação do formulário
// Cada regra lança uma mensagem específica para facilitar automação de testes

const Validacao = {

  /**
   * Valida todos os campos do formulário.
   * Retorna { valido: boolean, erros: { campo: mensagem } }
   */
  validarFormulario(dados) {
    const erros = {};

    // Nome do pet
    if (!dados.nomePet || dados.nomePet.trim().length === 0) {
      erros.nomePet = 'O nome do pet é obrigatório.';
    } else if (dados.nomePet.trim().length < 2) {
      erros.nomePet = 'O nome deve ter pelo menos 2 caracteres.';
    } else if (dados.nomePet.trim().length > 50) {
      erros.nomePet = 'O nome deve ter no máximo 50 caracteres.';
    }

    // Tutor
    if (!dados.tutor || dados.tutor.trim().length === 0) {
      erros.tutor = 'O nome do tutor é obrigatório.';
    } else if (dados.tutor.trim().length < 3) {
      erros.tutor = 'O nome do tutor deve ter pelo menos 3 caracteres.';
    }
    
    if (!dados.tutor || dados.tutor.trim().length === 0) {
      erros.tutor = 'O nome do tutor é obrigatório.';
    } else if (dados.tutor.trim().length < 3) {
      erros.tutor = 'O nome do tutor deve ter pelo menos 3 caracteres.';
    } else if (dados.tutor.trim().length > 100) {
      erros.tutor = 'O nome do tutor deve ter no máximo 100 caracteres.';
    }

    // Telefone — aceita 9 a 13 dígitos
    const telefoneNumeros = (dados.telefone || '').replace(/\D/g, '');
    if (!dados.telefone || telefoneNumeros.length === 0) {
      erros.telefone = 'O telefone é obrigatório.';
    } else if (telefoneNumeros.length < 9 || telefoneNumeros.length > 13) {
      erros.telefone = 'Informe um telefone válido (9 a 13 dígitos).';
    }

    // Serviço
    if (!dados.servico) {
      erros.servico = 'Selecione um serviço.';
    }

    // Porte
    if (!dados.porte) {
      erros.porte = 'Selecione o porte do pet.';
    }

    // Data — obrigatória e não pode ser no passado
    if (!dados.data) {
      erros.data = 'A data é obrigatória.';
    } else {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataSelecionada = new Date(dados.data + 'T00:00:00');
      if (dataSelecionada < hoje) {
        erros.data = 'A data não pode ser no passado.';
      }
    }

    // Horário
    if (!dados.horario) {
      erros.horario = 'Selecione um horário.';
    }

    return {
      valido: Object.keys(erros).length === 0,
      erros,
    };
  },
};
