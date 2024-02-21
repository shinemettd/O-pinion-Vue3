<script setup>

import UserProfileComponent from "@/components/UserProfileComponent.vue";
import axios from "axios";
import {useRoute} from "vue-router";
import {onBeforeMount, ref} from "vue";
import PageNotFound from "@/pages/PageNotFound.vue";
const route = useRoute();
const userNickname = route.params.userNickname;
const user = ref([]);
const isUserValid = ref();

const getUser = async () => {
  try {
    let response = await axios.get(`http://194.152.37.7:8812/api/users/nickname/${userNickname}/profile`);
    user.value = response.data;
    isUserValid.value = true;
  } catch (e) {
    isUserValid.value = false;
  }
}

onBeforeMount(() => {
  getUser()
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
