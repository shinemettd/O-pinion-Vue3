<template>
    <nav :class="['navbar', { 'sticky': isSticky }]">
      <div class="container">
        <!--navbar element-->
        <div class="navbar-menu">
          <router-link to="/" class="navbar-brand" style = "font-size: 25px">O!pinion</router-link>
          <div class = "navbar-tabs">
            <router-link to="/hello-world" class="navbar-item">Hello World</router-link>
            <router-link to="/test-article" class="navbar-item">Test Article</router-link>
          </div>

          <!-- Other link in navbar -->
        </div>
        <!--Search button-->
        <div class="search-container">
          <!--Filter button-->
          <button @click="toggleFilter" class="filter-button"><i class="fas fa-filter"></i></button>
          <input type="text" placeholder="Поиск..." class="search-input" v-model="searchQuery">
          <button @click="search" class="search-button"><i class="fas fa-search"></i></button>
        </div>

      <div>
        <router-link to="/notification" class="burger-button"><i class="fas fa-bell"></i></router-link>
        <router-link to="/create-Article" class="burger-button"><i class="fas fa-plus"></i></router-link>

        <button @click="toggleMenu" class="burger-button">☰</button>

        <div :class="['menu', { 'is-open': isMenuOpen }]">
          <router-link to="/person" class="menu-item"><i class="fas fa-user"></i>Личный кабинет</router-link>
          <router-link to="/auth" class="menu-item"><i class="fas fa-sign-in-alt"></i>войти</router-link>
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
      searchQuery: '', // variable to save request
      isSticky: false

    };
  }, mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    search() {
      console.log('Поиск по запросу:', this.searchQuery);
      // Logic how to search
    },
    toggleFilter() {
      // Logic how to filter search
      console.log('Переключение фильтра');
    },
  };
  </script>

  <style scoped>
  .navbar {
    transition: top 30ms;
    width: 100%;
    z-index: 1000;
    background-color: #350454;
    color: white;
    padding: 5px 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .sticky {
    position: fixed;
    top: 0;
    left: 0;
    background-color: #350454;
    color: white;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
    flex-direction: row;
    align-items: center;
  }

  .navbar-tabs {
    display: flex;
    align-items: center;
    margin-top: 5px;
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
    padding: 10px 10px;
    right: -250px;
    width: 250px;
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
  .search-container {
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .search-input {
    flex: 1;
    padding: 5px;
    margin-right: 5px;
  }

  .search-button {
    padding: 5px 10px;
  }

  .search-button i {
    margin-right: 0;
  }
  .filter-button {
    padding: 3px 3px;
  }

  .filter-button i {
    margin-right: 5px;
  }

  </style>
