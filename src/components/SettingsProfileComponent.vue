<template>
  <main class="mx-auto">
    <div class="scroll mx-auto border w-full lg:w-2/3 xl:w-1/2 h-auto lg:h-100 px-10">
      <v-btn-toggle v-model="showToggle" color="red" class="ml-5" mandatory>
        <v-btn
          @click = "tab = 'personal'">
          Личные данные
        </v-btn>
        <v-btn
          @click = "tab = 'privacy'">
          Приватность
        </v-btn>
      </v-btn-toggle>
      <hr>
      <div v-if = "tab === 'personal'">
        <v-container>
          <div class = "header border-collapse mb-5" style = "display: flex;">
            <div class = "avatar mr-5">
              <img :src = "avatarUrl"
                   alt="user avatar"
                   style = "height: 9em;
                   width: 9em;
                   border-radius: 50%">
            </div>
            <div class = "user-data">
              <div class = "nickname-data">
                <strong> <p style = "font-size: 2em"> {{ nickname }} </p> </strong>
              </div>
              <div class = "user-names">
                {{ firstName }} {{ lastName }}
              </div>
              <div class = "user-birthday">
                Дата рождения: {{ birthdate }}
              </div>
              <div class = "user-email">
                {{ email }}
              </div>
            </div>
          </div>

          <hr>

          <v-row class = "pt-10">
            <v-col cols="12" sm="6">
              <v-text-field
                label="Имя"
                :model-value="firstName"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Фамилия"
                :model-value="lastName"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                :error-messages="isEmailTaken ? 'Данная почта уже занята' : ''"
                label="Почта"
                :model-value="email"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" >
              <v-text-field
                :error-messages="isNicknameTaken ? 'Данный никнейм уже занят' : ''"
                label="Никнейм"
                :model-value="nickname"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>

          <p style="font-size: 0.85em; color: gray; " class = "ml-3 mt-5 mb-3">
            Дата рождения
          </p>

          <v-row>
            <v-col cols="12" sm="2">
              <v-select
                :items="days"
                density="comfortable"
                label="День"
                model-value="1"
                variant="outlined"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="2">
              <v-select
                :items="months"
                density="comfortable"
                label="Месяц"
                model-value="Янв"
                variant="outlined"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="2">
              <v-select
                :items="years"
                density="comfortable"
                label="Год"
                model-value="1900"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
          <div style="margin-left: 85%">
            <v-btn
              class="mb-2 mt-5"
              variant="tonal"
              color = "black"
            >
              Сохранить
            </v-btn>
          </div>
        </v-container>
      </div>
      <div v-else-if="tab === 'privacy'">
        <v-container>
          <div class = "header border-collapse mb-5" style = "display: flex;">
            <div class = "avatar mr-5">
              <img :src = "avatarUrl"
                   alt="user avatar"
                   style = "height: 9em;
                   width: 9em;
                   border-radius: 50%">
            </div>
            <div class = "user-data">
              <div class = "nickname-data">
                <strong> <p style = "font-size: 2em"> {{ nickname }} </p> </strong>
              </div>
              <div class = "user-names">
                {{ firstName }} {{ lastName }}
              </div>
              <div class = "user-birthday">
                Дата рождения: {{ birthdate }}
              </div>
              <div class = "user-email">
                {{ email }}
              </div>
            </div>
          </div>

          <hr class="mb-4">

          <v-row no-gutters>
            <v-col cols="4" offset="1">
              <v-text-field
                value="Отображать имя"
                variant="plain"
                readonly="true">
              </v-text-field>
            </v-col>
            <v-col offset="5">
              <v-switch
                color="#6c18a1"
                v-model="userPrivacy.firstName"
                inset></v-switch>
            </v-col>
          </v-row>

          <hr class="mb-4">

          <v-row no-gutters>
            <v-col cols="4" offset="1">
              <v-text-field
                value="Отображать фамилию"
                variant="plain"
                readonly="true">
              </v-text-field>
            </v-col>
            <v-col offset="5">
              <v-switch
                color="#6c18a1"
                v-model="userPrivacy.lastName"
                inset></v-switch>
            </v-col>
          </v-row>

          <hr class="mb-4">

          <v-row no-gutters>
            <v-col cols="4" offset="1">
              <v-text-field
                value="Отображать дату рождения"
                variant="plain"
                readonly="true">
              </v-text-field>
            </v-col>
            <v-col offset="5">
              <v-switch
                color="#6c18a1"
                v-model="userPrivacy.birthdate"
                inset></v-switch>
            </v-col>
          </v-row>

          <hr class="mb-4">

          <v-row no-gutters>
            <v-col cols="4" offset="1">
              <v-text-field
                value="Отображать почту"
                variant="plain"
                readonly="true">
              </v-text-field>
            </v-col>
            <v-col offset="5">
              <v-switch
                color="#6c18a1"
                v-model="userPrivacy.email"
                inset></v-switch>
            </v-col>
          </v-row>

          <hr class="mb-4">

          <div style="margin-left: 85%">
            <v-btn
              class="mb-2 mt-5"
              variant="elevated"
              color = "#9843cc"
            >
              Сохранить
            </v-btn>
          </div>

        </v-container>
      </div>
    </div>
  </main>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import store from "@/store/store";
import axios, {HttpStatusCode} from "axios";
import router from "@/plugins/router";

const tab = ref('personal');
const showToggle = ref(0);

const name = ref(true);

const userPrivacy = {
  firstName: true,
  lastName: true,
  birthdate: false,
  email: true
}

defineProps({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  nickname: {
    type: String
  },
  email: {
    type: String
  },
  birthdate: {
    type: String
  },
  avatarUrl: {
    type: String
  }
})

const isNicknameTaken = ref(false);
const isEmailTaken = ref(false);
const days = ref(Array.from({ length: 31 }, (_, index) => index + 1));
const months = ref(['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']);
const years = ref(Array.from({ length: 2017 - 1900 }, (_, index) => 1900 + index));

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

onBeforeMount(async () => {
  if (!(await isAuthorized())) {
    store.commit('logout');
  }
});

</script>

<style scoped>

.user-avatar img {
  width: 8em;
  height: 8em;
  border-radius: 50%;
}

.user-avatar img:hover {
  border-radius: 0%;
}

@media screen and (max-width: 767px) {
  .sorter {
    flex-direction: column;
  }
  .sorter div {
    width: 100%;
    margin-bottom: 1rem;
  }
  .sorter div:last-child {
    margin-bottom: 0;
  }
}

@media screen and (min-width: 768px) {

  .scroll {
    width: 50%;
  }
}

</style>
