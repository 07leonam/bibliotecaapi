<template>
  <div class="page-container">
    <h1>📅 Controle de Empréstimos</h1>

    <div class="form-card">
      <h3>Novo Empréstimo</h3>
      <form @submit.prevent="salvar" class="form-emprestimo">
        
        <div class="campo">
          <label>Aluno:</label>
          <select v-model="form.aluno_id" required>
            <option value="" disabled>Selecione um aluno</option>
            <option v-for="aluno in alunoStore.alunos" :key="aluno.id" :value="aluno.id">
              {{ aluno.nome }}
            </option>
          </select>
        </div>

        <div class="campo">
          <label>Livro (Disponíveis):</label>
          <select v-model="form.livro_id" required>
            <option value="" disabled>Selecione um livro</option>
            <option v-for="livro in livrosDisponiveis" :key="livro.id" :value="livro.id">
              {{ livro.titulo }}
            </option>
          </select>
        </div>

        <button type="submit" class="btn-acao">Registrar Saída</button>
      </form>
    </div>

    <hr />
    <h3>Histórico</h3>
    <table v-if="emprestimoStore.emprestimos.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Livro</th>
          <th>Aluno</th>
          <th>Data Saída</th>
          <th>Data Devolução</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in emprestimoStore.emprestimos" :key="emp.id">
          <td>{{ emp.id }}</td>
          <td>{{ emp.livro_titulo }}</td>
          <td>{{ emp.aluno_nome }}</td>
          <td>{{ new Date(emp.data_emprestimo).toLocaleString() }}</td>
          <td>
            <span v-if="emp.data_devolucao" class="devolvido">
              {{ new Date(emp.data_devolucao).toLocaleString() }}
            </span>
            <span v-else class="pendente">Pendente</span>
          </td>
          <td>
            <button v-if="!emp.data_devolucao" @click="emprestimoStore.devolverLivro(emp.id)" class="btn-devolver">
              Devolver 🔄
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Nenhum empréstimo registrado.</p>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useEmprestimoStore } from '../stores/emprestimos';
import { useLivroStore } from '../stores/livros'; 
import { useAlunoStore } from '../stores/alunos';

const emprestimoStore = useEmprestimoStore();
const livroStore = useLivroStore();
const alunoStore = useAlunoStore();

const form = reactive({
  aluno_id: "",
  livro_id: ""
});


const livrosDisponiveis = computed(() => {
  return livroStore.livros.filter(l => l.quantidade > 0);
});


onMounted(() => {
  emprestimoStore.buscarEmprestimos();
  livroStore.buscarLivros();
  alunoStore.buscarAlunos();
});

async function salvar() {
  const sucesso = await emprestimoStore.realizarEmprestimo(form.livro_id, form.aluno_id);
  if (sucesso) {
    form.aluno_id = "";
    form.livro_id = "";
    livroStore.buscarLivros(); 
  }
}
</script>

