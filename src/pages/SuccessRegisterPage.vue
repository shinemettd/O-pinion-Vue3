<script setup>
</script>

<template>
  <h1 class = "main-message text-center"> Аккаунт успешно зарегистрирован 🎉</h1>
  <h2 class = "secondary-message text-center"> Посетите вашу почту и подтвердите аккаунт (пожалуйста)</h2>
  <h3 class = "back-to-main-page-message text-center"> <router-link to="/auth"> Хорошо. </router-link></h3>
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
