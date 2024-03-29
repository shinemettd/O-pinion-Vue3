<template>
  <div class="article-container">
    <div class="article-form">

      <label for="title">Заголовок:</label>
      <input v-model="title" type="text" id="title" class="title-input" @input="limitInputLength" @paste="handlePaste"
             :maxlength="title.length >= 120 ? 120 : null"/>
      <p :style="{ color: title.length > 120 ? 'red' : 'black' }">{{ title.length }}/120</p>

      <div class="cover-image">
        <div
          class="drop-zone"
          @drop="dropFile($event)"
          @dragover.prevent
          @dragenter.prevent
          @dragleave.prevent
        >
          <p>Перетащите файл сюда или нажмите для выбора файла</p>
          <input
            type="file"
            id="addCoverImage"
            style="display: none"
            @change="handleFile"
            accept="image/*"
          />
          <button @click="openFileInput">Выбрать файл</button>

        </div>

        <div v-if="isCoverImageValid">
          <p>Главное изображение статьи: </p>
          <div class="image-container">
            <img :src="coverImageSrc" alt="uploaded-image" id="uploaded-image"/>
            <img src="/icons/trash-can.svg" class="delete-button" alt="delete-icon" @click="removeImage"/>
          </div>
        </div>

      </div>

      <label for="short-description">Краткое описание:</label>
      <Editor ref="EditorComponentRef"
        :showModal="showModal"
        :isForArticleShortDescription="true"
        :editedArticleShortDescription="editedArticleShortDescription"

      />

      <div id="myModal" class="modal">
        <div class="modal-content">
          <div class="close">&times;</div>
          <div class="warning">
            <img src="/icons/warning.svg" class="warning-icon" alt="wsrning">
            <p id="warningText">Пожалуйста, выберите изображение</p>
          </div>
          <img v-if="imageSrc !== null" :src="imageSrc" alt="image" id="warningImage">
        </div>
      </div>
      <h2>Содержание статьи :</h2>
      <ArticleEditor ref="ArticleEditorComponentRef"
        :showModal="showModal"
        :isImageValid="isImageValid"
        :editedArticleContent="editedArticleContent"
        :updateArticleOnServer="updateArticleOnServer"
        />
      <TagZone v-if="!article" ref="ArticleCreateTagZoneRef" />
      <TagZone v-if="article" ref="EditArticleTagZoneRef" :editedArticleTags="article.tags"/>

       <div class="btn-options">
        <button class="btn btn-create-article" @click="submitArticle">Опубликовать</button>
        <button class="btn btn-create-draft" @click="saveAsDraft">Сохранить как черновик</button>
       </div>
       <div v-if="loading" class="loading-spinner">
        <div class="loading-content">
          <img src="/icons/loading.gif" alt="Loading..." style="margin: auto;">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleEditor from "@/components/ArticleEditor.vue";
import Editor from "@/components/Editor.vue";

import TagZone from "@/components/TagZone.vue";
import axios, {HttpStatusCode} from "axios";
import {ref, onMounted, onBeforeUnmount, onBeforeMount, onUnmounted} from 'vue';
import router from '@/plugins/router';
import store from "@/store/store";


