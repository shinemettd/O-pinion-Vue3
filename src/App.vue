<template>
  <v-app>
    <v-main>
      <Navbar :isUserAthorized = 'isUserAuthorized'/>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
  import Navbar from "@/components/Navbar.vue";
  import {useStore} from 'vuex';

  const store = useStore();

  const isUserAuthorized = store.state.isAuthorized;
</script>
