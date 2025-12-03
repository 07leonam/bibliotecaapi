<template>
  <div class="page-container">
    <h1>✏️ Editar Aluno</h1>
    
    <form @submit.prevent="salvar" class="form-card">
      <div class="campo">
        <label>Nome Completo:</label>
        <input v-model="aluno.nome" type="text" required />
      </div>

      <div class="campo">
        <label>Matrícula:</label>
        <input v-model="aluno.matricula" type="text" required />
      </div>

      <div class="campo">
        <label>E-mail:</label>
        <input v-model="aluno.email" type="email" required />
      </div>

      <div class="actions">
        <button type="button" @click="$router.push('/alunos')" class="btn-cancelar">Cancelar</button>
        <button type="submit" class="btn-salvar">Salvar Alterações</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useAlunoStore } from '../stores/alunos';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

const store = useAlunoStore();
const route = useRoute();
const router = useRouter();

const aluno = reactive({ id: null, nome: '', matricula: '', email: '' });

onMounted(async () => {
  // Pega o ID da URL e busca os dados atuais do aluno para preencher o form
  const id = route.params.id;
  try {
    const response = await api.get('/alunos');
    const alunoEncontrado = response.data.find(a => a.id == id);
    
    if (alunoEncontrado) {
      aluno.id = alunoEncontrado.id;
      aluno.nome = alunoEncontrado.nome;
      aluno.matricula = alunoEncontrado.matricula;
      aluno.email = alunoEncontrado.email;
    } else {
      alert("Aluno não encontrado");
      router.push('/alunos');
    }
  } catch (error) {
    console.error("Erro ao carregar dados", error);
  }
});

async function salvar() {
  await store.atualizarAluno(aluno);
  router.push('/alunos');
}
</script>

<style scoped>
.page-container { padding: 20px; text-align: center; }
.form-card { max-width: 500px; margin: 0 auto; text-align: left; }
.actions { display: flex; gap: 10px; margin-top: 15px; }
.btn-salvar { flex: 1; }
</style>