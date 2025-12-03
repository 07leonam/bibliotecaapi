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
const livro = reactive({
  id: null,
  titulo: '',
  autor: '',
  ano: ''
});

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

<style scoped>
.page-container { padding: 20px; max-width: 600px; margin: 0 auto; }
.form-cadastro { display: flex; flex-direction: column; gap: 15px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.form-group { display: flex; flex-direction: column; }
label { font-weight: bold; margin-bottom: 5px; }
input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.actions { display: flex; gap: 10px; margin-top: 10px; }
.btn-salvar { background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; flex: 1; }
.btn-cancelar { background-color: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
</style>