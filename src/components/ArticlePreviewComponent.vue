<script setup>
import axios from "axios";
import {useStore} from "vuex";
import {ref, computed} from "vue";
import router from "@/plugins/router";
import ContentRender from "@/components/ContentRender.vue";
import ArticleMenuComponent from "@/components/ArticleMenuComponent.vue";
import { onBeforeMount } from "vue";

const store = useStore();
const reportReason = ref('');
const reportReasonText = ref('');
const shareBy = ref('link');
const shareSortToggle = ref(0);
const shareLink = ref('');
const isValidShareEmail = ref(true);
const shareEmailAddress = ref('');
const statusColors = computed(() => ({
  'ON_MODERATION': 'orange',
  'BLOCKED': 'red',
  'DELETED': 'red',
  'DRAFT': 'orange',
  'NOT_APPROVED': 'red',
  'APPROVED': 'green'
}));
const showSnackMessage = ref(false);
const snackMessageText = ref('');
const status = ref(null);

const props = defineProps({
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
  articleTotalViews: Number,
  articleStatus: {
    type: String
  },
  articles: Array
})

onBeforeMount(() => {
    status.value = props.articleStatus;
});

function formatDateTime(timeString) {
  const dateTime = new Date(timeString);
  return dateTime.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const showSnackbarMessage = (text) => {
  showSnackMessage.value = true;
  snackMessageText.value = text;
}

async function addToFavourites(articleId) {
  try {
    await axios.post(`${store.state.API_URL}/api/saved-articles/${articleId}`, '', store.state.config);
    showSnackbarMessage('Статья успешно добавлено в избранное');
  } catch (e) {
    console.log(e)
    showSnackbarMessage('При удалении из избранного произошла ошибка');
  }
}

async function deleteFromFavourites(articleId) {
  try {
    await axios.delete(`${store.state.API_URL}/api/saved-articles/${articleId}`, store.state.config);
    if(props.articles) {
      const indexToRemove = props.articles.findIndex(article => article.id === articleId)
      if (indexToRemove !== -1) {
        props.articles.splice(indexToRemove, 1)
      }
    }
    showSnackbarMessage('Статья успешно удалена из избранного');
  } catch (e) {
    console.log(e)
    showSnackbarMessage('При удалении из избранного произошла ошибка');

  }
}
const shareArticle = async (articleId, shareType) => {
  shareBy.value = shareType;
  if (shareBy.value === 'link') {
    try {
      shareLink.value = (await axios.get(`${store.state.API_URL}/api/articles/${articleId}/share`)).data;
    } catch (e) {
      shareLink.value = undefined;
      console.error(e);
    }
  } else {
    try {
      window.location.href = (await axios.get(`${store.state.API_URL}/api/articles/${articleId}/share?share-type=${shareType}`)).data;
    } catch (e) {
      shareLink.value = undefined;
      console.error(e);
    }
  }
}

const getStatusText = (status) => {
  const statusMap = {
    'ON_MODERATION': 'На модерации',
    'BLOCKED': 'Заблокировано',
    'DELETED': 'Удалено',
    'DRAFT': 'В черновиках',
    'NOT_APPROVED': 'Не одобрено',
    'APPROVED': 'Одобрено'
  };
  return statusMap[status] || status;
};

async function setStatus() {
  try {
    const response = await axios.get(`${store.state.API_URL}/api/articles/status/${props.articleId}`, store.state.config);
    status.value = response.data;
  } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const serverErrors = error.response.data.errors;
        alert(serverErrors);
      }

  }
}

</script>

