<script setup>
import {onBeforeMount, ref} from "vue";
import store from "@/store/store";
import axios, {HttpStatusCode} from "axios";
import {useRoute} from "vue-router";
import router from "@/plugins/router";

const isTokenValid = ref(false);
const route = useRoute();
const token = route.params.token;
const passwordValue = ref('');
const passwordConfirmationValue = ref('');
const showPasswordValue = ref(false)
const showPasswordConfirmationValue = ref(false)

const passwordReadyToChange = ref(false);

const showSnackMessage = ref(false);
const snackMessageText = ref('');

const checkToken = async () => {
  try {
    const response = await axios.post(`${store.state.API_URL}/api/password/${token}`);
    isTokenValid.value = (response.status === HttpStatusCode.Ok);
  } catch (e) {
    console.log(e);
  }
}

const checkPasswords = () => {
  let regExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  if (!(regExp.test(passwordValue.value))) {
    return;
  }
  passwordReadyToChange.value = passwordConfirmationValue.value === passwordValue.value;
}

const changePassword = async () => {
  if (!passwordReadyToChange) {
    showSnackbarMessage('Пароли не прошли проверку');
    return;
  }
  try {
    const response = axios.put(`${store.state.API_URL}/api/password/reset/${token}`, { password: passwordValue, confirm_password: passwordConfirmationValue});
    if ((await response).status === HttpStatusCode.Ok) {
      await router.push('/auth');
    }
  } catch (e) {
    console.error(e);
    showSnackbarMessage('Произошла ошибка при попытке смены пароля');
  }
}
const showSnackbarMessage = (text) => {
  showSnackMessage.value = true;
  snackMessageText.value = text;
}


onBeforeMount(async () => {
  await checkToken();
  }
)

</script>

<template>
  <div class = "grid border rounded-lg shadow-lg">
    <div v-if="isTokenValid">
      <h1 class = "header-text mb-3"> Смена пароля </h1>
      <div class="mx-5 mt-5">

        <v-row>
          <v-col cols="12" sm="12">
            <v-text-field
              :error-messages = "(passwordValue.length < 8 && passwordValue.length !== 0) ? 'Пароль не может содержать меньше 8 символов' : ''"
              label="Пароль"
              placeholder="Введите пароль"
              :model-value="passwordValue"
              :append-inner-icon="showPasswordValue ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPasswordValue ? 'text' : 'password'"
              :rules="[
                          rule => /^(?=.*\d)/.test(rule) || 'Пароль должен содержать хотя бы одну цифру',
                          rule => /(?=.*[!@#$%^&*])/.test(rule)  || 'Пароль должен содержать хотя бы один специальный символ',
                          rule => /(?=.*[a-z])/.test(rule) || 'Пароль должен содержать хотя бы одну маленькую латинскую букву',
                          rule => /(?=.*[A-Z])/.test(rule) || 'Пароль должен содержать хотя бы одну заглавную латинскую букву'
                          ]"
              variant="outlined"
              @click:append-inner="showPasswordValue = !showPasswordValue"
              @update:modelValue="newPassword => {
                  passwordValue = newPassword;
                  checkPasswords();
                  }"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>

          <v-col cols="12" sm="12" style="margin-top: -1em;">
            <v-text-field
              v-if="passwordValue.length < 8"
              label="Подтверждение пароля"
              placeholder="Сначала введите основное поле"
              :append-inner-icon="showPasswordConfirmationValue ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPasswordConfirmationValue ? 'text' : 'password'"
              @click:append-inner="showPasswordConfirmationValue = !showPasswordConfirmationValue"
              variant="outlined"
              readonly
            ></v-text-field>

            <v-text-field v-else
                          :error-messages="(passwordValue !== passwordConfirmationValue) ? 'Пароли не совпадают' : ''"
                          label="Подтверждение смены пароля"
                          placeholder="Введите пароль еще раз"
                          :model-value="passwordConfirmationValue"
                          :append-inner-icon="showPasswordConfirmationValue ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPasswordConfirmationValue ? 'text' : 'password'"
                          variant="outlined"
                          @click:append-inner="showPasswordConfirmationValue = !showPasswordConfirmationValue"
                          @update:modelValue="newConfirmationPassword => {
                              passwordConfirmationValue = newConfirmationPassword;
                              checkPasswords();
                            }"
            ></v-text-field>
          </v-col>

        </v-row>
      </div>
      <v-btn class = "save-btn-style"
             variant="outlined"
             @click = "() => changePassword()"
      >
        Сменить пароль
      </v-btn>
    </div>
    <div v-else>
      <h1 class = "header-text mb-3"> Ошибка </h1>
      <p class = "simple-text mb-3"> Ссылка недействительна. </p>
    </div>
  </div>
  <div>
    <v-snackbar
      v-model="showSnackMessage"
      :timeout="3000"
    >
      {{ snackMessageText }}

      <template v-slot:actions>
        <v-btn
          color="purple"
          variant="text"
          @click="showSnackMessage = false"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>

.header-text {
  font-size: 2.25em;
  text-align: center;
}

.simple-text {
  font-size: 1.35em;
  text-align: center;
}

.save-btn-style {
  margin-left: 30%;
  margin-top: 1em;
}

@media screen and (max-width: 768px) {
  .grid {
    margin-top: 10%;
    padding: 2em 2em 2em 2em;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
}

@media screen and (min-width: 768px) and (max-width: 1280px) {
  .grid {
    margin-left: auto;
    margin-right: auto;
    max-width: 30em;
    width: 60%;
    margin-top: 10%;
    padding: 2em 2em 2em 2em;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
}

@media screen and (min-width: 1280px) {
  .grid {
    margin-left: auto;
    margin-right: auto;
    max-width: 30em;
    width: 30%;
    margin-top: 10%;
    padding: 2em 2em 2em 2em;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
}
</style>
