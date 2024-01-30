<script setup>
import CommentComponent from "@/components/CommentComponent.vue";

const props = defineProps({
    authorsNickname: String,
    authorsAvatarUrl: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/10/10938.png'
    },
    postedTimeAgo: String,
    commentId: Number,
    commentText: String
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
    <div class = "info-header">
      <div class = "user-avatar">
        <router-link :to="`/user/${authorsNickname}`">
          <img :src="authorsAvatarUrl" style = "margin-top: 0.35em; margin-right: 0.75em" alt = "Users avatar picture">
        </router-link>
      </div>
      <div class = "comment-user-data">
        <router-link :to="'/user/$${authorsNickname}'">
          <p style = "font-weight: 700;"> {{ authorsNickname }}</p>
        </router-link>
        <p style = "font-size: 0.75em"> {{ formatDateTime(postedTimeAgo) }} </p>
      </div>
    </div>
    <div class="my-2 ml-11">
      <div style = "font-size: 1.15em">
        {{ commentText }}
      </div>
      <div class = "my-2" style = "font-size: 0.85em">
        <span> Ответить </span>
      </div>
    </div>

    <div v-if = "comment.replies > 0">
      БОЛЬШЕ 0 ОТВЕТОВ
    </div>
</template>

<style scoped>
.authors-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  vertical-align: middle;
}
</style>
