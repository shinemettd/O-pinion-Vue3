<template>
    <div>
      <SettingsProfileComponent
        first-name = ""
        last-name = ""
        nickname=""
        email=""
        :avatar-url="'' || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'"
      />
    </div>
</template>

<script setup>

import {onBeforeMount} from "vue";
import store from "@/store/store";
import axios, {HttpStatusCode} from "axios";
import SettingsProfileComponent from "@/components/SettingsProfileComponent.vue";

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
});

</script>

<style scoped>

</style>
