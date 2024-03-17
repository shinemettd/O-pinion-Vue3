<template>
  <main class="mx-auto">
    <div class="scroll mx-auto border w-full lg:w-2/3 xl:w-1/2 h-auto lg:h-100 px-10">
      <div class = "w-full lg:w-auto mb-5 lg:mb-0 text-center lg:text-left mt-3">
      <v-btn-toggle v-model="showToggle" color="purple" class="ml-5" mandatory>
        <v-btn
          @click = "tab = 'personal'">
          Личные данные
        </v-btn>
        <v-btn
          @click = "tab = 'privacy'">
          Приватность
        </v-btn>
      </v-btn-toggle>
      </div>
      <hr>
      <div v-if = "tab === 'personal'">
        <strong> <p class = "mt-3 ml-3"> Ваши общие данные: </p></strong>
        <v-container>
          <div class = "header border-collapse mb-5" style = "display: flex;">
            <div class = "user-avatar mr-5">
              <img :src = "newAvatar || avatarUrl"
                   alt="user avatar"
                   @click="openFileChooser"
              >
              <input ref="fileInput"
                     type="file"
                     accept="image/*"
                     style="display: none"
                     @change="handleFileChange"
              >
              <p v-if="newAvatar" @click="newAvatar = null" class = "delete-avatar-text"> Очистить </p>
            </div>
            <div class = "user-data">
              <div class = "nickname-data">
                <strong> <p style = "font-size: 2em"> {{ userData.nickname }} </p> </strong>
              </div>
              <div class = "user-names">
                {{ userData.firstName }} {{ userData.lastName }}
              </div>
              <div class = "user-birthday">
                Дата рождения: {{ userData.birthDate }}
              </div>
              <div class = "user-email">
                {{ userData.email }}
              </div>
            </div>
          </div>

          <hr>

          <v-row class = "pt-10">
            <v-col cols="12" sm="6">
              <v-text-field
                label="Имя"
                :model-value="userData.firstName"
                variant="outlined"
                @update:modelValue = "newFirstName => (userData.firstName = newFirstName)"
                :error-messages = "(String(userData.firstName).length <= 0 ? 'Имя не может быть пустым' : '')"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Фамилия"
                :model-value="userData.lastName"
                variant="outlined"
                @update:modelValue = "newLastName => (userData.lastName = newLastName)"
                :error-messages = "(String(userData.lastName).length <= 0 ? 'Фамилия не может быть пустой' : '')"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                :error-messages="(isNicknameTaken ? 'Данный никнейм уже занят' : '')
                || (((String(userData.nickname).length < 4) ? 'Никнейм не может содержать меньше 4 символов' : ''))
                || (((String(userData.nickname).length > 20) ? 'Никнейм не может содержать больше 20 символов' : ''))"
                label="Никнейм"
                :model-value="userData.nickname"
                variant="outlined"
                @update:modelValue="newNickname => { userData.nickname = newNickname; checkNickname(newNickname); }"
              ></v-text-field>
            </v-col>


            <v-col cols="12" sm="2">
              <v-select
                :items="days"
                density="comfortable"
                label="День"
                :model-value="Number(userBirthdate.day)"
                variant="outlined"
                @update:model-value = "newDay => { userData.birthDate = changeUserBirthDay(newDay) }"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="2">
              <v-select
                :items="months"
                density="comfortable"
                label="Месяц"
                :model-value="months[Number(userBirthdate.month) - 1]"
                @update:model-value = "newMonth => { let validatedMonth = autoValidateDateNumber(months.indexOf(newMonth)); userData.birthDate = changeUserBirthMonth(validatedMonth); }"
                variant="outlined"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="2">
              <v-select
                :items="years"
                density="comfortable"
                label="Год"
                :model-value="Number(userBirthdate.year)"
                variant="outlined"
                @update:model-value = "newYear => { userData.birthDate = changeUserBirthYear(newYear) }"
              ></v-select>
            </v-col>

          </v-row>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                :error-messages = "(passwordValue.length < 8 && passwordValue.length !== 0) ? 'Пароль не может содержать меньше 8 символов' : ''"
                label="Смена пароля"
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
                @update:modelValue="newPassword => { passwordValue = newPassword }"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-if="passwordValue.length < 8"
                label="Подтверждение смены пароля"
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
                @update:modelValue="newConfirmationPassword => { passwordConfirmationValue = newConfirmationPassword}"
              ></v-text-field>
            </v-col>

          </v-row>
          <div style="margin-left: 85%">
            <v-btn
              class="mb-2 mt-5"
              variant="tonal"
              color = "purple"
              @click = "async () => {
                const data = {
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    birth_date: userData.birthDate,
                    nickname: userData.nickname
                }

                if (passwordValue !== '' && passwordValue === passwordConfirmationValue) {
                  try {
                    await axios.put(`${store.state.API_URL}/api/password/reset/${store.state.userToken}`, { password: passwordValue, confirm_password: passwordConfirmationValue});
                    showSnackbarMessage('Данные успешно сохранены');
                  } catch (e) {
                    showSnackbarMessage('Произошла ошибка при сохранении');
                    return;
                  }
                }
                try {
                  await axios.put(`${store.state.API_URL}/api/users/change-data`, data, store.state.config);
                  if (newAvatar !== null) {
                      await loadAvatarImageOnServer();
                  }
                  showSnackbarMessage('Данные успешно сохранены');
                } catch (e) {
                  showSnackbarMessage('Произошла ошибка при сохранении');
                }
              }"
            >
              Сохранить
            </v-btn>
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
        </v-container>
      </div>
      <div v-else-if="tab === 'privacy'">
        <strong> <p class = "mt-3 ml-3"> То, как другие пользователи будут видеть ваш профиль: </p></strong>

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
                <strong> <p style = "font-size: 2em" > {{ userData.nickname }} </p> </strong>
              </div>
              <div class = "user-names">
                <span v-show = "userPrivacySettings.is_first_name_visible" class = "mr-1"> {{ userData.firstName }} </span>
                <span v-show = "userPrivacySettings.is_last_name_visible"> {{ userData.lastName }} </span>
              </div>
              <div class = "user-birthday" v-show = "userPrivacySettings.is_birth_date_visible">
                Дата рождения: {{ userData.birthDate }}
              </div>
              <div class = "user-email" v-show = "userPrivacySettings.is_email_visible">
                {{ userData.email }}
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
                v-model="userPrivacySettings.is_first_name_visible"
                @update:modelValue = "newFirstNameValue => { userPrivacySettings.is_first_name_visible = newFirstNameValue }"
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
                v-model="userPrivacySettings.is_last_name_visible"
                @update:modelValue = "newLastNameValue => { userPrivacySettings.is_last_name_visible = newLastNameValue }"
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
                v-model="userPrivacySettings.is_birth_date_visible"
                @update:modelValue = "newBirthdateValue => { userPrivacySettings.is_birth_date_visible = newBirthdateValue }"
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
                v-model="userPrivacySettings.is_email_visible"
                @update:modelValue = "newEmailValue => { userPrivacySettings.is_email_visible = newEmailValue }"
                inset></v-switch>
            </v-col>
          </v-row>

          <hr class="mb-4">

          <div style="margin-left: 85%">
            <v-btn
              class="mb-2 mt-5"
              variant="tonal"
              color = "#9843cc"
              @click = "async () => {
                try {
                  await axios.put(`${store.state.API_URL}/api/privacy/change`, userPrivacySettings, store.state.config);
                  showSnackbarMessage('Данные успешно сохранены');
                } catch (e) {
                  showSnackbarMessage('Произошла ошибка при сохранении');
                  console.error(e);
                }
              }"
            >
              Сохранить
            </v-btn>
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
const showSnackMessage = ref(false);
const snackMessageText = ref('');

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
const passwordValue = ref('');
const passwordConfirmationValue = ref('');
const showPasswordValue = ref(false)
const showPasswordConfirmationValue = ref(false)

