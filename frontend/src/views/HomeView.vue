<template>
  <div class="dashboard">
    <div class="welcome-header">
      <h1>👋 Olá, Bibliotecário!</h1>
      <p>Aqui está o resumo do que está acontecendo na sua biblioteca hoje.</p>
    </div>

    <div class="stats-grid">
      
      <div class="card" @click="$router.push('/livros')">
        <div class="card-icon">📚</div>
        <div class="card-info">
          <h3>Livros</h3>
          <p class="number">{{ livroStore.livros.length }}</p>
        </div>
      </div>

      <div class="card" @click="$router.push('/alunos')">
        <div class="card-icon">👥</div>
        <div class="card-info">
          <h3>Alunos</h3>
          <p class="number">{{ alunoStore.alunos.length }}</p>
        </div>
      </div>

      <div class="card active-loans" @click="$router.push('/emprestimos')">
        <div class="card-icon">📅</div>
        <div class="card-info">
          <h3>Empréstimos Ativos</h3>
          <p class="number">{{ emprestimosAtivos }}</p>
        </div>
      </div>

    </div>

    <div class="quick-actions">
      <h2>Acesso Rápido</h2>
      <div class="actions-grid">
        <button @click="$router.push('/livros/novo')" class="action-btn">
          ➕ Cadastrar Livro
        </button>
        <button @click="$router.push('/emprestimos')" class="action-btn">
          📝 Novo Empréstimo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useLivroStore } from '../stores/livros';
import { useAlunoStore } from '../stores/alunos';
import { useEmprestimoStore } from '../stores/emprestimos';

// Importando as stores para pegar os números
const livroStore = useLivroStore();
const alunoStore = useAlunoStore();
const emprestimoStore = useEmprestimoStore();

// Calcula quantos empréstimos ainda não têm data de devolução
const emprestimosAtivos = computed(() => {
  return emprestimoStore.emprestimos.filter(e => !e.data_devolucao).length;
});

// Ao carregar a Home, atualiza todos os dados para os números estarem certos
onMounted(() => {
  livroStore.buscarLivros();
  alunoStore.buscarAlunos();
  emprestimoStore.buscarEmprestimos();
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.welcome-header {
  margin-bottom: 40px;
  text-align: center;
}

.welcome-header h1 {
  font-size: 2.5rem;
  color: var(--secondary-color);
  margin-bottom: 10px;
}

.welcome-header p {
  color: #666;
  font-size: 1.1rem;
}

/* --- CARDS DE ESTATÍSTICA --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 5px solid var(--primary-color);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.card-icon {
  font-size: 3rem;
  background: #f0fdf4;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.card-info h3 {
  margin: 0;
  color: #7f8c8d;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-info .number {
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--secondary-color);
}

/* Estilo especial para o card de Empréstimos */
.active-loans {
  border-left-color: #f39c12;
}
.active-loans .card-icon {
  background: #fef9e7;
}

/* --- BOTÕES DE AÇÃO --- */
.quick-actions h2 {
  font-size: 1.5rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.actions-grid {
  display: flex;
  gap: 15px;
}

.action-btn {
  background-color: var(--secondary-color);
  color: white;
  padding: 15px 25px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s;
}

.action-btn:hover {
  background-color: var(--primary-color);
}
</style>