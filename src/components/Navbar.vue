<template>
  <div>
    <nav :class="['navbar']">
      <div class="container">
        <div class="navbar-menu">
          <router-link to="/" class="navbar-brand" style="font-size: 25px ">O!pinion</router-link>
        </div>
        <div v-if = "width > 768" class="search-container">
          <input type="text" placeholder="Поиск..." class="search-input" v-model="searchQuery" @input="search">
          <button @click.prevent="search" class="search-button"><i class="fas fa-search elevation-24"></i></button>
        </div>
        <div class="search-results" v-if="searchQuery.trim().length > 0 && width > 768">
            <ul v-if="searchResults.length > 0">
                <li v-for="result in searchResults" :key="result.id">
                    <img :src="result.cover_image" alt="img" v-if="result.cover_image" style="max-width: 50px; max-height: 50px; margin: 0 5px 5px 0">
                    <img v-if="!result.cover_image" src="/icons/search-icon.png" alt="img" style="margin: 0 5px 5px 23px;">
                    <a :href="'http://opinion.home.kg/article/' + result.id">{{ result.title }}</a>
                </li>
            </ul>
          <div class="no-results" v-if="searchResults.length === 0">
            По запросу '{{ searchQuery }}' ничего не найдено 🫤
          </div>
        </div>
        <div>
          <div v-if="store.state.isAuthorized">
            <router-link v-if="store.state.isAuthorized && width > 768" to="/saved-content" class="burger-button" title="Избранное"><i class="fas fa-heart"></i></router-link>
              <router-link v-if="store.state.isAuthorized && width > 768" to="/notifications" class="burger-button"><i class="fas fa-bell"
                :title="((store.state.notificationCount === 0) ? 'Нет новых уведомлений'
                : (store.state.notificationCount % 10 === 1 && ((store.state.notificationCount - 11) % 10 === 0))
                ? store.state.notificationCount + ' новое уведомление'
                : store.state.notificationCount + ' новых уведомлений')"></i>
                <span :class="store.state.notificationCount > 0 ? 'new-notification' : ''"></span>
              </router-link>
            <router-link v-if="store.state.isAuthorized && width > 768" to="/create-article" class="burger-button" title="Создать статью"><i class="fas fa-plus"></i></router-link>
            <button v-if="store.state.isAuthorized" @click="toggleMenu" class="burger-button1">☰</button>
          </div>
          <div v-else>
            <v-btn class = "ml-4" @click="router.push('/auth')" variant="outlined"> Войти </v-btn>
          </div>
          <div :class="['menu', { 'is-open': isMenuOpen }]">
            <p class="pb-2" v-if="store.state.isAuthorized">Вы авторизованы как:
              <li>{{ store.state.nickname }}</li>
            </p>
            <p v-else>В данный момент вы не авторизованы</p>
            <hr>
            <router-link :to="'/user/' + store.state.nickname" class="menu-item" v-if="store.state.isAuthorized"
                         @click="isMenuOpen = false"><i class="fas fa-user"></i>Моя страница
            </router-link>
            <router-link to="/" class="menu-item" @click="isMenuOpen = false"><i class="fas fa-home"></i>Главная
            </router-link>
            <router-link v-if="!store.state.isAuthorized" to="/auth" class="menu-item" @click="isMenuOpen = false"><i
              class="fas fa-sign-in-alt"></i>Войти
            </router-link>
            <router-link to="/notifications" class="menu-item" @click="isMenuOpen = false"><i class="fas fa-bell"></i>Уведомления {{store.state.notificationCount > 0 ? `(${store.state.notificationCount})` : ''}}</router-link>
            <router-link to="/create-article" class="menu-item" @click="isMenuOpen = false"><i class="fas fa-plus"></i>Создать
              статью
            </router-link>
            <router-link to="/settings" class="menu-item" @click="isMenuOpen = false"><i class="fas fa-user-cog"></i>Настройки
            </router-link>
            <router-link to="/about" class="menu-item" @click="isMenuOpen = false"> <i class="fas fa-info-circle"></i>О нас
            </router-link>
            <router-link v-if="store.state.isAuthorized" to="/" class="menu-item"
                         @click="() => { isMenuOpen = false; store.commit('logout'); }"><i class="fas fa-sign-in-alt"></i>Выйти
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import router from "@/plugins/router";
import { useDisplay } from 'vuetify'
import store from "@/store/store";
const { width } = useDisplay()
</script>