const days = ref(Array.from({ length: 31 }, (_, index) => index + 1));
const months = ref(['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']);
const years = ref(Array.from({ length: 2017 - 1900 }, (_, index) => 1900 + index));

const userData = ref({});

const userBirthdate = ref({
  day: null,
  month: null,
  year: null
})

const userPrivacySettings = ref({});

const avatarUrl = ref('https://cdn-icons-png.flaticon.com/512/10/10938.png');
const fileInput = ref(null);
const newAvatar = ref(null);
const newAvatarAsFile = ref(File);
const openFileChooser = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {

    if (!file.type.startsWith('image/')) {
      showSnackbarMessage('Выбранный файл не является изображением.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      showSnackbarMessage('Максимальный размер картинки 4 МБ');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 400 || img.height < 400) {
          showSnackbarMessage('Картинка не может быть разрешения меньше 400х400');
          return;
        } else if (img.width > 2000 || img.height > 2000) {
          showSnackbarMessage('Картинка не может быть разрешения больше 2000х2000');
          return;
        }
        newAvatar.value = reader.result;
      };
      img.src = reader.result;
    };

    newAvatarAsFile.value = file;
  }
};

const showSnackbarMessage = (text) => {
  showSnackMessage.value = true;
  snackMessageText.value = text;
}

