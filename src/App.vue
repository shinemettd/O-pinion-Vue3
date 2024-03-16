<template>
  <v-app>
    <v-main>
      <Navbar :isUserAthorized = 'store.state.isAuthorized'/>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import store from "@/store/store";
</script>
