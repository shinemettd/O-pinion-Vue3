<template>
  <v-app>
    <v-main>
      <Navbar :isUserAthorized = 'store.state.isAuthorized' style="margin-bottom: 50px"/>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import store from "@/store/store";
</script>
