<template>
  <v-app>
    <v-main>
      <!-- <HelloWorld/> -->
      <div>
        <Navbar />
        <router-view/>
      </div>
    </v-main>
  </v-app>
</template>

<script>
  import Navbar from './components/Navbar.vue'

  export default {
    components: {
      Navbar
    }
  }
</script>

<style>
nav a {
  margin: 10px;
  text-decoration: none;
  color: #42b983;
}
</style>
