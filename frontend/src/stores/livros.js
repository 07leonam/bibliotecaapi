import { defineStore } from 'pinia';
import api from '../services/api';

export const useLivroStore = defineStore('livro', {
  // State: Onde os dados ficam guardados
  state: () => ({
    livros: []
  }),

  // Actions: As funções que chamam o Back-end
  actions: {
    // 1. Buscar todos os livros (GET)
    async buscarLivros() {
      try {
        const response = await api.get('/livros');
        this.livros = response.data;
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
        // Não vamos alertar erro aqui para não irritar o usuário se a lista estiver vazia
      }
    },

    // 2. Cadastrar novo livro (POST)
    async cadastrarLivro(novoLivro) {
      try {
        await api.post('/livros', novoLivro);
        await this.buscarLivros(); // Atualiza a lista na hora
        alert("Livro cadastrado com sucesso!");
      } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar livro.");
      }
    },
    
    // 3. Excluir livro (DELETE)
    async excluirLivro(id) {
        // Pergunta antes de apagar
        if(!confirm("Tem certeza que deseja excluir este livro?")) return;
        
        try {
            await api.delete(`/livros/${id}`);
            // Remove da lista visualmente
            this.livros = this.livros.filter(livro => livro.id !== id);
            alert("Livro excluído!");
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir livro.");
        }
    }
  }
});