<template>
    <div class="article-container">
      <div class="article-form">
  
        <label for="title">Заголовок:</label>
        <input v-model="title" type="text" id="title" class="title-input"/>

        <div class="cover-image">
            <label for="cover-image">Главное изображение (выберите файл):</label>
            <img id="uploaded-image" src="" alt="Загруженное изображение">
            <div class="image-upload">
                <!-- <input type="file" @change="handleFile" accept="image/*"/> -->
                <button class="delete-btn" @click="deleteImage">Удалить</button> 
            </div>
        </div>
  
        <label for="short-description">Краткое описание:</label>
        <Editor/>
  
        <div id="myModal" class="modal">
          <div class="modal-content">
            <div class="close">&times;</div>
            <div class="warning">
                <img src="/icons/warning.svg" class="warning-icon" alt="wsrning">
                <p>Пожалуйста, выберите изображение</p>
            </div>
            <img src="/icons/mem.jpg" alt="image">
          </div>
        </div>
        
        <h2>Содержание статьи :</h2>

    
        <ArticleEditor :showModal="showModal"/>

        <button class="btn" @click="submitArticle">Создать статью</button>
      </div>
    </div>
</template>

<script>
import ArticleEditor from "@/components/ArticleEditor.vue";
import Editor from "@/components/Editor.vue";
import axios from "axios";
import { ref , onMounted } from 'vue';

export default {
  components: {
    ArticleEditor,
    Editor
  },
  setup() {
    const title = ref('');
    const short_description = ref('');
    const cover_image = ref('');
    const id = ref('');


    onMounted(() => {

        // Закрыть всплывающее окно при нажатии на "X"
        document.querySelector('.close').addEventListener('click', function() {
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';
        });

    });


    const handleFile = async (event) => {
      const file = event.target.files[0];
      if(!file) return;
      if(!isImage(file.name)) {
        showModal();
        event.target.value = ''; // Очищаем выбранный файл
        return;
      }
      try {
          const formData = new FormData();
          formData.append('photo', file);
    
          const accessToken = localStorage.getItem('accessToken');
          const response = await axios.post('http://194.152.37.7:8812/api/images', formData, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          });
    
          cover_image.value = response.data;
          const imgElement = document.getElementById('uploaded-image');
          const fileName = cover_image.value.split('/').pop();
          imgElement.src = '/images/articles_images/' + fileName;
          console.log('Изображение успешно загружено:', imgElement.src);
        } catch (error) {
          console.error('Ошибка загрузки изображения:', error);
        }
    };


    function isImage(fileName) {
      const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
      const fileExtension = fileName.split('.').pop().toLowerCase();
      return allowedExtensions.includes(fileExtension);
    }

    const showModal = () => {
      const modal = document.getElementById('myModal');
      modal.style.display = 'block';
    };


    const deleteImage = async (event) => {
      console.log("Удаление картинки");
      const imgElement = document.getElementById('uploaded-image');
      imgElement.src = "";
      const inputElement = document.querySelector('input[type="file"]');
      inputElement.value = '';
        
      // запрос на сервер для удаления картинки 
    };

    const submitArticle = async () => {
      try {
        const data = {
          title: title.value,
          short_description: short_description.value,
          cover_image: cover_image.value || '',
        };
    
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.post('http://194.152.37.7:8812/api/articles', data, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        id.value = response.data.id;
      } catch (error) {
        console.error('Error submitting article:', error);
      }
    };

     // Добавляем console.log перед передачей пропса showModal
     console.log('showModal is', typeof showModal);

    return {
      title,
      short_description,
      cover_image,
      id,
      handleFile,
      deleteImage,
      submitArticle,
      showModal,
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
    height: 2em;
    font-size: 2em; /* Размер текста в поле ввода */
    max-width: 500px; 
    border:#333 solid 1px;
    padding: 10px;
    border-radius: 10px;
}


.btn, .delete-btn{
    background-color: #1e066e;
    color: #fff;
    padding: 12px 20px;
    margin:20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.btn:hover {
    background-color: #0056b3;
}

.delete-btn {
    background-color: red;
    padding: 6px 10px;
}
.delete-btn:hover {
    background-color: rgb(143, 37, 37);

}

.warning {
    display: flex;
    align-items: flex-end;
}
.warning p{
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
  display: none; /* Скрыто по умолчанию */
  position: fixed; /* Зафиксированное положение */
  z-index: 1; /* Наверху */
  left: 0;
  top: 0;
  width: 100%; /* Ширина экрана */
  height: 100%; /* Высота экрана */
  overflow: auto; /* Разрешить прокрутку */
  background-color: rgb(0,0,0); /* Черный фон */
  background-color: rgba(0,0,0,0.4); /* Черный фон с прозрачностью */
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
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

</style>