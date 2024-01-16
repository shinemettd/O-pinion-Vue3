<template>
  <div class = "button-container">
    <v-btn v-if = "!firstTextVisible" @click = "showText('first')" class = "custom-btn">Get from first API</v-btn>
    <h1 class = "custom-text"> {{ firstResponseText }}</h1>
    <v-btn v-if = "!secondTextVisible" @click = "showText('second')" class = "custom-btn">Get from second API</v-btn>
    <h1 class = "custom-text"> {{ secondResponseText }}</h1>
  </div>
</template>

<script setup>
  import {ref} from 'vue';
  const firstTextVisible = ref(false);
  const secondTextVisible = ref(false);
  const firstResponseText = ref('');
  const secondResponseText = ref('');
  async function showText(value) {
    const response = value === 'first' ? await fetch('http://194.152.37.7:8812/') : await fetch('http://194.152.37.7:7712/');
    if (response.ok) {
      if (value === 'first') {
        firstTextVisible.value = true;
        firstResponseText.value = await response.text();
      } else {
        secondTextVisible.value = true;
        secondResponseText.value = await response.text();
      }
    }
  }
</script>

<style scoped>
.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.custom-btn,
.custom-text {
  margin-top: 25px;
}

</style>
