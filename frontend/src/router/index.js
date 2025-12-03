import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LivrosView from '../views/LivrosView.vue'
import LivroCadastroView from '../views/LivroCadastroView.vue'
import LivroEditarView from '../views/LivroEditarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/livros', name: 'livros', component: LivrosView },
    { path: '/livros/novo', name: 'livro-novo', component: LivroCadastroView },
    { path: '/livros/editar/:id', name: 'livro-editar', component: LivroEditarView }
  ]
})

export default router