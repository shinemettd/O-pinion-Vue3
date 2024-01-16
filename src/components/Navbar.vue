<template>
  <nav class="navbar-head">
    <router-link to="/" class="navbar-brand">O!Opinion</router-link>
  </nav>
    <nav class="navbar">
      <div class="container">
        <div class="navbar-menu">
          <router-link to="/hello-world" class="navbar-item">Hello World</router-link>
          <router-link to="/test-article" class="navbar-item">Test Article</router-link>
          <router-link to="/technology" class="navbar-item">Технологии</router-link>
          <router-link to="/science" class="navbar-item">Наука</router-link>
          <router-link to="/popular" class="navbar-item">Популярное</router-link>
          <!-- Other link in navbar -->
        </div>
        <div>
          <router-link to="/notification" class="burger-button"><i class="fas fa-bell"></i></router-link>
          <router-link to="/create-Article" class="burger-button"><i class="fas fa-plus"></i></router-link>
          <button @click="toggleMenu" class="burger-button">☰</button>
          <div :class="['menu', { 'is-open': isMenuOpen }]">
            <router-link to="/person" class="menu-item"><i class="fas fa-user"></i>Личный кабинет</router-link>
            <router-link to="/" class="menu-item"><i class="fas fa-home"></i> Главная</router-link>
            <router-link to="/about" class="menu-item"><i class="fas fa-info-circle"></i> О нас</router-link>
            <router-link to="/notification" class="menu-item"><i class="fas fa-bell"></i> Уведомление</router-link>
            <router-link to="/create-Article" class="menu-item"><i class="fas fa-plus"></i> Создать статью</router-link>
            <!-- Other link into menu -->
          </div>
        </div>
      </div>
    </nav>
  </template>



  <script>
  export default {
    name: 'Navbar',
    data() {
      return {
        isMenuOpen: false,
      };
    },
    methods: {
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
    },
  };
  </script>

  <style scoped>
  .navbar {
    background-color: #350454;
    color: white;
    padding: 15px 20px;
  }
  .navbar-head {
    background-color: #22031e;
    color: white;
    padding: 15px 20px;
  }
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .navbar-brand {
    margin-left: 20px;
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
  .burger-button {
    margin-left: 20px;
    color: white;
    text-decoration: none;
  }

  .menu {
    position: fixed;
    top: 15%;
    right: -250px;
    width: 200px;
    height: 50%;
    background-color: #1e066e;
    transition: right 0.3s;
    z-index: 1000;
  }

  .menu.is-open {
    right: 20px;
  }

  .menu-item {
    display: block;
    padding: 10px;
    margin-left: 20px;
    color: white;
    text-decoration: none;
  }

  .menu-item i {
    margin-right: 8px;
  }
  </style>