export default {
  props: {
    article: Object,
    editedArticleId : Number,
    editedArticleShortDescription : String,
    editedArticleContent : String,
    editedArticleCoverImage : String
  },
  components: {
    ArticleEditor,
    Editor,
    TagZone
  },

  setup(props) {
    const coverImageFile = ref(null);
    const coverImageinput = ref(null);
    const coverImageSrc = ref('');
    const imageSrc = ref("/icons/mem.jpg");
    const isCoverImageValid = ref(false);

    const title = ref('');
    const short_description = ref('');


    const ArticleEditorComponentRef = ref(null);
    const EditorComponentRef = ref(null);
    const ArticleCreateTagZoneRef = ref(null);
    const EditArticleTagZoneRef = ref(null);
    const intervalId = ref(null);
    const loading = ref(false);


    onMounted(() => {
      if(props.editedArticleId) {
        startIntervalIfNeeded();
      }
      loadTitleFromLocalStorage();
      if(props.editedArticleCoverImage) {
        coverImageSrc.value = props.editedArticleCoverImage;
        isCoverImageValid.value = true;
      }

      coverImageinput.value = document.getElementById('addCoverImage');

      // Закрыть всплывающее окно при нажатии на "X"
      document.querySelector('.close').addEventListener('click', function () {
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';
      });

    });

    function startIntervalIfNeeded() {
        intervalId.value = setInterval(() => {
          console.log("Запускаем интервал");
          updateArticleOnServer();
        }, 30000);
    }

    onUnmounted(() => {
      if (intervalId.value) {
        clearInterval(intervalId.value);
      }
    });



    const loadTitleFromLocalStorage = () => {

      if(props.editedArticleId) {
        title.value = props.article.title;
        return;
      }
      const savedTitle = localStorage.getItem('savedTitle');
      if (savedTitle) {
        title.value = savedTitle;
      }
    };

    const saveTitleToLocalStorage = () => {
      if(!props.editedArticleId) {
        localStorage.setItem('savedTitle', title.value);
      }
    };

    const limitInputLength = () => {
      saveTitleToLocalStorage();
      if (title.value.length > 120) {
        title.value = title.value.slice(0, 120); // Обрезаем текст до 120 символов
      }
    }

    const handlePaste = (event) => {
      const pastedText = event.clipboardData.getData('text/plain');
      if ((title.value.length + pastedText.length) > 120) {
        event.preventDefault();
      }
    }

    const openFileInput = () => {
      coverImageinput.value.click();
    };

    const removeImage = async() => {
      // если мы удаляем картинку которую изначально передавали
      if(props.editedArticleCoverImage && props.editedArticleCoverImage === coverImageSrc.value) {
        await deleteArticleCoverImage(props.editedArticleId);
      }
      coverImageFile.value = null;
      coverImageSrc.value = null;
      isCoverImageValid.value = false;

    };

    const deleteArticleCoverImage = async(articleId) => {

      try {
        const response = await axios.delete(`${store.state.API_URL}/api/images/${articleId}`, store.state.config);
        console.log('Главное изображение  успешно удалено :');

      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          showModal(null, serverErrors);

        } else {
          console.error('Ошибка удаления главного  изображения статьи', error);
        }
      }
    }


    const handleFile = async (event) => {
      const files = event.target.files;
      handleCoverImage(files);
    };

    const dropFile = async (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      handleCoverImage(files);

    };

    const handleCoverImage = async(files) => {
      if (files.length < 0) {
        return;
      }
      coverImageFile.value = null; // чтобы рендерились изменения
      coverImageFile.value = files[0];

      if (await isImageValid(coverImageFile)) {
        console.log('valid image');
        isCoverImageValid.value = true;
        coverImageSrc.value = URL.createObjectURL(coverImageFile.value);

      } else {
        isCoverImageValid.value = false;
        coverImageSrc.value = '';
        coverImageFile.value = null;
      }
    }

    async function isImageValid(file) {
      if (!file) return;
      if (!isImage(file.value.name)) {
        showModal("/icons/mem.jpg", 'Пожалуйста, выберите изображение');
        return false;
      }
      const maxSize = 2 * 1024 * 1024;
      if (file._value.size > maxSize) {
        showModal("/icons/too_much.jpg", 'Размер файла превышает 2МБ ');
        return false;
      }

      try {
        const isSizeValid = await isRequiredSize(file.value);
        if (!isSizeValid) {
          // showModal("/icons/too_much.jpg", 'Размер файла превышает 2МБ ');
          alert("Изображение должно быть не меньше 400px * 400px и не больше 2000px на 2000px");
          return false;
        }
      } catch (error) {
        console.error(error);
        alert("Ошибка при проверке размера изображения.");
        return false;
      }
      return true;
    }


    function isRequiredSize(file) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          console.log('Width:', width);
          console.log('Height:', height);

          if (width > 400 && height > 400 && width < 2000 && height < 2000) {
            resolve(true);
          } else {
            resolve(false);
          }
        };
        img.onerror = () => {
          reject(new Error("Ошибка загрузки изображения"));
        };

        img.src = URL.createObjectURL(file);
      });
    }


    const loadCoverImageOnServer = async (articleId) => {
      if (!coverImageFile.value) {
        console.log('Главное изображение отсутствует');
        return null;
      }
      try {
        const formData = new FormData();
        formData.append('photo', coverImageFile.value);
        const accessToken = store.state.userToken;
        const config = {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
        };

        const response = await axios.put(`${store.state.API_URL}/api/images/${articleId}`, formData, config);
        console.log('Изображение успешно загружено:');
        coverImageSrc.value = response.data;

        return response.data;
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          showModal(null, serverErrors);

        } else {
          console.error('Ошибка загрузки изображения ', error);
        }
      }
    }

    function isImage(fileName) {
      const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
      const fileExtension = fileName.split('.').pop().toLowerCase();
      return allowedExtensions.includes(fileExtension);
    }

    const showModal = (imgPath, text) => {
      var warningTextElement = document.getElementById("warningText");

      imageSrc.value = imgPath;
      if (Array.isArray(text)) {
        text = text.join(' . \n');
      }
      warningTextElement.textContent = text;
      document.getElementById('myModal').style.display = 'block';
    };

    const submitArticle = async () => {
      loading.value = true;
      if(props.editedArticleId) {
        clearInterval(intervalId);
        await loadCoverImageOnServer(props.editedArticleId);
        var isSuccess = await updateArticleOnServer();
        console.log("result updateArticle " + isSuccess);
        if(isSuccess) {
          isSuccess = await updateFromCacheToDB(props.editedArticleId);
        }
        console.log("result update from cache " + isSuccess);
        if(isSuccess) {
          isSuccess =  await undraftArticle();
        }
        if(isSuccess) {
          loading.value = false;
          router.push('/create-article/success');
          return;
        }
        loading.value = false;
        alert("Произошла ошибка = (")
        return;
      }
      sendArticleOnServer(`${store.state.API_URL}/api/articles`);
    };

    const saveAsDraft = async() => {
      loading.value = true;
      console.log("loading : " + loading.value);
      if(props.editedArticleId) {
        clearInterval(intervalId);
        await loadCoverImageOnServer(props.editedArticleId);
        var result = await updateArticleOnServer();
        console.log("result updateArticle " + result);
        if(result) {
          result = await updateFromCacheToDB(props.editedArticleId);
        }
        console.log("result update from cache " + result);
        if(result) {
          loading.value = false;
          alert('Ваши изменения сохранены успешно !');
          router.push(`/user/${store.state.nickname}`);
          return;
        }
        loading.value = false;
        alert("Произошла ошибка = (");
        return;
      }
      sendArticleOnServer(`${store.state.API_URL}/api/articles/drafts`);
    }

    const undraftArticle = async() => {
      try {
        const response = await axios.put(`${store.state.API_URL}/api/articles/${props.editedArticleId}/undraft`, null, store.state.config);
        return true;

      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          showModal(null, serverErrors);
          return false;

        } else {
          console.error('Error submitting article:', error);
          return false;
        }
      }
    }

    async function updateFromCacheToDB(articleId) {
        try {
          const response = await axios.put(`${store.state.API_URL}/api/articles/drafts/${articleId}`, null, store.state.config);
          return true;

        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
              const serverErrors = error.response.data.errors;
              showModal(null, serverErrors);
            }
            return false;
        }

    }


    async function updateArticleOnServer() {
        try {
          const data = {
            title: title.value,
            short_description: getShortDescription(),
            content: getHTMLContent(),
            tags: getSelectedTags()
          };
          const response = await axios.put(`${store.state.API_URL}/api/articles/${props.editedArticleId}`, data, store.state.config);
          return true;


        } catch (error) {
          if (error.response && error.response.data && error.response.data.errors) {
            const serverErrors = error.response.data.errors;
            showModal(null, serverErrors);
          }
          return false;
        }
    }


    const sendArticleOnServer = async(endpoint) => {
      try {
        const data = {
          title: title.value,
          short_description: getShortDescription(),
          content: getHTMLContent(),
          tags: getSelectedTags()
        };

        const response = await axios.post(endpoint, data, store.state.config);
        console.log('id = ' + response.data.id);
        // теперь присваиваем картинку статье
        const imagePath = await loadCoverImageOnServer(response.data.id);
        updateFromCacheToDB(response.data.id);
        console.log('cover image path :' + imagePath);

        localStorage.removeItem('articleContent');
        localStorage.removeItem('savedTitle');
        localStorage.removeItem('savedShortDescription');
        localStorage.removeItem('selectedTags');

        loading.value = false;
        router.push('/create-article/success');

      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          loading.value = false;
          showModal(null, serverErrors);
          return;
        }
        loading.value = false;
        console.log("Error submiting article " + error);
      }
    }


    const getHTMLContent = () => {
      if (ArticleEditorComponentRef.value) {
        return ArticleEditorComponentRef.value.getHTMLContent();

      }
    }

    const getShortDescription = () => {
      if (EditorComponentRef.value) {
        return EditorComponentRef.value.getHTMLContent();

      }
    }

    const getSelectedTags = () => {
      if(props.editedArticleId && EditArticleTagZoneRef.value) {
        console.log('Получили отредактированные теги :' );
        EditArticleTagZoneRef.value.getSelectedTags().forEach(function(tag) {
            console.log(tag);
        });
        return EditArticleTagZoneRef.value.getSelectedTags();
      }
      if(ArticleCreateTagZoneRef.value) {
        console.log('Получили теги :' );
        ArticleCreateTagZoneRef.value.getSelectedTags().forEach(function(tag) {
            console.log(tag);
        });
        return ArticleCreateTagZoneRef.value.getSelectedTags();
      }
    }

    onBeforeMount(async () => {
      if (!(await isAuthorized())) {
        store.commit('logout');
      } else {
        await checkNotifications();
      }
    });

    const isAuthorized = async () => {
      if (store.state.nickname === null) {
        return false;
      }
      try {
        const response = await axios.get(`${store.state.API_URL}/api/users/my-profile`, store.state.config);
        return response.status === HttpStatusCode.Ok;
      } catch (e) {
        return false;
      }
    }

    const checkNotifications = async () => {
      try {
        const notificationCount = (await axios.get(`${store.state.API_URL}/api/user-notifications/not-read`, store.state.config)).data.totalElements;
        store.commit('setNotificationCount', notificationCount);
      } catch (e) {
        console.error(e);
      }
    }

    return {
      title,
      short_description,
      handleFile,
      submitArticle,
      saveAsDraft,
      showModal,
      isImageValid,
      openFileInput,
      dropFile,
      coverImageFile,
      isCoverImageValid,
      coverImageSrc,
      imageSrc,
      removeImage,
      limitInputLength,
      handlePaste,
      ArticleEditorComponentRef,
      EditorComponentRef,
      ArticleCreateTagZoneRef,
      EditArticleTagZoneRef,
      updateArticleOnServer,
      loading
    };

  }
};


