import { createApp } from 'vue'
import { createPinia } from 'pinia' // Importa o Pinia
import App from './App.vue'
import router from './router' // Importa o Router (vamos criar jajá)

const app = createApp(App)

app.use(createPinia()) // Ativa o Pinia
app.use(router)        // Ativa o Router

app.mount('#app')