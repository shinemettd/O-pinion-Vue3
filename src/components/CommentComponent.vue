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
  <div class = "border">
    <div class = "flex justify-between border">
      <div class="authors-avatar" alt = "avatar">
        <img :src="authorsAvatarUrl">
      </div>
      <div>
        {{ authorsNickname }}
      </div>
      <div>
        {{ formatDateTime(postedTimeAgo) }}
      </div>
    </div>
    <div>
      {{ commentText }}
    </div>
    <div class = "border">
      <div>
        Лайки/дизлайки
      </div>
      <div>
        Ответить
      </div>
    </div>
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
