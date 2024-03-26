<script setup>
import {onBeforeMount, ref} from "vue";
import axios, {HttpStatusCode} from "axios";
import store from "@/store/store";
import router from "@/plugins/router";

const notifications = ref();

const getNotifications = async () => {
  notifications.value = axios.get(`${store.state.API_URL}/api/user-notifications`, store.state.config);
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

onBeforeMount(async() => {
  if (!(await isAuthorized())) {
    store.commit('logout');
  }
  await getNotifications();
})
</script>

<template>
  <div class="notification">
    <div>
      Modal notification
    </div>
    <div>
      <button> close </button>
    </div>
  </div>
</template>

<style scoped>

</style>
