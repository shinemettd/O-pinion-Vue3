<script setup>

import UserProfileComponent from "@/components/UserProfileComponent.vue";
import axios, {HttpStatusCode} from "axios";
import {useRoute} from "vue-router";
import {onBeforeMount, ref} from "vue";
import PageNotFound from "@/pages/PageNotFound.vue";
import store from "@/store/store";
const route = useRoute();
const userLink = route.params.userNickname;
const user = ref([]);
const isUserValid = ref();

const getUser = async () => {
  try {
    let response;
    if (userLink === store.state.nickname) {
      response = await axios.get(`${store.state.API_URL}/api/users/my-profile`, store.state.config);
    } else {
      response = await axios.get(`${store.state.API_URL}/api/users/nickname/${userLink}/profile`);
    }
    user.value = response.data;
    isUserValid.value = true;
  } catch (e) {
    isUserValid.value = false;
  }
}

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
  await getUser();
});
</script>

<template>
  <div v-if="isUserValid === true">
    <UserProfileComponent
                          :user-id="user.id"
                          :user-nickname="user.nickname"
                          :user-avatar-url="user.avatar || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'"
                          :user-first-name="user.firstName"
                          :user-last-name="user.lastName"
                          :user-email="user.email"
                          :user-birthdate="user.birthDate"
    />
  </div>
  <div v-else-if="isUserValid === false">
    <PageNotFound>

    </PageNotFound>
  </div>
</template>

<style scoped>

</style>