const distributeBirthdate = async (date) => {
  date = date.split('-').reverse();
  userBirthdate.value = {
    day: date[0],
    month: date[1],
    year: date[2]
  };
}

const changeUserBirthDay = (day) => {
  let dateArray = (userData._rawValue.birthDate).split('-');
  dateArray[2] = day;
  let newDate = dateArray.join('-');
  distributeBirthdate(newDate)
  return newDate;
}

const changeUserBirthMonth = (month) => {
  let dateArray = (userData._rawValue.birthDate).split('-');
  dateArray[1] = month;
  let newDate = dateArray.join('-');
  distributeBirthdate(newDate)
  return newDate;
}

const changeUserBirthYear = (year) => {
  let dateArray = (userData._rawValue.birthDate).split('-');
  dateArray[0] = year;
  let newDate = dateArray.join('-');
  distributeBirthdate(newDate)
  return newDate;
}

const autoValidateDateNumber = (dateNumber) => {
  try {
    dateNumber = String(Number(dateNumber) + 1);
    if (Number(dateNumber) < 10) {
      dateNumber = '0' + dateNumber;
    }
  } catch (e) {
    console.error(e);
  }
  return dateNumber;
}

const checkNickname = async (nickname) => {
  if (nickname === store.state.nickname) {
    isNicknameTaken.value = false;
    return;
  }
  try {
    const response = await axios.get(`${store.state.API_URL}/api/users/nickname/${nickname}/profile`);
    if (response.status === HttpStatusCode.Ok) {
      isNicknameTaken.value = true;
    } else {
      isNicknameTaken.value = false;
    }
  } catch (e) {
    isNicknameTaken.value = false;
  }
}

const getUserData = async () => {
  try {
    userData.value = (await axios.get(`${store.state.API_URL}/api/users/my-profile`, store.state.config)).data;
    avatarUrl.value = userData._rawValue.avatar;
    await distributeBirthdate(userData._rawValue.birthDate);
  } catch (e) {
    console.error(e);
  }
}

const getUserPrivacySettings = async () => {
  try {
    userPrivacySettings.value = (await axios.get(`${store.state.API_URL}/api/privacy`, store.state.config)).data;
  } catch (e) {
    console.error(e);
  }
}

const loadAvatarImageOnServer = async () => {
  try {
    const formData = new FormData();
    formData.append('photo', newAvatarAsFile._value);
    await axios.put(`${store.state.API_URL}/api/images/change-avatar`, formData, {
      headers: {
        'Authorization': `Bearer ${store.state.userToken}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    showSnackbarMessage('Изображение успешно загружено:');
  } catch (error) {
    showSnackbarMessage('При загрузки изображения произошла ошибка');
  }
}

const isAuthorized = async () => {
  if (store.state.nickname === null) {
    await router.push('/');
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
  await getUserData();
  await getUserPrivacySettings();
});

</script>

<style scoped>

.user-avatar img {
  width: 9em;
  height: 9em;
  border-radius: 50%;
}

.user-avatar img:hover {
  filter: brightness(50%);
  cursor: pointer;
}

.delete-avatar-text {
  margin-left: 2.25em;
}

.delete-avatar-text:hover {
  cursor: pointer;
  color: red;
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
