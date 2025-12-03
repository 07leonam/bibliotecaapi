import { defineStore } from 'pinia';
import api from '../services/api';

export const useEmprestimoStore = defineStore('emprestimo', {
  state: () => ({
    emprestimos: []
  }),
  actions: {
    // Listar todos os empréstimos
    async buscarEmprestimos() {
      try {
        const response = await api.get('/emprestimos');
        this.emprestimos = response.data;
      } catch (error) {
        console.error("Erro ao buscar empréstimos:", error);
      }
    },

    // Criar novo empréstimo
    async realizarEmprestimo(livro_id, aluno_id) {
      try {
        await api.post('/emprestimos', { livro_id, aluno_id });
        await this.buscarEmprestimos(); // Atualiza a lista
        alert("Empréstimo realizado com sucesso!");
        return true; // Retorna true para avisar a tela que deu certo
      } catch (error) {
        console.error("Erro ao emprestar:", error);
        // O backend manda msg de erro se o livro já estiver emprestado
        alert(error.response?.data?.error || "Erro ao realizar empréstimo.");
        return false;
      }
    },

    // Devolver livro
    async devolverLivro(emprestimo_id) {
        if(!confirm("Confirmar devolução deste livro?")) return;

        try {
            await api.put(`/emprestimos/${emprestimo_id}/devolucao`);
            await this.buscarEmprestimos();
            alert("Livro devolvido!");
        } catch (error) {
            console.error("Erro na devolução:", error);
            alert("Erro ao devolver livro.");
        }
    }
  }
});