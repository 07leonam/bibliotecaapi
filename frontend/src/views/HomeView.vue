<template>
  <div class="dashboard">
    <div class="welcome-header">
      <h1>👋 Olá, Bibliotecário!</h1>
      <p>Painel de controle e monitoramento de estoque.</p>
    </div>

    <div class="stats-grid">
      <div class="card" @click="$router.push('/livros')">
        <div class="card-icon">📚</div>
        <div class="card-info">
          <h3>Títulos</h3>
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
          <h3>Empréstimos</h3>
          <p class="number">{{ emprestimosAtivos }}</p>
        </div>
      </div>
    </div>

    <div class="section-container">
      <div class="filter-bar">
        <div class="filter-label">
          <span class="icon">🔍</span>
          <label for="filtro-genero">Filtrar por Gênero:</label>
        </div>
        
        <div class="select-wrapper">
          <select id="filtro-genero" v-model="filtroAtivo" class="filter-select">
            <option :value="null">Todos os Gêneros</option>
            <option v-for="(qtd, genero) in livrosPorGenero" :key="genero" :value="genero">
              {{ genero }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="section-container">
      <div class="stock-header-row">
        <h2>📦 Estoque: <span class="highlight">{{ filtroAtivo ? filtroAtivo : 'Geral' }}</span></h2>
        <span class="count-badge">{{ livrosFiltrados.length }} livros</span>
      </div>
      
      <div class="stock-grid">
        <div v-for="livro in livrosFiltrados" :key="livro.id" class="stock-card">
          <div class="stock-header">
            <span class="stock-title">{{ livro.titulo }}</span>
            <span class="stock-type">{{ livro.tipo || 'Geral' }}</span>
          </div>
          <div class="stock-footer">
            <span class="stock-label">Qtd:</span>
            <span :class="['stock-qtd', livro.quantidade < 3 ? 'low-stock' : 'good-stock']">
              {{ livro.quantidade }}
            </span>
          </div>
        </div>
        
        <p v-if="livrosFiltrados.length === 0" class="empty-msg">Nenhum livro encontrado.</p>
      </div>
    </div>

    <div class="quick-actions">
      <h2>Acesso Rápido</h2>
      <div class="actions-grid">
        <button @click="$router.push('/livros/novo')" class="action-btn">➕ Cadastrar Livro</button>
        <button @click="$router.push('/emprestimos')" class="action-btn">📝 Novo Empréstimo</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLivroStore } from '../stores/livros';
import { useAlunoStore } from '../stores/alunos';
import { useEmprestimoStore } from '../stores/emprestimos';

const livroStore = useLivroStore();
const alunoStore = useAlunoStore();
const emprestimoStore = useEmprestimoStore();

const filtroAtivo = ref(null);

const emprestimosAtivos = computed(() => {
  return emprestimoStore.emprestimos.filter(e => !e.data_devolucao).length;
});

const livrosPorGenero = computed(() => {
  const stats = {};
  livroStore.livros.forEach(livro => {
    let genero = livro.tipo || 'Outros';
    genero = genero.charAt(0).toUpperCase() + genero.slice(1);
    if (!stats[genero]) stats[genero] = 0;
    stats[genero]++;
  });
  return stats;
});

const livrosFiltrados = computed(() => {
  if (!filtroAtivo.value) return livroStore.livros;
  return livroStore.livros.filter(livro => {
    let g = livro.tipo || 'Outros';
    g = g.charAt(0).toUpperCase() + g.slice(1);
    return g === filtroAtivo.value;
  });
});

onMounted(() => {
  livroStore.buscarLivros();
  alunoStore.buscarAlunos();
  emprestimoStore.buscarEmprestimos();
});
</script>

