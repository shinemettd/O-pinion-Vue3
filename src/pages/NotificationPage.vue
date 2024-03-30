<script setup>
import {onBeforeMount, ref} from "vue";
import axios, {HttpStatusCode} from "axios";
import store from "@/store/store";
import router from "@/plugins/router";

const notifications = ref([]);
const currentPage = ref(0);
const totalPages = ref(0);

const snackMessageText = ref('');
const showSnackMessage = ref(false);

const isDataFetched = ref(false);
const dialog = ref(false)

const getNotifications = async () => {
  const config = {
    params: {
      sort: 'dateTime,desc'
    },
    headers: {
      'Authorization': `Bearer ${store.state.userToken}`
    }
  };

  const response = (await axios.get(`${store.state.API_URL}/api/user-notifications?page=${currentPage.value}`, config)).data;
  notifications.value.push(...response.content);
  totalPages.value = response.totalPages;
  isDataFetched.value = true;
}

const setNotificationAsRead = async (notificationId) => {
  try {
    await axios.put(`${store.state.API_URL}/api/user-notifications/${notificationId}/make-read`, '', store.state.config);
  } catch (e) {
    console.log(e);
  }
}

const deleteNotification = async (notificationId) => {
  if (notifications.value.length === 0) {
    return;
  }
  try {
    await axios.delete(`${store.state.API_URL}/api/user-notifications/${notificationId}`, store.state.config);
    notifications.value = notifications.value.filter(function(element) {
      return element.id !== notificationId;
    });
    showSnackbarMessage('Уведомление удалено');
  } catch (e) {
    console.log(e);
    showSnackbarMessage('Произошла ошибка при удалении уведомления');
  }
}

const readAllNotifications = async () => {
  try {
    await axios.put(`${store.state.API_URL}/api/user-notifications/all/make-read`, '', store.state.config);
    location.reload();
  } catch (e) {
    console.log(e);
    showSnackbarMessage('Произошла ошибка при удалении уведомлений');
  }
}

const deleteAllNotifications = async () => {
  try {
    await axios.delete(`${store.state.API_URL}/api/user-notifications/all`, store.state.config);
    notifications.value = [];
  } catch (e) {
    console.log(e);
    showSnackbarMessage('Произошла ошибка при удалении уведомлений');
  }
}

const handleScrolledToBottom = (isVisible) => {
  if (!isVisible) { return };
  console.log(totalPages.value);
  if (currentPage.value >= totalPages.value) { return };
  currentPage.value += 1;
  getNotifications();
}

const showSnackbarMessage = (text) => {
  showSnackMessage.value = true;
  snackMessageText.value = text;
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

function formatDateTime(timeString) {
  const dateTime = new Date(timeString);
  const formattedDateTime = dateTime.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
  return formattedDateTime;
}

const checkNotifications = async () => {
  try {
    const notificationCount = (await axios.get(`${store.state.API_URL}/api/user-notifications/not-read-count`, store.state.config)).data;
    store.commit('setNotificationCount', notificationCount);
  } catch (e) {
    console.error(e);
  }
}

onBeforeMount(async () => {
  if (!(await isAuthorized())) {
    store.commit('logout');
  } else {
    await checkNotifications();
  }
  await getNotifications();
})
</script>

<template>
  <div class="scroll mx-auto border">
    <div class = "my-3" @click="console.log(notifications)" style="text-align: center; font-size: 2em;">
      <strong>Ваши уведомления</strong>
    </div>
    <hr>
    <div class = "notification-buttons my-3" v-if = "notifications.length > 0">
      <button class = "notification-button-read-all ml-5" @click="readAllNotifications"> {{store.state.notificationCount > 0 ? 'Прочитать все' : ''}} </button>
      <v-dialog
        v-model="dialog"
        max-width="600"
        persistent
      >
        <template v-slot:activator="{ props: activatorProps }">
          <button class = "notification-button-delete-all mr-5" v-bind="activatorProps"> Удалить все </button>
        </template>

        <v-card
          text="В дальнейшем вы не сможете восстановить уведомления"
          title="Удалить все уведомления?"
        >
          <template v-slot:actions>
            <v-spacer></v-spacer>

            <v-btn @click="dialog = false">
              Нет
            </v-btn>

            <v-btn @click="async () => { dialog = false; await deleteAllNotifications(); }">
              Да
            </v-btn>
          </template>
        </v-card>
      </v-dialog>
    </div>
    <hr class="mb-3">
    <div v-if = "notifications.length > 0" v-for="notification in notifications" :key="notification.id" class = "mx-3">
      <div class = "notification" @click="async () => {await setNotificationAsRead(notification.id)}">
        <router-link :to="notification.url">
          <div class="new-notification-message">
            <p v-if="notification.is_read === false" > <strong> Новое </strong> </p>
          </div>
          <div class="notification-header">
            <div class="notification-type">
              <p style="font-size: 1.5em"> <strong> {{ notification.title }} </strong></p>
            </div>

            <div class = "notification-delete-icon">
              <router-link to="/notifications">
                <v-icon @click="async () => { await deleteNotification(notification.id)}" title="Удалить">mdi-close</v-icon>
              </router-link>
            </div>
          </div>
          <div class="notification-content">
            <p v-html="notification.content" style="font-size: 1.25em"> </p>
          </div>
          <div class="notification-footer">
            <div class="notification-time my-1">
              <p style="font-size: 0.85em; opacity: 75%"> {{ formatDateTime(notification.date_time) }} </p>
            </div>
          </div>
        </router-link>
      </div>
      <hr class="my-2">
    </div>
    <div v-if = "notifications.length" v-observe-visibility="handleScrolledToBottom"> ААЫАЫФА </div>
    <div v-if="notifications.length === 0" class = "my-10" style="text-align: center; font-size: 1.5em;"> Уведомлений пока не видно... </div>
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
.scroll {
  width: 50%;
  box-shadow: 0px 100px 100px rgba(0, 0, 0, 0.1);
}

.notification {
  padding: 0.5em;
}

.notification:hover {
  background: #F0F0F0;
  cursor: pointer;
}

.notification-buttons {
  display: flex;
  justify-content: space-between;
}

.notification-header {
  display: flex;
  justify-content: space-between;
}

.notification-button-read-all:hover {
  color: mediumpurple;
}

.notification-button-delete-all:hover {
  color: red;
}

.notification-delete-icon {
  vertical-align: center;
  margin-bottom: 10px;
}

.notification-delete-icon:hover {
  background: #D0D0D0;
}

.new-notification-message {
  background: #FFCBD1;
  border-radius: 7%;
  max-width: 3.5em;
}

.new-notification-message p {
  margin-left: 0.25em;
  color: red;
}

@media screen and (max-width: 1920px) {
  .scroll {
    width: 50%;
  }
}

@media screen and (max-width: 1280px) {
  .scroll {
    width: 66%;
  }
}

@media screen and (max-width: 768px) {
  .scroll {
    width: 100%;
  }
}
</style>
