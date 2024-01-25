<template>
  <article class = "article-block">
    <div class = "article-content">
      <div class = "article-header">
        <div class = "article-header-data">
          <div class = "article-authors-avatar">
            <router-link :to="'/user/' + authorsNickname">
              <img :src="authorsAvatarUrl" alt = "Users avatar picture">
            </router-link>
          </div>
          <div class = "article-authors-nickname">
            <router-link :to="'/user/' + authorsNickname">
              <p style = "font-weight: 700;"> {{ authorsNickname }}</p>
            </router-link>
          </div>
          <div class = "article-recently-date">
            <router-link :to="'/article/' + articleId">
              <p> {{ postedTimeAgo }} </p>
            </router-link>
          </div>
        </div>
        <div class = "article-header-report">
          <div class = "article-header-report-icon">
            <img src="/icons/alert_circle_icon.svg" @click="getNewArticles" alt = "Report Icon">
            <!-- instead of getNewArticles on click should be a method calling to show a window with report -->
          </div>
        </div>
      </div>
      <div class = "article-data">
        <div class = "article-title">
          <router-link :to="'/article/' + articleId">
            <p> {{ articleTitle }} </p>
          </router-link>
        </div>
        <div v-if = "articleMainPictureUrl !== '' && articleMainPictureUrl !== null" class = "article-picture">
          <router-link :to="'/article/' + articleId">
            <img :src = "articleMainPictureUrl" alt = "Main picture of article preview">
          </router-link>
        </div>
        <div class = "article-description">
          <p> {{ articleShortDescription }} </p>
        </div>
        <div class = "article-read-more">
          <router-link :to="'/article/' + articleId" class="navbar-item">
            <v-btn style="margin-top: 10px; margin-bottom: 10px;">Читать далее</v-btn>
          </router-link>
        </div>
        <div class = "article-footer-bar">
          <div class = "article-footer">
            <div class = "article-rating">
              <div class = "article-rating-icon">
                <img src="/icons/zap_icon.svg" alt="Rating Icon">
              </div>
              <b v-if = "articleRating>0" style="color: green">{{ articleRating }}</b>
              <b v-else-if="articleRating<0" if = "articleRating>0" style="color: red">{{ articleRating }}</b>
              <b v-else style="color: black">{{ articleRating }}</b>
            </div>
            <div class = "article-favourites">
                <div v-if="articleInFavourites" class = article-in-favourites-icon @click="() => { articleInFavourites = !articleInFavourites; articleTotalFavourites++; }">
                  <img src="/icons/star_icon.svg" alt = "Favourites Icon">
                </div>
                <div v-else class = article-not-in-favourites-icon @click="() => { articleInFavourites = !articleInFavourites; articleTotalFavourites--; }">
                  <img src="/icons/star_icon.svg" alt = "Not Favourites Icon">
                </div>
                <b> {{ articleTotalFavourites }}</b>
            </div>
            <div class = "article-share">
                <div class = "article-share-icon">
                  <img src="/icons/corner_up_right_icon.svg" alt = "Share Icon">
                </div>
            </div>
            <div class = "article-comments">
                <div class = "article-comments-icon">
                  <router-link :to="'/article/' + articleId" class="navbar-item">
                    <img src="/icons/message_square_icon.svg" alt="Comments Icon">
                  </router-link>
                </div>
                <b>{{ articleTotalComments }}</b>
            </div>
            <div class = "article-views-count">
              <div class = "article-views-icon">
                <img src ="/icons/eye_icon.svg" alt="Image Icon">
              </div>
              <b>{{ articleTotalViews }}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import axios from 'axios';

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
        console.log('smth');
        if (this.articleInFavourites) {
          this.articleTotalFavourites.value += 1;
        } else {
          this.articleTotalFavourites.value -= 1;
        }
      }
    }
  },
  articleTotalComments: Number,
  articleTotalViews: Number
})

// const articlesArray = ref([]);
async function getNewArticles() {
  let articles = await axios.get('http://194.152.37.7:8812/api/articles');
  let articlesArray = articles.data.content;
  console.log(articlesArray[0].author.id);
}

// onMounted(getNewArticles);
</script>

<style scoped>
article {
  width: 95%;
  border: solid 1px #350454FF;
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
}

.article-authors-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  vertical-align: middle;
}

.article-recently-date {
  margin-left: 0.75em;
  opacity: 75%;
}

.article-recently-date:hover {
  cursor: pointer;
  text-decoration: underline;
}

.article-header-report {
  float: right;
  vertical-align: middle;
  cursor: pointer;
}

.article-header-report-icon {
  opacity: 25%;
  transition: all 0.35s ease;
}

.article-header-report-icon:hover {
  opacity: 100%;
}

.article-title {
  max-width: 90%;
}

.article-data div:not(:last-child) {
  margin-bottom: 5px;
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

.article-content {
  padding: 1.5em 1.5em 1.5em 1.5em;
  word-wrap: break-word;
}
</style>
