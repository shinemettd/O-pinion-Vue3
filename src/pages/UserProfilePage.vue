<script setup>

import UserProfileComponent from "@/components/UserProfileComponent.vue";
import axios from "axios";
import {useRoute} from "vue-router";
import {onBeforeMount, ref} from "vue";
const route = useRoute();
const userNickname = route.params.userId;
console.log(userNickname)

const user = ref('');

const getUser = async () => {
  // user.value = await axios.get('http://194.152.37.7:8812/api/users/1/profile');
  console.log(await axios.get('http://194.152.37.7:8812/api/users/1/profile'))
  console.log('user page get')
  console.log(user)
}

onBeforeMount(() => {
  getUser()
});
</script>

<template>
  <UserProfileComponent/>
</template>

<style scoped>

</style>
