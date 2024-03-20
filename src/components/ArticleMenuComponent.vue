<template>
   <div class="dropdown" v-if="store.state.isAuthorized && (store.state.nickname === authorsNickname)">
            <img src="/icons/three-points-menu.svg" alt="Menu" @click="toggleArticleMenu" class="menu-icon">
            <ul class="article-menu" v-if="articleMenuOpen" @mouseleave="articleMenuOpen = false">
              <li v-if="articleStatus !== 'DELETED'">
                <router-link :to="'/edit-article/' + articleId">
                  <p>Редактировать статью</p>
                </router-link>
                <router-link :to="'/edit-article/' + articleId">
                  <img src="/icons/edit-article.svg" class="menu-icons" alt="icon"  @click="">
                </router-link>
              </li>
              <li v-if="articleStatus !== 'DELETED'">
                <button  @click="showModal = true" style="color: red;">
                  Удалить статью
                </button>
                <img src="/icons/delete-article.svg" class="menu-icons" alt="icon"  @click="deleteArticle">
              </li>
              <li v-if="articleStatus === 'DELETED'">
                <button  @click="restoreArticle" style="color: green;">
                  Восстановить статью
                </button>
                <img  src="/icons/undelete-article.svg"  class="menu-icons undelete-icon" alt="icon"  @click="restoreArticle">
              </li>
            </ul>
            <div v-if="showModal" class="modal-wrapper">
              <div class="modal">
                <div class="modal-content">
                  <p>Вы точно хотите удалить статью?</p>
                  <div class="modal-btn">
                    <button class="delete-btn"  @click="deleteArticle">Да, удалить</button>
                    <button class="delete-btn cancel-btn" @click="showModal = false">Отмена</button>
                  </div>
                </div>
            </div>
          </div>
    </div>
</template>
<script>
import { ref } from "vue";
import {useStore} from "vuex";
import axios, {HttpStatusCode} from "axios";


export default {
    props: {
        articleStatus: String,
        authorsNickname: String,
        articleId : Number
    },
    setup(props) {
    const articleMenuOpen = ref(false);
    const store = useStore();
    const showModal = ref(false);
    


    const toggleArticleMenu = () => {
      articleMenuOpen.value = !articleMenuOpen.value;
    };

    const deleteArticle = async() => {
      showModal.value = false;
      console.log("delete article");
      await deleteArticleRequest();
    };

    const deleteArticleRequest = async() => {  
      try {
        const response = await axios.delete(`${store.state.API_URL}/api/articles/${props.articleId}`, store.state.config);
        alert('Ваша статья успешно удалена ');

      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          alert(serverErrors);

        } else {
          console.error('Ошибка удаления статьи ', error);
        }
      }
    }

    const restoreArticle = async() => {
      console.log("restore article");
      await restoreArticleRequest();
    };

    async function restoreArticleRequest() {
        try {
          const response = await axios.put(`${store.state.API_URL}/api/articles/restore/${props.articleId}`, null, store.state.config);
          alert('Ваша статья успешно восстановлена ');


        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
              const serverErrors = error.response.data.errors;
              alert(serverErrors);
            }
            
        }
        
    }

    return {
      articleMenuOpen,
      toggleArticleMenu,
      deleteArticle,
      restoreArticle,
      store,
      showModal
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
  max-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;

}


.article-menu li:hover {
  background-color: #ddd;
}

.menu-icons {
  padding: 6px 10px;
  cursor: pointer;
  display: inline;
  width: 45px;
  height: 40px;
}

.undelete-icon {
  width: 60px;
  height: 50px;
}

.modal {
  display: block;
  position: fixed; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  overflow: auto; 
  background-color: rgb(0, 0, 0); 
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  width: 30%;
  height: 22%;
}

.modal-content p {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 30px;
  margin-top: 15px;
}
.modal-btn {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.delete-btn {
  display: block;
  background-color: brown; 
  color: aliceblue; 
  border-radius: 10px;
  padding: 10px;
  margin: 20px;
}
.cancel-btn {
  background-color: gray; 
}
</style>
