<template>
  <div class="page-container">
    <h1>Novo Livro</h1>
    
    <form @submit.prevent="salvarLivro" class="form-cadastro">
      <div class="form-group">
        <label>Título:</label>
        <input v-model="livro.titulo" type="text" required placeholder="Ex: Dom Casmurro" />
      </div>

      <div class="form-group">
        <label>Autor:</label>
        <input v-model="livro.autor" type="text" required placeholder="Ex: Machado de Assis" />
      </div>

      <div class="form-group">
        <label>Ano:</label>
        <input v-model="livro.ano" type="number" required placeholder="Ex: 1899" />
      </div>

      <div class="actions">
        <button type="button" @click="$router.push('/livros')" class="btn-cancelar">Cancelar</button>
        <button type="submit" class="btn-salvar">Salvar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useLivroStore } from '../stores/livros';
import { useRouter } from 'vue-router';

const store = useLivroStore();
const router = useRouter();

const livro = reactive({
  titulo: '',
  autor: '',
  ano: ''
});

async function salvarLivro() {
  await store.cadastrarLivro(livro);
  
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
.btn-salvar { background-color: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; flex: 1; }
.btn-cancelar { background-color: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
</style>