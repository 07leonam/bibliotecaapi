<template>
  <div class="page-container">
    <div class="header">
      <h1>📚 Gerenciar Livros</h1>
      <button @click="$router.push('/livros/novo')" class="btn-add">Adicionar Novo</button>
    </div>

    <p v-if="store.livros.length === 0">Nenhum livro encontrado ou carregando...</p>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Autor</th>
          <th>Tipo</th>
          <th>Qtd</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="livro in store.livros" :key="livro.id">
          <td>{{ livro.id }}</td>
          <td>{{ livro.titulo }}</td>
          <td>{{ livro.autor }}</td>
          <td>{{ livro.tipo }}</td>
          <td>{{ livro.quantidade }}</td>
          <td>
            <span :class="livro.quantidade > 0 ? 'tag-verde' : 'tag-vermelha'">
              {{ livro.quantidade > 0 ? 'Disponível' : 'Indisponível' }}
            </span>
          </td>
          <td>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useLivroStore } from '../stores/livros.js';

const store = useLivroStore();

onMounted(() => {
  store.buscarLivros();
});
</script>
