<template>
    <nav class="navbar">
      <div class="container">
        <router-link to="/" class="navbar-brand">Habr</router-link>
        <div class="navbar-menu">
          <router-link to="/technology" class="navbar-item">Технологии</router-link>
          <router-link to="/science" class="navbar-item">Наука</router-link>
          <router-link to="/popular" class="navbar-item">Популярное</router-link>
          <!-- Дополнительные ссылки и элементы -->
        </div>
      </div>
    </nav>
  </template>



  <script>
  export default {
    name: 'Navbar'
  }
  </script>
  
  <style scoped>
  .navbar {
    background-color: #22031e;
    color: white;
    padding: 10px 20px;
  }
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .navbar-brand {
    font-weight: bold;
    color: white;
  }
  .navbar-menu {
    display: flex;
  }
  .navbar-item {
    margin-left: 20px;
    color: white;
    text-decoration: none;
  }
  </style>
  