import { defineStore } from 'pinia';
import api from '../services/api';

export const useLivroStore = defineStore('livro', {
  state: () => ({
    livros: []
  }),

  actions: {
    async buscarLivros() {
      try {
        const response = await api.get('/livros');
        this.livros = response.data;
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      }
    },

    async cadastrarLivro(novoLivro) {
      try {
        await api.post('/livros', novoLivro);
        await this.buscarLivros(); 
        alert("Livro cadastrado com sucesso!");
      } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar livro.");
      }
    },
    
    async excluirLivro(id) {
        if(!confirm("Tem certeza que deseja excluir este livro?")) return;
        
        try {
            await api.delete(`/livros/${id}`);
            this.livros = this.livros.filter(livro => livro.id !== id);
            alert("Livro excluído!");
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir livro.");
        }
    },

    async atualizarLivro(livro) {
      try {
        await api.put(`/livros/${livro.id}`, livro);
        await this.buscarLivros(); 
        alert("Livro atualizado com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar:", error);
        alert("Erro ao atualizar livro.");
      }
    }
    
  }
});