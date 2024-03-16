<template>
    <div class="success-page">
      <h1>Поздравляем! 🎉</h1>
      <h2>Статья успешно создана!</h2>
      <p>Теперь вы можете поделиться своим знанием с миром.</p>
      <button @click="returnToHomePage">Вернуться на главную страницу</button>
    </div>
  </template>
  
  <script>
  import router from '@/plugins/router'; 
  
  export default {
    setup() {
  
      const returnToHomePage = () => {
        router.push({ path: '/' });
      };
  
      return { returnToHomePage };
    }
  }
  </script>
  
  <style scoped>
  h1 {
    font-size: 2rem;
    font-family: Georgia, 'Times New Roman', Times, serif; /* Классический шрифт */
    margin-top: 20px;
    margin-bottom: 10px;
    color: #444; /* Цвет текста */
  }
  
  h2 {
    font-size: 1.5rem;
    font-family: Georgia, 'Times New Roman', Times, serif; /* Классический шрифт */
    margin-bottom: 20px;
    color: #444; /* Цвет текста */
  }
  
  p {
    font-family: Georgia, 'Times New Roman', Times, serif; /* Классический шрифт */
    margin-bottom: 20px;
    color: #666; /* Цвет текста */
  }
  
  .success-page {
    text-align: center;
    padding-top: 50px;
    background-color: #f9f9f9; /* Мягкий фон */
    border: 1px solid #ddd; /* Тонкая рамка */
    border-radius: 5px; /* Закругленные углы */
    width: 60%; /* Ширина блока */
    margin: auto; /* Центрирование */
    padding: 20px; /* Внутренний отступ */
  }
  
  .success-page button {
    padding: 10px 20px;
    background-color: #523375;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
  }
  
  .success-page button:hover {
    background-color: #330d56;
  }
  </style>
  