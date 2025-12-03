import { defineStore } from 'pinia';
import api from '../services/api';

export const useAlunoStore = defineStore('aluno', {
  state: () => ({
    alunos: []
  }),
  actions: {
    async buscarAlunos() {
      try {
        const response = await api.get('/alunos');
        this.alunos = response.data;
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    },

    async cadastrarAluno(novoAluno) {
      try {
        await api.post('/alunos', novoAluno);
        await this.buscarAlunos(); // Atualiza a lista na hora
        alert("Aluno cadastrado!");
      } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar aluno.");
      }
    },

    async excluirAluno(id) {
        if(!confirm("Excluir este aluno?")) return;
        try {
            await api.delete(`/alunos/${id}`);
            this.alunos = this.alunos.filter(a => a.id !== id);
            alert("Aluno removido!");
        } catch (error) {
            console.error("Erro ao excluir:", error);
        }
    }
  }
});