<script>
export default {
  data () {
    return {
      reportReason: '',
      reportReasonText: '',
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
        <ArticleMenuComponent
          :articleStatus="status"
          :authorsNickname="authorsNickname"
          :articleId="articleId"
          :setStatus="setStatus"
        />
        <div class = "article-header-report" v-if="store.state.isAuthorized && (store.state.nickname !== authorsNickname)">

          <div class = "article-header-report-icon">
            <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <img src="/icons/alert_circle_icon.svg" alt = "icon" v-bind="activatorProps" @click="() => {
                  if (!(store.state.isAuthorized)) {
                    router.push('/auth')
                  }
                }">
              </template>

              <template v-slot:default="{ isActive }" >
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
                    <div class="">Сообщение (обязательно) </div>

                    <v-textarea
                      :error-messages="reportReasonText.length < 5 ? 'Сообщение должно содержать как минимум 5 символов' : '' ||
                                       reportReasonText.length > 500 ? 'Превышен лимит, сообщение будет урезано до 500 символов.' : ''"
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
                        if (reportReasonText.length < 5) {
                          showSnackbarMessage('Ну написано же...');
                          return;
                        } else if (reportReasonText.length > 500) {
                          reportReasonText = reportReasonText.slice(0, 500);
                        }
                        if (store.state.isAuthorized) {
                          const data = {
                            reason: reportReason,
                            text: reportReasonText
                          }
                          try {
                            await axios.post(`${store.state.API_URL}/api/complaints/${articleId}`, data, store.state.config);                            showSnackbarMessage('Произошла ошибка при отправке жалобы');
                            showSnackbarMessage('Жалоба успешно отправлена');
                          } catch (e) {
                            showSnackbarMessage('Произошла ошибка при отправке жалобы');
                          }
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
      <ArticleMenuComponent
          v-show = "showWithoutHeader"
          :articleStatus="status"
          :authorsNickname="authorsNickname"
          :articleId="articleId"
          :setStatus="setStatus"
        />

      <router-link :to="'/article/' + articleId" v-show="showWithoutHeader" style = "float: right"> {{ formatDateTime(postedTimeAgo) }} <hr> </router-link>
      <div class = "article-data">
        <div v-show="status !== null && status !== undefined" class="article-status" >
          <p> Статус : <span :style="{ color: statusColors[status] }">{{ getStatusText(status) }}</span> </p>
        </div>
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
        <div class = "article-footer-bar mt-4">
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
            <div class = "article-share pb-1">
              <div class = "article-share-icon">
                <v-dialog max-width="500">
                  <template v-slot:activator="{ props: activatorProps }">
                    <img src="/icons/corner_up_right_icon.svg" alt = "Share Icon" v-bind="activatorProps"
                         @click="async () => {shareLink = (await axios.get(`${store.state.API_URL}/api/articles/${articleId}/share`)).data;}">
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card title="Поделиться">
                      <div class="w-full my-3 text-center">
                        <v-btn-toggle v-model="shareSortToggle" color="#20b2aa" class="ml-2" mandatory>
                          <v-btn
                            @click="async () => { await shareArticle(articleId, 'link'); }"
                            icon
                            size="large">
                            <img src="/icons/share_link_icon.webp" style="height: 2.5em; width: 2.5em;">
                          </v-btn>

                          <v-btn @click="async () => { await shareArticle(articleId, 'vk'); }"
                                 icon
                                 size="large">
                            <img src="/icons/share_vk_icon.png" style="height: 2.5em; width: 2.5em;">
                          </v-btn>

                          <v-btn
                            @click="async () => { await shareArticle(articleId, 'telegram'); }"
                            icon
                            size="large">
                            <img src="/icons/share_tg_icon.png" style="height: 2.5em; width: 2.5em;">
                          </v-btn>

                          <v-btn @click="async () => { await shareArticle(articleId, 'whatsapp'); }"
                                 icon
                                 size="large">
                            <img src="/icons/share_wa_icon.png" style="height: 3em; width: 3em;">
                          </v-btn>

                          <v-btn
                            v-if="store.state.isAuthorized"
                            @click= "shareBy = 'email'"
                            icon
                            size="large">
                            <img src="/icons/share_gmail_icon.webp" style="height: 3em; width: 3em;">
                          </v-btn>
                        </v-btn-toggle>
                      </div>
                      <v-row>
                        <v-col cols="12" sm="12">
                            <v-text-field
                              v-if = "shareBy !== 'email'"
                              class = "pt-3 mx-3"
                              variant="outlined"
                              readonly
                            >{{ shareLink }}</v-text-field>
                          <v-text-field
                            v-else
                            :error-messages="!isValidShareEmail ? 'Введена неверная почта' : ''"
                            placeholder="Введите почту для отправки сообщения"
                            label = "Почта"
                            :model-value="shareEmailAddress"
                            @update:model-value = "newValue => shareEmailAddress = newValue"
                            class = "pt-3 mx-3"
                            variant="outlined"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-btn
                        v-if = "shareBy === 'email'"
                        style="margin-left: 10em; margin-right: 10em;"
                        @click="async () =>
                             {
                               let regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
                                if (regex.test(shareEmailAddress)) {
                                  console.log('valid')
                                  isValidShareEmail = true;
                                  try {
                                    await axios.get(`${store.state.API_URL}/api/articles/${articleId}/share/email?to=${shareEmailAddress}`, store.state.config);
                                    showSnackbarMessage('Сообщение успешно отправлено');
                                  } catch (e) {
                                    showSnackbarMessage('При отправлении произошла ошибка');
                                  }
                                } else {
                                  isValidShareEmail = false;
                                }
                             }"> Отправить
                      </v-btn>

                      <v-card-actions class = "mx-3 my-1">
                        <v-spacer/>
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
            <div class = "article-views-count" v-if="status !== 'DRAFT'">
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
  <v-snackbar
    v-model="showSnackMessage"
    :timeout="3000"
  >
    {{ snackMessageText }}

    <template v-slot:actions>
      <v-btn
        color="purple"
        variant="text"
        @click="showSnackMessage = false"
      >
        Закрыть
      </v-btn>
    </template>
  </v-snackbar>
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
  margin-left: -0.5em;
}

.article-share-icon {
  vertical-align: center;
}

.article-share-icon:hover {
  cursor: pointer;
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

@media screen and (max-width: 450px) {
  .article-views-count {
    float: none;
  }

  .article-footer div {
    margin-right: 5px;
  }

  .article-footer > div:not(:last-child) {
    margin-right: 1.5em;
  }
}


</style>
