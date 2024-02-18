<template>
    <div class="article-container">
      <div class="article-form">
  
        <label for="title">Заголовок:</label>
        <input v-model="title" type="text" id="title" class="title-input" @input="limitInputLength" :maxlength="title.length >= 120 ? 120 : null" />
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
            <p>Главное изображение статьи: {{ coverImageFile.name }}</p>
            <div class="image-container">
              <img :src="coverImageSrc" alt="uploaded-image" id="uploaded-image"/>
              <img src="/icons/trash-can.svg" class="delete-button" alt="delete-icon" @click="removeImage"/>
            </div>
          </div>
        </div>
  
        <label for="short-description">Краткое описание:</label>
        <Editor  ref="EditorComponentRef"/>
  
        <div id="myModal" class="modal">
          <div class="modal-content">
            <div class="close">&times;</div>
            <div class="warning">
                <img src="/icons/warning.svg" class="warning-icon" alt="wsrning" >
                <p id="warningText">Пожалуйста, выберите изображение</p>
            </div>
            <img src="/icons/mem.jpg" alt="image" id="warningImage">
          </div>
        </div>
        
        <h2>Содержание статьи :</h2>

    
        <ArticleEditor ref="ArticleEditorComponentRef" :showModal="showModal" :isImageValid="isImageValid"/>

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
    const coverImageFile = ref(null);
    const coverImageinput = ref(null);
    const coverImageSrc = ref('');
    const isCoverImageValid = ref(false);

    const title = ref('');
    const short_description = ref('');
    

    const ArticleEditorComponentRef = ref(null);
    const EditorComponentRef = ref(null);

    onMounted(() => {

        coverImageinput.value = document.getElementById('addCoverImage');

        // Закрыть всплывающее окно при нажатии на "X"
        document.querySelector('.close').addEventListener('click', function() {
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';
        });

    });

    const limitInputLength = () => {
      if (title.length > 120) {
        title = title.slice(0, 120); // Обрезаем текст до 120 символов
      }
    }
    const openFileInput = () => {
      coverImageinput.value.click();
    };

    const removeImage = () => {
      coverImageFile.value = null;
      coverImageSrc.value = '';
      isCoverImageValid.value = false;
    };

    const handleFile = async (event) => {
      console.log("IN handle FILE");
      const files = event.target.files;
      if (files.length < 0) {
        return;
      }
      coverImageFile.value = null; // чтобы рендерились изменения 
      coverImageFile.value = files[0];

      if(await isImageValid(coverImageFile)) {
        console.log('valid image');
        isCoverImageValid.value = true;
        coverImageSrc.value = URL.createObjectURL(coverImageFile.value);
      } else {
        isCoverImageValid.value = false;
        coverImageSrc.value = '';
      }


    };

    async function isImageValid(file) {
      if(!file) return;
      if(!isImage(file.value.name)) {
        showModal("/icons/mem.jpg", 'Пожалуйста, выберите изображение');
        return false;
      }
      const maxSize = 2 * 1024 * 1024;
      if(file._value.size >  maxSize) {
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


    function isRequiredSize (file) {
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

    const  dropFile = async (event) => {
      event.preventDefault();
      console.log("IN DROP FILE");
      const files = event.dataTransfer.files;
      if (files.length < 0) {
        return;
      }

      coverImageFile.value = null; // чтобы рендерились изменения 
      coverImageFile.value = files[0];

      if(await isImageValid(coverImageFile)) {
        console.log('valid image');
        isCoverImageValid.value = true;
        coverImageSrc.value = URL.createObjectURL(coverImageFile.value);
      } else {
        isCoverImageValid.value = false;
        coverImageSrc.value = '';
      }


    };


    const loadCoverImageOnServer = async (articleId) => {
      if(!coverImageFile.value) {
        console.log('Главное изображение отсутствует');
        return null;
      }
      try {
          const formData = new FormData();
          formData.append('photo', coverImageFile.value);
    
          const accessToken = localStorage.getItem('accessToken');
          const response = await axios.put(`http://194.152.37.7:8812/api/images/${articleId}`, formData, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Изображение успешно загружено:');

          const fileName = response.data.split('/').pop();
          coverImageSrc.value = '/images/articles_images/' + fileName;
          
          return response.data;
        } catch (error) {
          console.error('Ошибка загрузки изображения:', error);
        }
    }

    function isImage(fileName) {
      const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
      const fileExtension = fileName.split('.').pop().toLowerCase();
      return allowedExtensions.includes(fileExtension);
    }

    const showModal = (imgSrc, text) => {
      var modalImage = document.getElementById("warningImage");
      var warningTextElement = document.getElementById("warningText");
      
      modalImage.src = imgSrc;
      warningTextElement.textContent = text;

      document.getElementById('myModal').style.display = 'block';
    };

    const submitArticle = async () => {
      try {
         const data = {
          title: title.value,
          short_description: getShortDescription(),
          content: getHTMLContent()
        };
    
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.post('http://194.152.37.7:8812/api/articles', data, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('id = ' + response.data.id);
        // теперь присваиваем картинку статье 
        const imagePath = await loadCoverImageOnServer(response.data.id);
        console.log('cover image path :' + imagePath);
      } catch (error) {
        console.error('Error submitting article:', error);
      }

    };
    
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

     // Добавляем console.log перед передачей пропса showModal
     console.log('showModal is', typeof showModal);

    return {
      title,
      short_description,
      handleFile,
      submitArticle,
      showModal,
      isImageValid,
      openFileInput,
      dropFile,
      coverImageFile,
      isCoverImageValid,
      coverImageSrc,
      removeImage,
      limitInputLength,
      ArticleEditorComponentRef, 
      EditorComponentRef,
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
    font-size: 2em; /* Размер текста в поле ввода */
    border:#333 solid 1px;
    padding: 10px;
    border-radius: 10px;
    overflow-x: auto !important;
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
  width: 24px; /* Установите ширину иконки */
  height: 24px; /* Установите высоту иконки */
  cursor: pointer;
}

</style>