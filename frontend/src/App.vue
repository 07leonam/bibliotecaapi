<template>
  <div class="app-container">
    <header>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/livros">Livros</router-link> |
        <router-link to="/alunos">Alunos</router-link> |
        <router-link to="/emprestimos">Empréstimos</router-link> 
      </nav>
    </header>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
/* Reset básico e estilos globais */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; }

.app-container { max-width: 900px; margin: 0 auto; padding: 20px; }

header { background-color: #2c3e50; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
nav a { color: white; text-decoration: none; font-weight: bold; margin-right: 15px; font-size: 18px; }
nav a:hover { text-decoration: underline; }
nav a.router-link-active { color: #42b883; }
</style>