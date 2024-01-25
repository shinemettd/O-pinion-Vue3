<script setup>

import CommentComponent from "@/components/CommentComponent.vue";

const props = defineProps({
  authorsNickname: String,
  authorsAvatarUrl: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/10/10938.png'
  },
  postedTimeAgo: String,
  articleId: Number,
  articleTitle: String,
  articleRating: Number,
  articleTotalFavourites: Number,
  articleInFavourites: {
    type: Boolean,
    default: false,
  },
  articleContent: String,
  articleTotalLikes: Number,
  articleTotalDislikes: Number,
  articleTotalComments: Number,
  articleTotalViews: Number
})

function formatDateTime(timeString) {
  const dateTime = new Date(timeString);
  const formattedDateTime = dateTime.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formattedDateTime;
}
</script>

<template>
  <main class = "container mx-auto">
    <div class = "scroll mx-auto border w-50 h-100 px-3 py-3">
      <div class="">
        <div class = "article-header">
          <p style = "font-size: 2em"> {{ articleTitle }} </p>
          <div class = "article-header-authors-avatar">
            <img :src = "authorsAvatarUrl" class = "my-1">
          </div>
          <div class = "">
            <p> {{ authorsNickname }}</p>
            <p> {{ formatDateTime(postedTimeAgo) }}</p>
          </div>
        </div>
      </div>
      <!--   article content     -->
      {{ articleContent }}

      <div class="border">
        Секция тегов и других приблуд
        <!--  tags  reactions etc    -->
      </div>
      <div class="border">
        Секция комментариев
        <CommentComponent/>
      </div>
    </div>
  </main>
</template>

<style scoped>
.article-header-authors-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  vertical-align: middle;
}
</style>
