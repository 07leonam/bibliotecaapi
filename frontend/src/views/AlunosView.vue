<template>
  <div class="page-container">
    <h1>👥 Gerenciar Alunos</h1>

    <div class="form-container">
      <h3>Novo Aluno</h3>
      <form @submit.prevent="salvar" class="form-inline">
        <input v-model="aluno.nome" type="text" placeholder="Nome Completo" required />
        <input v-model="aluno.matricula" type="text" placeholder="Matrícula" required />
        <input v-model="aluno.email" type="email" placeholder="Email" required />
        <button type="submit" class="btn-add">Cadastrar</button>
      </form>
    </div>

    <hr />
    <table v-if="store.alunos.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Matrícula</th>
          <th>Email</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in store.alunos" :key="a.id">
          <td>{{ a.id }}</td>
          <td>{{ a.nome }}</td>
          <td>{{ a.matricula }}</td>
          <td>{{ a.email }}</td>
        <td>
            <button @click="$router.push(`/alunos/editar/${a.id}`)" class="btn-editar">
            Editar
            </button>
  
            <button @click="store.excluirAluno(a.id)" class="btn-delete">
            Excluir
            </button>
        </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Nenhum aluno cadastrado.</p>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useAlunoStore } from '../stores/alunos';

const store = useAlunoStore();

const aluno = reactive({ nome: '', matricula: '', email: '' });

onMounted(() => {
  store.buscarAlunos();
});

async function salvar() {
  await store.cadastrarAluno(aluno);
  aluno.nome = '';
  aluno.matricula = '';
  aluno.email = '';
}
</script>

<style scoped>
.page-container { padding: 20px; }
.form-container { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
.form-inline { display: flex; gap: 10px; flex-wrap: wrap; }
input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex: 1; }
.btn-add { background: #28a745; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px; }
.btn-delete { background: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #eee; }
</style>