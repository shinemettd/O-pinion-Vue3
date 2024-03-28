<script setup>
import {onBeforeMount, ref} from "vue";
import axios, {HttpStatusCode} from "axios";
import store from "@/store/store";
import router from "@/plugins/router";

const notifications = ref([]);

const getNotifications = async () => {
  notifications.value = (await axios.get(`${store.state.API_URL}/api/user-notifications`, store.state.config)).data.content;
  console.log(notifications);
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

onBeforeMount(async () => {
  if (!(await isAuthorized())) {
    store.commit('logout');
  }
  await getNotifications();
})
</script>

<template>
  <div class="scroll mx-auto border">
    <div class = "my-3" @click="console.log(notifications)" style="text-align: center; font-size: 2em;">
      <strong>Ваши уведомления</strong>
    </div>
    <hr class="mb-3">
    <div v-if = "notifications.length > 0" v-for="notification in notifications" :key="notification.id" class = "notification mx-3">
      <p v-if="notification.is_read === false" style = "color: red"> <strong> НЕ ПРОЧИТАНО </strong> </p>
      <div class="notification-header">
        <div class="notification-type">
          <p style="font-size: 1.5em"> <strong> {{ notification.title }} </strong></p>
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
      <hr class="mb-2">
    </div>

  </div>
</template>

<style scoped>
.notification:hover {
  background: #F0F0F0;
  cursor: pointer;
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
