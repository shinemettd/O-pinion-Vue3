<script setup>
import {ref} from "vue";

const reaction = ref('');

defineProps({
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
  articleComments: String,
  articleCommentsReplies: String
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
      <hr>
      <div class = "article-header mt-3">
        <p style = "font-size: 2em"> {{ articleTitle }} </p>
        <div class = "article-header-data my-2" style = "display: flex">
          <div class = "user-avatar mr-3">
            <router-link :to="'/user/' + authorsNickname">
              <img :src = "authorsAvatarUrl" class = "my-1 mt-2" alt = "user avatar">
            </router-link>
          </div>
          <div class = "">
            <router-link :to="'/user/' + authorsNickname">
              <p style = "font-size: 1.25em"> <strong> {{ authorsNickname }} </strong> </p>
            </router-link>

            <p> {{ formatDateTime(postedTimeAgo) }}</p>
          </div>
        </div>
      </div>
      <!--   article content     -->
      <p class = "my-3" style = "font-size: 1.25em"> {{ articleContent }} </p>


      <div class="my-3">
        Секция тегов
        <!--  tags  reactions etc    -->
      </div>
      <hr class = "my-3">
      <div class = "article-footer-bar">
        <div class = "article-footer">
          <div class = "article-rating">
            <div class = "article-rating-icon">
              <img class = "article-reaction" src="/icons/chevron_up_icon.svg" alt="Rating Icon" @click="() => {
                if (reaction === 'disliked') { articleRating += 2; reaction = 'liked'; }
                else if (reaction !== 'liked' && reaction !== 'disliked') { articleRating++; reaction = 'liked'; }
                else { articleRating--; reaction = ''}
              }">
            </div>
            <b v-if = "articleRating > 0" style="color: green">{{ articleRating }}</b>
            <b v-else-if="articleRating < 0" if = "articleRating>0" style="color: red">{{ articleRating }}</b>
            <b v-else style="color: black">{{ articleRating }}</b>
            <div class = "article-rating-icon ml-3">
              <img class = "article-reaction" src="/icons/chevron_down_icon.svg" alt="Rating Icon" @click="() => {
                if (reaction === 'liked') { articleRating -= 2; reaction = 'disliked'; }
                else if (reaction !== 'liked' && reaction !== 'disliked') { articleRating--; reaction = 'disliked'; }
                else { articleRating++; reaction = ''}
              }">
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
      <hr class = "my-3">

      <div class="my-5">
        <p style="font-size: 1.5em"> Комментарии <strong> {{articleTotalComments}}</strong> </p>
        <div v-show = "articleTotalComments === 0" class = "px-5 pt-5" style = "font-style: italic">
          Комментариев пока нет :(
        </div>
        <div class = "comments-list my-5" v-for = "comment in articleComments.content" :key="comment.id">
            <div class = "info-header">
              <div class = "user-avatar">
                <router-link :to="`/user/${comment.user.nickname}`">
                  <img :src="comment.user.avatar" style = "margin-top: 0.35em; margin-right: 0.75em" alt = "Users avatar picture">
                </router-link>
              </div>
              <div class = "comment-user-data">
                <router-link :to="`/user/${comment.user.nickname}`">
                  <p style = "font-weight: 700;"> {{ comment.user.nickname }}</p>
                </router-link>
                  <p v-if = "comment.altered" style = "font-size: 0.75em" class = "inline-block"> {{ formatDateTime(comment.date) }} (Изменено) </p>
                  <p v-else style = "font-size: 0.75em" class = "inline-block"> {{ formatDateTime(comment.date) }} </p>
              </div>
            </div>
            <div class="my-2 ml-11">
              <div style = "font-size: 1.15em">
                <p>
                  {{ comment.text }}
                </p>
              </div>
              <div class = "my-2" style = "font-size: 0.85em">
                  <span> Ответить </span>
              </div>
            </div>

          <div v-if = "comment.replies > 0">
            <div class = "replies-list my-5 ml-11" v-for = "reply in articleCommentsReplies.content" :key="reply.id">
              <div class = "info-header">
                <div class = "user-avatar">
                  <router-link :to="`/user/${reply.user.nickname}`">
                    <img :src="reply.user.avatar" style = "margin-top: 0.35em; margin-right: 0.75em" alt = "Users avatar picture">
                  </router-link>
                </div>
                <div class = "comment-user-data">
                  <router-link :to="`/user/${reply.user.nickname}`">
                    <p style = "font-weight: 700;"> {{ reply.user.nickname }}</p>
                  </router-link>
                  <p v-if = "reply.altered" style = "font-size: 0.75em" class = "inline-block"> {{ formatDateTime(reply.date) }} (Изменено) </p>
                  <p v-else style = "font-size: 0.75em" class = "inline-block"> {{ formatDateTime(reply.date) }} </p>
                </div>
              </div>
              <div class="my-2 ml-11">
                <div style = "font-size: 1.15em">
                  {{ reply.text }}
                </div>
              </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.user-avatar img {
  width: 2.5em;
  height: 2.5em;
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

.info-header {
  display: flex;
  vertical-align: middle;
}

.comment-header div {
  margin-right: 0.5em;
  margin-bottom: 0.5em;
}

.comment-user-data a
{
  text-decoration: none;
  color: black;
  transition: all 0.35s ease;
}
.comment-user-data a:hover {
  color: rgb(120, 194, 255);
}
</style>
