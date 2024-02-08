<template>
     <div class="article-container">
      <div class="article-form">
        <h2>Создание статьи</h2>
  
        <label for="title">Заголовок:</label>
        <input v-model="title" type="text" id="title"/>
  
        <label for="short-description">Краткое описание:</label>
        <textarea v-model="short_description" id="short-description"></textarea>
  
        <label for="cover-image">Главное изображение (выберите файл):</label>
        <img id="uploaded-image" src="" alt="Загруженное изображение">
        <div class="image-upload">
            <input type="file" @change="handleFile" accept="image/*"/>
            <button class="delete-btn" @click="deleteImage">Удалить</button> 
        </div>
        
        
        <h2>Добавление контента</h2>
        <div class="editor-tool">
            <div v-if="editor">
                <input type="file" ref="fileInputRef" style="display: none;" @change="addImage">
                <img src="/public/icons/upload_img.svg" alt="icon" width="25" height="25" @click="openFileInput">
                <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
                    toggleBold
                </button>
                <button @click="editor.chain().focus().setBold().run()" :disabled="editor.isActive('bold')">
                    setBold
                </button>
                <button @click="editor.chain().focus().unsetBold().run()" :disabled="!editor.isActive('bold')">
                    unsetBold
                </button>
            </div>
        </div>
        <editor-content :editor="editor" class="custom-editor"/>
       
  
        <button @click="submitArticle">Создать статью</button>
      </div>
    </div>
  </template>
  
  <script>
  import Document from '@tiptap/extension-document'
  import Bold from '@tiptap/extension-bold'
  import Dropcursor from '@tiptap/extension-dropcursor'
  import Image from '@tiptap/extension-image'
  import Paragraph from '@tiptap/extension-paragraph'
  import Text from '@tiptap/extension-text'
  import { Editor, EditorContent } from '@tiptap/vue-3'
  import axios from 'axios';
  import { ref , onMounted} from 'vue';


export default {
  components: {
    EditorContent,
  },
  setup() {
    const title = ref('');
    const short_description = ref('');
    const cover_image = ref('');
    const id = ref('');
    const fileInputRef = ref(null);

    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Image,
        Dropcursor,
        Bold,
      ],
      content: `
        <p>This is a basic example of implementing images. </p>
      `,
    });

    // Функция, которая будет вызвана после монтирования элемента в DOM
    onMounted(() => {
      // Устанавливаем ссылку на DOM-элемент input
      fileInputRef.value = document.querySelector('input[type="file"]');
    });

    const openFileInput = () => {
      fileInputRef.value.click();
    };

    const handleFile = async (event) => {
      const file = event.target.files[0];
      if (file) {
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
      }
    };

    const addImage = async (event) => {
      const file = event.target.files[0];
      if (file) {
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
    
          if (response) {
            const imagePath = response.data;
            const fileName = imagePath.split('/').pop();
            editor.chain().focus().setImage({ src: '/images/articles_images/' + fileName }).run();
            console.log(response.data);
            console.log('/images/articles_images/' + fileName)
          }
         
        } catch (error) {
          console.error('Ошибка загрузки изображения:', error);
        }
      }
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

    return {
      title,
      short_description,
      cover_image,
      id,
      editor,
      fileInputRef,
      openFileInput,
      handleFile,
      addImage,
      deleteImage,
      submitArticle,
    };
  },
  beforeUnmount() {
    this.editor.destroy();
  },
};


  </script>
  
  <style scoped>
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
  
  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 16px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .delete-btn {
    background-color: red;
    padding: 6px 10px;
  }
  .delete-btn:hover {
    background-color: rgb(143, 37, 37);
  }
  
  button {
    background-color: #1e066e;
    color: #fff;
    padding: 12px 20px;
    margin:20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:hover {
    background-color: #0056b3;
  }

  .custom-editor {
    border: #1e066e solid;
    height: 50vh;
    max-height: 400px; /* Максимальная высота редактора */
    overflow-y: auto; /* Появляется вертикальный скролл, если контент выходит за пределы редактора */
    line-height: 2;
    
}
/* 
.ProseMirror:focus {
    outline: none;
} */
</style>
  
