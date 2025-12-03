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

