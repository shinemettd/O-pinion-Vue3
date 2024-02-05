<script setup>

import UserProfileComponent from "@/components/UserProfileComponent.vue";
import axios from "axios";
import {useRoute} from "vue-router";
import {onBeforeMount, ref} from "vue";
const route = useRoute();
const userNickname = route.params.userNickname;
const user = ref([]);

const getUser = async () => {
  let response = await axios.get(`http://194.152.37.7:8812/api/users/nickname/${userNickname}/profile`);
  user.value = response.data;
}

onBeforeMount(() => {
  getUser()
});
</script>

<template>
  <UserProfileComponent
    :user-id="user.id"
    :user-nickname="user.nickname"
    :user-avatar-url="user.avatar || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'"
    :user-first-name="user.firstName"
    :user-last-name="user.lastName"
    :user-email="user.email"
    :user-birthdate="user.birth_date"
    :is-first-name-visible="user.is_first_name_visible"
    :is-last-name-visible="user.is_last_name_visible"
    :is-birthdate-visible="user.is_birth_date_visible"
    :is-email-visible="user.is_email_visible"
  />
</template>

<style scoped>

</style>
