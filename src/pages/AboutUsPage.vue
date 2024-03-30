<script setup>

</script>

<template>
  <div class = "grid mx-auto w-30 pa-10 border rounded-lg shadow-lg">
    <h1 class="main-text">Над проектом работала команда "Доска объявлений" в рамках программы Intern Labs 5.0 Java Developer в составе участников:</h1>
    <div class = "members-list mt-10">
      <li> <a href="https://t.me/azid1n" target="_blank" class="member">Азидин Аманкулов </a></li>
      <li> <a href="https://t.me/invsblmad" target="_blank" class="member">Айзат Мадумарова</a> </li>
      <li> <a href="https://t.me/genriettakim" target="_blank" class="member">Галина Ким</a> </li>
      <li> <a href="https://t.me/shinemetothedeath" target="_blank" class="member">Давид Остапченко</a></li>
      <li> <a href="https://t.me/yumzack" target="_blank" class="member">Диёр Умурзаков</a> </li>
    </div>
    <h1 class = "git-link mt-10 text-center"> <a href="https://labs.o.kg:3443/opinion-bulletin-board" target="_blank"> Ссылка на GitLab репозиторий </a> </h1>
  </div>
</template>

<style scoped>
.main-text, .members-list {
  font-size: 1.25em;
}

.grid {
  width: 35%;
  margin-top: 10%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.git-link {
  font-size: 1.5em;
  color: cornflowerblue;
}

.git-link:hover, .member:hover {
  color: red;
  transition: all 0.35s ease;
}

@media screen and (max-width: 1280px) {
  .grid {
    width: 52%;
  }
}


@media screen and (max-width: 900px) {
  .grid {
    width: 75%;
  }
}

@media screen and (max-width: 720px) {
  .grid {
    margin-top: 10em;
    width: 100%;
  }
}

</style>
