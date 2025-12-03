import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LivrosView from '../views/LivrosView.vue'
import LivroCadastroView from '../views/LivroCadastroView.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/livros', name: 'livros', component: LivrosView },
    
    { path: '/livros/novo', name: 'livro-novo', component: LivroCadastroView }
  ]
})

export default router