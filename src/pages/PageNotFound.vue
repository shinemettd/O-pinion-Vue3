<script setup>
defineProps({
    mainMessage: {
      type: String,
      default: "Страница не найдена!"
    },
    secondaryMessage: {
      type: String,
      default: "У вас проблемы? Обратитесь к психологу"
    },
    backToMainPageMessage: {
      type: String,
      default: "Назад на главную страницу"
    }
  })
</script>

<template>
  <h1 class = "main-message text-center"> {{ mainMessage }} </h1>
  <h2 class = "secondary-message text-center"> {{ secondaryMessage }}</h2>
  <h3 class = "back-to-main-page-message text-center"> <router-link to="/"> {{ backToMainPageMessage }} </router-link></h3>
</template>

<style scoped>
  .main-message {
    font-size: 4em;
    margin-top: 3.5em;
  }

  .secondary-message {
    font-size: 1.5em;
    opacity: 50%;
  }

  .back-to-main-page-message {
    font-size: 1.5em;
    margin-top: 7.5em;
  }

  .back-to-main-page-message:hover {
    color: purple;
    transition: all 0.35s ease;
  }
</style>
