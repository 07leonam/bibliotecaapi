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
  return livroStore.livros.filter(l => l.disponivel == 1);
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

<style scoped>
.page-container { padding: 20px; }
h1 {text-align: center; margin-bottom: 30px;}
.form-card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 500px; margin-bottom: 30px; margin: 0 auto 30px auto; }
.form-emprestimo { display: flex; flex-direction: column; gap: 15px; }
.campo { display: flex; flex-direction: column; }
select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }

.btn-acao { background: #007bff; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold; }
.btn-devolver { background: #ff9800; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }

table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #eee; }

.pendente { color: red; font-weight: bold; }
.devolvido { color: green; }
</style>