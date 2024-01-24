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
    articleMainPictureUrl: {
      type: String,
    },
    articleShortDescription: String,
    articleRating: Number,
    articleTotalFavourites: Number,
    articleInFavourites: {
      type: Boolean,
      default: false,
      methods: {
        changeFavouriteStatus() {
          this.articleInFavourites = !this.articleInFavourites;
        }
      }
    },
    articleTotalComments: Number,
    articleTotalViews: Number
  })
</script>

<template>
  <div class = "border">
    <div class = "flex justify-between border">
      <div>
        Ава
      </div>
      <div>
        Никнейм
      </div>
      <div>
        Давность коммента
      </div>
    </div>
    <div>
      Текст комментария
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

</style>
