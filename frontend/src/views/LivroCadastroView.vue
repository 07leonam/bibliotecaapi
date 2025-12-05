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
        <label>Tipo (Gênero):</label>
        <input v-model="livro.tipo" type="text" placeholder="Ex: Romance, Técnico..." required />
      </div>

      <div class="form-group">
        <label>Ano:</label>
        <input v-model="livro.ano" type="number" required placeholder="Ex: 1899" />
      </div>

      

      <div class="form-group">
        <label>Quantidade (Estoque):</label>
        <input v-model="livro.quantidade" type="number" min="1" required />

        <div class="actions">
          <button type="button" @click="$router.push('/livros')" class="btn-cancelar">Cancelar</button>
          <button type="submit" class="btn-salvar">Salvar</button>
        </div>


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
  ano: '',
  tipo: '',
  quantidade: 1
});

async function salvarLivro() {
  await store.cadastrarLivro(livro);

  router.push('/livros');
}
</script>

