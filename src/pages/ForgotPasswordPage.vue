<script setup>
import {ref} from "vue";
import store from "@/store/store";
import axios, {HttpStatusCode} from "axios";

const email = ref('');
const isEmailValid = ref(true);
const isUserEmailExists = ref(true);
const isMessageSend = ref(false);

const validateEmail = async (email) => {
  let regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  if (regex.test(email)) {
    isEmailValid.value = true;
    await sendRequest(email);
  } else {
    isEmailValid.value = false;
  }
}

const sendRequest = async (email) => {
  try {
    const response = await axios.get(`${store.state.API_URL}/api/password/forgot?email=${email}`);
    isUserEmailExists.value = true;
    isMessageSend.value = true;
  } catch (e) {
    isUserEmailExists.value = false;
  }
}

</script>

<template>
    <div class = "grid border rounded-lg shadow-lg">
      <div v-if="!isMessageSend">
        <h1 class = "header-text mb-3"> Сброс пароля </h1>
        <p class = "simple-text mb-3"> На почту будет отправлена ссылка, по которой Вы сможете восстановить пароль </p>
        <v-text-field  class = "mb-2"
          :error-messages="!isEmailValid ? 'Введите корректную почту' : ''
          || !isUserEmailExists ? 'Пользователь с такой почтой не найден' : ''"
          placeholder="Введите почту"
          v-model= "email"
          @update:model-value="newEmail => email = newEmail"
          variant="outlined"
        >
        </v-text-field>
        <v-btn style = "margin-left: 10em"
          variant="outlined"
          @click = "() => validateEmail(email)"
        >
          Отправить
        </v-btn>
      </div>
      <div v-else>
        <h1 class = "header-text mb-3">  Ссылка отправлена! </h1>
        <p class = "simple-text"> Проверьте почту {{ email }}, там вас ждет ссылка для восстановления пароля </p>
      </div>
    </div>
</template>

<style scoped>
.grid {
  margin-left: auto;
  margin-right: auto;
  max-width: 30em;
  width: 30%;
  margin-top: 10%;
  padding: 2em 2em 2em 2em;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.header-text {
  font-size: 2.25em;
  text-align: center;
}

.simple-text {
  font-size: 1.15em;
}
</style>
