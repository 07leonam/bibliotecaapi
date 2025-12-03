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
          <th>Ano</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="livro in store.livros" :key="livro.id">
          <td>{{ livro.id }}</td>
          <td>{{ livro.titulo }}</td>
          <td>{{ livro.autor }}</td>
          <td>{{ livro.ano }}</td>
          <td>
            <span :class="livro.disponivel ? 'tag-verde' : 'tag-vermelha'">
              {{ livro.disponivel ? 'Disponível' : 'Emprestado' }}
            </span>
          </td>
          <td>
            <button @click="$router.push(`/livros/editar/${livro.id}`)" class="btn-editar">Editar</button>
            <button @click="store.excluirLivro(livro.id)" class="btn-delete">Excluir</button>
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

<style scoped>
.page-container { padding: 20px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
th { background-color: #f4f4f4; }
.btn-delete { background-color: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; }
.tag-verde { color: green; font-weight: bold; background: #e8f5e9; padding: 2px 8px; border-radius: 10px; }
.tag-vermelha { color: red; font-weight: bold; background: #ffebee; padding: 2px 8px; border-radius: 10px; }
.btn-editar { background-color: #007bff; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; margin-right: 5px; }
</style>