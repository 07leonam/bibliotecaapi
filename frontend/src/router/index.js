import { createRouter, createWebHistory } from 'vue-router'
// Importamos a HomeView (que vamos criar no próximo passo)
import HomeView from '../views/HomeView.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
    // A rota de /livros vamos adicionar depois de criar a tela de livros
  ]
})

export default router