<template>
  <nav :class="['navbar', { 'sticky': isSticky }]">
    <div class="container">
      <div class="navbar-menu">
        <router-link to="/" class="navbar-brand" style="font-size: 25px ">O!pinion</router-link>
        <div class="navbar-tabs">
          <!-- Здесь могут быть другие элементы навигации -->
        </div>
      </div>
      <div class="search-container">
        <input type="text" placeholder="Поиск..." class="search-input" v-model="searchQuery">
        <button @click.prevent="search" class="search-button"><i class="fas fa-search elevation-24"></i></button>
      </div>
      <div>
        <router-link to="/notification" class="burger-button"><i class="fas fa-bell"></i></router-link>
        <router-link to="/create-article" class="burger-button"><i class="fas fa-plus"></i></router-link>
        <button @click="toggleMenu" class="burger-button1">☰</button>
        <div :class="['menu', { 'is-open': isMenuOpen }]">
          <p class="pb-2" v-if="store.state.isAuthorized">Вы авторизованы как: <li>{{store.state.nickname}}</li></p>
          <p v-else>В данный момент вы не авторизованы</p>
          <hr>
          <router-link :to="'/user/' + store.state.nickname" class="menu-item" v-if="store.state.isAuthorized" @click="isMenuOpen = false"><i class="fas fa-user"></i>Моя страница</router-link>
          <router-link to="/" class="menu-item" @click="isMenuOpen = false"><i class="fas fa-home"></i>Главная</router-link>
          <router-link v-if="!store.state.isAuthorized" to="/auth" class="menu-item" @click="isMenuOpen = false"><i class="fas fa-sign-in-alt"></i>Войти</router-link>
          <router-link to="/about" class="menu-item" @click="isMenuOpen = false"><i class="fas fa-info-circle"></i>О нас</router-link>
          <router-link to="/notification" class="menu-item" @click="isMenuOpen = false"><i class="fas fa-bell"></i>Уведомление</router-link>
          <router-link to="/create-article" class="menu-item" @click="isMenuOpen = false"><i class="fas fa-plus"></i>Создать статью</router-link>
          <router-link v-if="store.state.isAuthorized" to="/" class="menu-item" @click="() => { isMenuOpen = false; store.commit('logout'); }"><i class="fas fa-sign-in-alt"></i>Выйти</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import store from "@/store/store";

export default {
  name: 'Navbar',
  computed: {
    store() {
      return store;
    }
  },
  data() {
    return {
      isMenuOpen: false,
      searchQuery: '',
      isSticky: false
    };
  },
  mounted() {
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
      // Логика поиска
    },
    toggleFilter() {
      console.log('Переключение фильтра');
      // Логика фильтрации
    },
    handleScroll() {
      this.isSticky = window.scrollY > 0;
    }
  }
}
</script>

<style scoped>
.navbar {
  width: 100%;
  z-index: 1000;
  background: linear-gradient(21deg, #6b1e6e, #5611ec);


color: #f6f6f6;
  padding: 13px ;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.sticky {
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(21deg, #6b1e6e, #5611ec);
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
  padding-left: 12px;
  font-weight: bold;
  font-size: 25px; /* Changed font size for mobile */
}

.navbar-menu {
  display: flex;
  align-items: center;
}

.navbar-tabs {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.navbar-item {
  margin-left: 20px;
}

.burger-button {
  margin-left: 20px;
}

.menu {
  margin-top: 25px;
  border-radius: 3px;
  position: fixed;
  padding: 10px;
  right: -250px;
  width: 250px;

  background: linear-gradient(21deg, #6b1e6e, #5611ec);

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
}

.menu-item i {
  margin-right: 8px;
}

.search-container {
  display: flex;
  align-items: center;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

.search-input {
  flex: 1;
  padding: 5px;
  margin-right: 5px;
}

.filter-button {
  padding: 3px 3px;
}

.burger-button1 {
  font-weight: bold;
  margin-left: 20px;
  border-radius: 2px;
  font-size: 20px;
}

.search-button {
  padding: 5px 10px;
  border: none;
  background: transparent;
  cursor: pointer;
}


@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .search-container {
    margin-top: 10px;
  }

  .navbar-brand {
    padding-bottom: 10px;
  }

  .navbar-tabs {
    display: none;
  }

  .burger-button {
    margin-left: 14px;
  }

  .burger-button1 {
    margin-left: 8px;

  }


  @media (max-width: 768px) {

    .menu.is-open .burger-button1 {
      font-size: 16px;
    }
  }


  .menu {
    width: 80%;
    right: -100%;
    padding: 20px;
  }

  .menu.is-open {
    right: 10%;
  }

  .menu-item {
    margin: 10px 0;
  }
}
</style>
