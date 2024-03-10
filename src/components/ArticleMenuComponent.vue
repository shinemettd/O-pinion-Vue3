<template>
    <div class="dropdown" v-if="store.state.isAuthorized && (store.state.nickname === authorsNickname)">
            <img src="/icons/three-points-menu.svg" alt="Menu" @click="toggleArticleMenu" class="menu-icon">
            <ul class="article-menu" v-if="articleMenuOpen" @mouseleave="articleMenuOpen = false">
              <li>
                <router-link :to="'/edit-article'">
                  <p>Редактировать статью</p>
                </router-link>
              </li>
              <li>
                <button 
                  :disabled="articleStatus === 'DELETED'" 
                  :class="{ 'inactive': articleStatus === 'DELETED' }" 
                  @click="deleteArticle"
                >
                  Удалить статью
                </button>
              </li>
              <li>
                <button 
                  v-if="articleStatus === 'DELETED'" 
                  @click="restoreArticle"
                >
                  Восстановить статью
                </button>
              </li>
            </ul>
    </div>
</template>
<script>
import { ref } from "vue";
import {useStore} from "vuex";


export default {
    props: {
        articleStatus: String,
        authorsNickname: String
    },
    setup(props) {
    const articleMenuOpen = ref(false);
    const store = useStore();
    


    const toggleArticleMenu = () => {
      articleMenuOpen.value = !articleMenuOpen.value;
    };

    const deleteArticle = () => {
      console.log("delete article");
    };

    const restoreArticle = () => {
      console.log("restore article");
    };

    return {
      articleMenuOpen,
      toggleArticleMenu,
      deleteArticle,
      restoreArticle,
      store,
    };
  }
};
</script>

<style scoped>
.inactive {
    color: gray; 
    cursor: not-allowed;
}

.menu-icon {
  cursor: pointer;
  float: right;
  margin-left: 10px;
  top: 0;
  right: 0;
  width: 25px;
  height: 25px;
}

.dropdown {
  display: inline;
  position: relative;
  float: right;
}
.article-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  z-index: 1;
  min-width: 300px;
  max-height: 150px;
  overflow-y: auto;
}

.article-menu li{
  padding: 8px 16px;
  cursor: pointer;
  max-height: 40px;
}


.article-menu li:hover {
  background-color: #ddd;
}


</style>
