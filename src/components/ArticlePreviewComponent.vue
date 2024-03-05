<script setup>
import axios from "axios";
import {useStore} from "vuex";
import {ref} from "vue";
import router from "@/plugins/router";
import ContentRender from "@/components/ContentRender.vue";

const store = useStore();
const reportReason = ref('');
const reportReasonText = ref('');
const shareBy = ref('link');
const shareSortToggle = ref(0);
const shareLink = ref('');

defineProps({
  showWithoutHeader: {
    type: Boolean,
    default: false
  },
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
  },
  articleTotalComments: Number,
  articleTotalViews: Number
})

function formatDateTime(timeString) {
  const dateTime = new Date(timeString);
  return dateTime.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

async function addToFavourites(articleId) {
  try {
    await axios.post(`http://194.152.37.7:8812/api/saved-articles/${articleId}`, '', store.state.config);
    console.log(`Статья ${articleId} добавлена в избранное пользователя ${store.state.nickname}`);
  } catch (e) {
    console.log(e)
  }
}

async function deleteFromFavourites(articleId) {
  try {
    await axios.delete(`http://194.152.37.7:8812/api/saved-articles/${articleId}`, store.state.config);
    console.log(`Статья ${articleId} удалена из избранного пользователя ${store.state.nickname}`);
  } catch (e) {
    console.log(e)
  }
}
const shareArticle = async (articleId, shareType) => {
  shareBy.value = shareType;
  if (shareBy.value === 'link') {
    shareLink.value = (await axios.get(`http://194.152.37.7:8812/api/articles/${articleId}/share`)).data;
  } else {
    shareLink.value =  (await axios.get(`http://194.152.37.7:8812/api/articles/${articleId}/share?share-type=${shareType}`)).data;
  }
}

const copyText = (text) => {
    navigator.clipboard.writeText(text);
}
</script>

<script>
export default {
  data () {
    return {
      reportReason: '',
      reportReasonText: ''
    }
  }
}
</script>

<template>
  <article class = "article-block">
    <div class = "article-content">
      <div v-show = "!showWithoutHeader" class = "article-header">
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
              <p> {{ formatDateTime(postedTimeAgo) }} </p>
            </router-link>
          </div>
        </div>
        <div class = "article-header-report">
          <div class = "article-header-report-icon">
            <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <img src="/icons/alert_circle_icon.svg" alt = "icon" v-bind="activatorProps" @click="() => {
                  if (!(store.state.isAuthorized)) {
                    router.push('/auth')
                  }
                }">
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="Жалоба">
                  <v-card-text>
                    Что именно вам кажется недопустимым в этом материале?
                  </v-card-text>
                  <v-radio-group
                    v-model="reportReason"
                    column
                    class = "pl-5"
                  >
                    <v-radio label="Спам"
                             value="SPAM"
                    ></v-radio>

                    <v-radio label="Обман"
                             value="FRAUD"
                    ></v-radio>

                    <v-radio label="Оскорбления"
                             value="SWEAR_WORD"
                    ></v-radio>

                    <v-radio label="Запрещенные товары"
                             value="BANNED_GOODS"
                    ></v-radio>

                    <v-radio label="Откровенное изображение"
                             value="EXPLICIT_IMAGE"
                    ></v-radio>

                    <v-radio label="Враждебные высказывания"
                             value="HATE_SPEECH"
                    ></v-radio>

                    <v-radio label="Прочее"
                             value="OTHER"
                    ></v-radio>

                  </v-radio-group>
                <div class = "px-5">
                  <div class="">Сообщение (необязательно) </div>

                  <v-textarea
                    :counter="500"
                    class="mb-2"
                    rows="2"
                    variant="outlined"
                    v-model="reportReasonText"
                    persistent-counter
                  ></v-textarea>
                </div>


                  <v-card-actions class = "mx-3 my-1">
                    <v-btn
                      color="surface-variant"
                      text="Отправить"
                      variant="flat"
                      @click="async () => {
                        if (store.state.isAuthorized) {
                          const data = {
                            reason: reportReason,
                            text: reportReasonText
                          }
                          await axios.post(`http://194.152.37.7:8812/api/complaints/${articleId}`, data, store.state.config);
                          console.log(`Жалоба на статью ${articleId} с причиной ${reportReason} и комментарием ${reportReasonText}`);
                          isActive.value = false;
                        } else {
                          await router.push('/auth');
                        }
                      }"
                    ></v-btn>

                    <v-spacer>

                    </v-spacer>

                    <v-btn
                      text="Закрыть"
                      @click="isActive.value = false"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>
        </div>
      </div>
      <router-link :to="'/article/' + articleId" v-show="showWithoutHeader" style = "float: right"> {{ formatDateTime(postedTimeAgo) }} <hr> </router-link>
      <div class = "article-data">
        <div class = "article-title">
          <router-link :to="'/article/' + articleId">
            <p> {{ articleTitle }} </p>

          </router-link>
        </div>
        <div v-if = "(articleMainPictureUrl !== '' && articleMainPictureUrl !== null)" class = "article-picture">
          <router-link :to="'/article/' + articleId">
            <img :src = "articleMainPictureUrl" alt = "Main picture of article preview">
          </router-link>
        </div>
        <div class = "article-description">
          <ContentRender :content="articleShortDescription"/>
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
              <b v-else-if="articleRating<0" style="color: red">{{ articleRating }}</b>
              <b v-else style="color: black">{{ articleRating }}</b>
            </div>
            <div class = "article-favourites">
                <div v-if="articleInFavourites" class = article-in-favourites-icon @click="() => {
                  if (store.state.isAuthorized) {
                    deleteFromFavourites(articleId);
                    articleInFavourites = false;
                    articleTotalFavourites--;
                  } else {
                    router.push('/auth');
                  }
                }">
                  <img src="/icons/star_icon.svg" alt = "Favourites Icon">
                </div>
                <div v-else class = article-not-in-favourites-icon @click="() => {
                  if (store.state.isAuthorized) {
                    addToFavourites(articleId);
                    articleInFavourites = true;
                    articleTotalFavourites++;
                  } else {
                    router.push('/auth');
                  }
                }">
                  <img src="/icons/star_icon.svg" alt = "Not Favourites Icon">
                </div>
                <b> {{ articleTotalFavourites }}</b>
            </div>
            <div class = "article-share">
              <div class = "article-share-icon">
                <v-dialog max-width="500">
                  <template v-slot:activator="{ props: activatorProps }">
                    <img src="/icons/corner_up_right_icon.svg" alt = "Share Icon" v-bind="activatorProps" @click="async () => {
                  shareLink = (await axios.get(`http://194.152.37.7:8812/api/articles/${articleId}/share`)).data;
                }">
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card title="Поделиться">
                      <v-card-text>
                        Выберите социальную сеть:
                      </v-card-text>
                      <v-btn-toggle v-model="shareSortToggle" color="#20b2aa" class="ml-2" mandatory>
                        <v-btn @click="async () => { await shareArticle(articleId, 'link'); }">По ссылке</v-btn>
                        <v-btn @click="async () => { await shareArticle(articleId, 'vk'); }">Вконтакте</v-btn>
                        <v-btn @click="async () => { await shareArticle(articleId, 'telegram'); }">Телеграм</v-btn>
                        <v-btn @click="async() => { await shareArticle(articleId, 'whatsapp'); }">Whatsapp</v-btn>
                      </v-btn-toggle>
                      <div class="d-flex">
                          <v-text-field class = "pt-3 ml-3"
                                        variant="outlined"
                                        readonly
                          >{{ shareLink }}</v-text-field>
                        <v-btn @click="copyText(shareLink)" class = "mx-3 mt-5 vh-100"> копировать </v-btn>
                      </div>
                      <div class = "px-5">

                      </div>

                      <v-card-actions class = "mx-3 my-1">
                        <v-spacer>

                        </v-spacer>

                        <v-btn
                          text="Закрыть"
                          @click="isActive.value = false"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
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