<script>
import store from "@/store/store";
import axios from 'axios'
import router from "@/plugins/router";

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
      isSticky: false,
      searchResults: [],
      showSearchModal: false
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    router() {
      return router
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    async search() {
      try {
        if (this.searchQuery.trim() === '') {
          return;
        }

        const response = await axios.get(`${store.state.API_URL}/api/articles/search`, {
          params: {
            query: this.searchQuery
          }
        });

        if (response.data.content && response.data.content.length > 0) {
          this.searchResults = response.data.content;
        } else {
          this.searchResults = [];
          this.showSearchModal = false;
        }
      } catch (error) {
        console.error('Ошибка при поиске статей:', error);
      }
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
  z-index: 999;
  background: linear-gradient(21deg, #6b1e6e, #5611ec);
  color: #f6f6f6;
  padding: 13px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-content: center;
  position: fixed;
}

.sticky {
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(21deg, #6b1e6e, #5611ec);
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.new-notification {
  background: red;
  color: white;
  border-radius: 50%;
  top: 0.45em;
  right: 4.15em;
  width: 0.55em;
  height: 0.55em;
  position: absolute;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.navbar-brand {
  padding-left: 12px;
  font-weight: bold;
  font-size: 25px;
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
  margin-top: 15px;
  border-radius: 3px;
  position: fixed;
  padding: 10px;
  right: -270px;
  width: 250px;
  background: linear-gradient(21deg, #6b1e6e, #5611ec);
  transition: right 0.3s;
  z-index: 1000;
}

.menu.is-open {
  right: -13px;
}

.menu-item {
  display: block;
  padding: 10px;
  margin-left: 20px;
}

.menu-item i {
  margin-right: 8px;
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

.search-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 5px 10px;
    width: 24em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-height: 20vh;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 8px;
    font-size: 16px;
}

.no-results {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.search-results {
    position: absolute;
    top: 3em;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    background-color: #fff;
    border: 2px solid #ccc;
    border-top: none;
    border-radius: 0 0 5px 5px;
    width: 24em;
    max-height: 200px;
    min-height: 200px;
    overflow-y: auto;
    color: #070607;
}

.search-results ul {
    list-style-type: none;
    padding: 0;
}

.search-results li {
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.search-results li:last-child {
    border-bottom: none;
}


@media (max-width: 600px) {
  .menu.is-open{
    width: 100%;
    padding: 20px;
  }

  .menu {
    width: 90%;
    padding: 20px;
  }
}

@media (max-width: 768px) {

  .menu {
    margin-top: 0.5em;
    border-radius: 3px;
    position: fixed;
    right: -400px;
    background: linear-gradient(21deg, #6b1e6e, #5611ec);
    transition: right 0.3s;
    z-index: 1000;
    width: 50%;
    text-align: center;
    font-size: 1.5em;
  }

  .search-container {
    margin-top: 10px;
    width: 17em;
  }

  .search-results {
    width: 17em;
  }

  .navbar-brand {
    padding-bottom: 10px;
  }

  .burger-button {
    margin-left: 14px;
  }

  .burger-button1 {
    margin-left: 8px;
  }

  .menu.is-open .burger-button1 {
    font-size: 16px;
  }


  .menu.is-open {
    right: 0%;
  }

  .menu-item {
    margin: 10px 0;
  }
}
</style>
