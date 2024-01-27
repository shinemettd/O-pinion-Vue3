<script setup>

import CommentComponent from "@/components/CommentComponent.vue";
import {ref} from "vue";

const reaction = ref('');

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
  articleTotalViews: Number,
  articleComments: String
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
        <div class = "article-header border">
          <p style = "font-size: 2em"> {{ articleTitle }} </p>
          <div class = "user-avatar">
            <img :src = "authorsAvatarUrl" class = "my-1">
          </div>
          <div class = "">
            <p> {{ authorsNickname }}</p>
            <p> {{ formatDateTime(postedTimeAgo) }}</p>
          </div>
        </div>
      </div>
      <!--   article content     -->
      <p class = "border my-3"> Контент статьи будет здесь </p>

      {{ articleContent }}

      <div class="border my-3">
        Секция тегов
        <!--  tags  reactions etc    -->
      </div>

      <div class = "article-footer-bar">
        <div class = "article-footer">
          <div class = "article-rating">
            <div class = "article-rating-icon">
              <img class = "article-reaction" src="/icons/chevron_up_icon.svg" alt="Rating Icon" @click="() => { if (reaction !== 'liked') { articleRating++; reaction = 'liked';  } }">
            </div>
            <b v-if = "articleRating > 0" style="color: green">{{ articleRating }}</b>
            <b v-else-if="articleRating < 0" if = "articleRating>0" style="color: red">{{ articleRating }}</b>
            <b v-else style="color: black">{{ articleRating }}</b>
            <div class = "article-rating-icon ml-3">
              <img class = "article-reaction" src="/icons/chevron_down_icon.svg" alt="Rating Icon" @click="() => { if (reaction !== 'disliked') { articleRating--; reaction = 'disliked'; } }">
            </div>
          </div>
          <div class = "article-favourites">
            <div v-if="articleInFavourites" class = article-in-favourites-icon @click="() => { articleInFavourites = !articleInFavourites; articleTotalFavourites--; }">
              <img src="/icons/star_icon.svg" alt = "Favourites Icon">
            </div>
            <div v-else class = article-not-in-favourites-icon>
              <img src="/icons/star_icon.svg" alt = "Not Favourites Icon" @click="() => { articleInFavourites = !articleInFavourites; articleTotalFavourites++; }">
            </div>
            <b> {{ articleTotalFavourites }}</b>
          </div>
          <div class = "article-share">
            <div class = "article-share-icon">
              <img src="/icons/corner_up_right_icon.svg" alt = "Share Icon">
            </div>
          </div>
          <div class = "article-views-count">
            <div class = "article-views-icon">
              <img src ="/icons/eye_icon.svg" alt="Image Icon">
            </div>
            <b>{{ articleTotalViews }}</b>
          </div>
        </div>
      </div>

      <div class="my-3">
        <p style="font-size: 1.5em"> {{articleTotalComments}} комментариев</p>
        <div class = "comments-list my-3 border" v-for = "comment in articleComments.content" :key="comment.id">
          <div>
            <div class = "user-avatar">
              <img :src = comment.user.avatar>
            </div>
            <div>
              {{ comment.user.nickname }}
            </div>
            <div>
              {{ comment.date }}
            </div>
          </div>
          <div>
            {{ comment.text }}
          </div>
          <div>
            <div>
              Ответить
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.user-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  vertical-align: middle;
}

.article-footer div {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}

.article-footer div img {
  vertical-align: middle;
}

.article-footer > div:not(:last-child) {
  margin-right: 35px;
}

.article-not-in-favourites-icon {
  opacity: 50%;
}

.article-not-in-favourites-icon:hover {
  cursor: pointer;
  opacity: 100%;
}

.article-reaction {
  cursor: pointer;
}

.article-in-favourites-icon {
  opacity: 100%;
}

.article-in-favourites-icon:hover {
  cursor: pointer;
  opacity: 50%;
}

.article-comments,
.article-rating,
.article-favourites {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.article-comments p {
  font-size: 20px;
}

.article-comments-icon {
  vertical-align: middle;
}

.article-share-icon {
  vertical-align: center;
}

.article-views-count {
  float: right;
  vertical-align: middle;
}

.article-views-count p {
  float: right;
  vertical-align: middle;
}
</style>
