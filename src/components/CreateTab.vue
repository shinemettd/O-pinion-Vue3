<template>
  <div class="article-container">
    <div class="article-form">
      <h2>Создание статьи</h2>

      <label for="title">Заголовок:</label>
      <input v-model="title" type="text" id="title"/>

      <label for="short-description">Краткое описание:</label>
      <textarea v-model="shortDescription" id="short-description"></textarea>

      <label for="cover-image">Главное изображение (выберите файл):</label>
      <input type="file" @change="handleImageChange" accept="image/*"/>

      <button @click="submitArticle">Создать статью</button>
    </div>

    <div v-if="articleId" class="content-form">
      <h2>Добавление контента</h2>

      <label for="article-content">Контент статьи (HTML файл):</label>
      <textarea v-model="articleContent" id="article-content"></textarea>

      <button @click="submitContent">Добавить контент</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import {ref} from 'vue';

const title = ref('');
const shortDescription = ref('');
const coverImage = ref('');

const articleId = ref('');
const articleContent = ref('');

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    coverImage.value = file;
  }
};

const submitArticle = async () => {
  try {
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('short_description', shortDescription.value);
    formData.append('cover-image', coverImage.value);
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.post('http://194.152.37.7:8812/api/articles', formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    articleId.value = response.data.id;
  } catch (error) {
    console.error('Error submitting article:', error);
  }
};

const submitContent = async () => {
  try {
    await axios.post(`http://194.152.37.7:8812/api/articles/${articleId.value}/set-content`, {
      articleContent: articleContent.value,
    });
  } catch (error) {
    console.error('Error submitting article content:', error);
  }
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

button {
  background-color: #007BFF;
  color: #fff;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}
</style>
