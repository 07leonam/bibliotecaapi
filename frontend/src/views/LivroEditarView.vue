<template>
  <div class="page-container">
    <h1>Editar Livro</h1>
    
    <form @submit.prevent="salvarAlteracoes" class="form-cadastro">
      <div class="form-group">
        <label>Título:</label>
        <input v-model="livro.titulo" type="text" required />
      </div>

      <div class="form-group">
        <label>Autor:</label>
        <input v-model="livro.autor" type="text" required />
      </div>

      <div class="form-group">
        <label>Ano:</label>
        <input v-model="livro.ano" type="number" required />
      </div>

      <div class="actions">
        <button type="button" @click="$router.push('/livros')" class="btn-cancelar">Cancelar</button>
        <button type="submit" class="btn-salvar">Salvar Alterações</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useLivroStore } from '../stores/livros'; 
import { useRouter, useRoute } from 'vue-router';
import api from '../services/api';

const store = useLivroStore();
const router = useRouter();
const route = useRoute(); 
const livro = reactive({ id: null, titulo: '', autor: '', ano: '', tipo: '', quantidade: 1 });

onMounted(async () => {
  const id = route.params.id; 
  try {
    const response = await api.get(`/livros`);
    const livroEncontrado = response.data.find(l => l.id == id);
    
if (livroEncontrado) {
  livro.id = livroEncontrado.id;
  livro.titulo = livroEncontrado.titulo;
  livro.autor = livroEncontrado.autor;
  livro.ano = livroEncontrado.ano;
  livro.tipo = livroEncontrado.tipo;            
  livro.quantidade = livroEncontrado.quantidade; 
} else {
      alert("Livro não encontrado!");
      router.push('/livros');
    }
  } catch (error) {
    console.error("Erro ao carregar livro", error);
  }
});

async function salvarAlteracoes() {
  await store.atualizarLivro(livro);
  router.push('/livros');
}
</script>