</script>

<style>
.article-container {
  background-color: #f8f8f8;
  padding: 20px;
}

.article-form,
.content-form {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.title-input {
  min-width: 100%;
  max-width: 100%;
  height: 2em;
  font-size: 2em;
  border: #333 solid 1px;
  padding: 10px;
  border-radius: 10px;
  overflow-x: auto !important;
}


.btn {
  background-color: #1e066e;
  color: #fff;
  padding: 12px 20px;
  margin: 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-options {
  display: flex;
  justify-content: space-around;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-create-article {
  background-color: #079843;
  margin-bottom: 0;
  font-size: 20px;
  font-weight: bold;
}

.btn-create-draft {
  background-color: #c52e0c;
  margin-bottom: 0;
  font-size: 20px;
  font-weight: bold;
}

.btn-create-article:hover {
  background-color: #03672d;
}

.btn-create-draft:hover {
  background-color: #9c260b;
}

.warning {
  display: flex;
  align-items: flex-end;
}

.warning p {
  display: inline;
  margin-bottom: 10px;
  flex-grow: 1;
}

.warning-icon {
  border-radius: 4px;
  display: inline;
  width: 70px;
  height: 60px;
  margin-right: 10px;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}
.loading-spinner {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
}

.loading-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10%
}

.modal-content img {
  margin: auto;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.drop-zone {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.image-container {
  position: relative;
  display: inline-block;
}

.delete-button {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

@media only screen and (max-width: 720px) {
  .btn-toolbar icon {
    width: 10px;
    height: 10px;
  }
}




@media only screen and (max-width: 730px) {
  .title-input {
    font-size: 1.5em;
  }
}

@media only screen and (max-width: 730px) {
  .title-input {
    font-size: 1.5em;
  }

  .article-form {
    padding: 10px;
    border-radius: 0;
    border: none;
  }


  @media only screen and (max-width: 730px) {
    .title-input {
      font-size: 1.5em;
    }

    .article-form {
      font-size: 15px;
    }


  }
}


</style>
