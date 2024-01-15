<template>
  <article class = "article-block">
    <div class = "article-content">
      <div class = "article-header">
        <div class = "article-header-data">
          <div class = "article-authors-avatar">
            <a :href="authorsNickname"> <!--  here is described a path to localhost:8811/nickname  -->
              <img :src="authorsAvatarUrl" alt = "users avatar picture">
            </a>
          </div>
          <div class = "article-authors-nickname">
            <a :href="authorsNickname"> <!--  here is described a path to localhost:8811/nickname  -->
              <p> {{ authorsNickname }}</p>
            </a>
          </div>
          <div class = "article-recently-date">
            <a :href="articleId"> <!--  here is described a path to localhost:8811/articleId  -->
              <p> {{ postedTimeAgo }} </p>
            </a>
          </div>
        </div>
        <div class = "article-header-options">
           <p @mouseenter="showMsg" @mouseleave=""> Еще </p>
            <!--          <p> Еще </p>-->
        </div>
      </div>
      <div class = "article-data">
        <div class = "article-title">
          <a :href="articleId">
            <p> {{ articleTitle }} </p>
          </a>
        </div>
        <div v-if = "articleMainPictureUrl !== ''" class = "article-picture">
          <img :src = "articleMainPictureUrl" alt = "main picture of article preview">
        </div>
        <div class = "article-description">
          <p> {{ articleShortDescription }} </p>
        </div>
        <div class = "article-read-more">
          <a :href="'/' + articleId"> <!--  here is described a path to localhost:8811/articleId  -->
            <v-btn style="margin-top: 10px; margin-bottom: 10px;">Читать далее</v-btn>
          </a>
        </div>
        <div class = "article-actions-bar">
          <div class = "article-actions">
            <div class = "article-rating">
              <p>Рейтинг: {{ articleRating }}</p>
            </div>
            <div class = "article-favourites">
              <a href="/">
                <p>Избранное: {{ articleTotalFavourites }}</p>
              </a>
            </div>
            <div class = "article-share">
              <a href="/">
                <p>Поделиться </p>
              </a>
            </div>
            <div class = "article-comments">
              <a :href="'/comments/'+ articleId">
                <p>Комментариев: {{ articleTotalComments }}</p>
              </a>
            </div>
            <div class = "article-views-count">
              <p>Просмотров: {{ articleTotalViews }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
const showMsg = () => {
  alert('?')
  console.log('навелись')
}
defineProps({
  authorsNickname: String,
  authorsAvatarUrl: String,
  postedTimeAgo: String,
  articleId: Number,
  articleTitle: String,
  articleMainPictureUrl: String,
  articleShortDescription: String,
  articleRating: Number,
  articleTotalFavourites: Number,
  articleTotalComments: Number,
  articleTotalViews: Number
})
</script>

<style scoped>
article {
  width: 45%;
  border: solid 1px black;
  border-radius: 20px;
  box-sizing: border-box;
  margin: 0 auto;
}

.article-header div {
  display: inline-block;
  vertical-align: middle;
}

.article-authors-nickname {
  margin-left: 0.75em;
}

.article-header-data {
  margin-bottom: 10px;
}

.article-header-data a {
  text-decoration: none;
  color: black;
}

.article-authors-nickname a,
.article-title a
{
  text-decoration: none;
  color: black;
  transition: all 0.35s ease;
}
.article-authors-nickname a:hover,
.article-title a:hover {
  color: rgb(120, 194, 255);
  transition: all 0.35s ease;
}

.article-authors-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  vertical-align: middle;
}

.article-recently-date {
  margin-left: 0.75em;
}

.article-header-options {
  float: right;
  vertical-align: middle;
}

.article-title p {
  font-size: 24px;
}

.article-picture img {
  max-width: 100%;
  max-height: 80%;
  display: block;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 10px;
}

.article-actions div {
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
}

.article-favourites a {
  color: black;
}

.article-favourites a:hover {
  color: blue;
}

.article-share a,
.article-favourites a,
.article-comments a {
  text-decoration: none;
  color: black;
}

.article-views-count p {
  float: right;
  vertical-align: middle;
}

.article-content {
  padding: 1.5em 1.5em 1.5em 1.5em;
  word-wrap: break-word;
}
</style>
