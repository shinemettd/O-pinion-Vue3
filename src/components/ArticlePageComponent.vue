<script setup>
import {computed, ref} from "vue";
import axios from "axios";
import store from "@/store/store";
import router from "@/plugins/router";
import ContentRender from "@/components/ContentRender.vue";
import ArticleMenuComponent from "@/components/ArticleMenuComponent.vue";

const reaction = ref('');
const shareBy = ref('link');
const shareSortToggle = ref(0);
const shareLink = ref('');
const showShareSnackMessage = ref(false);
const isValidShareEmail = ref(true);
const showEmailShareSnackMessage = ref(false);
const shareEmailAddress = ref('');

const userComment = ref('');
const stickyCommentWriterField = ref(true);

const formattedComment = ref('');

const sendEmptyComment = ref(false);
const sendTooShortComment = ref(false);
const sendTooLongComment = ref(false);
const isCommentReply = ref(false);
const replyCommentId = ref(undefined);
const replyCommentAuthorsNickname = ref('');

const icons = [
  'mdi-emoticon',
  'mdi-emoticon-cool',
  'mdi-emoticon-dead',
  'mdi-emoticon-excited',
  'mdi-emoticon-happy',
  'mdi-emoticon-neutral',
  'mdi-emoticon-sad',
  'mdi-emoticon-tongue',
]

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
  articleTotalComments: Number,
  articleTotalViews: Number,
  articleComments: String,
  articleCommentsReplies: String,
  articleStatus: String,
  loadComments: {
    type: Function,
    default() {
      console.log('comments loaded...')
    }
  }
})

async function sendComment(comment, articleId) {
  if (comment.length === 0) {
    await setSendEmptyComment();
    return;
  } else if (comment.length > 255) {
    await setSendTooLongComment();
    return;
  } else if (comment.length < 5) {
    await setSendTooShortComment();
    return;
  }

  try {
    let response;
    if (!isCommentReply.value) {
      response = await axios.post(`${store.state.API_URL}/api/article-comments/${articleId}`, {text: comment}, store.state.config);
    } else {
      response = await axios.post(`${store.state.API_URL}/api/article-comments/${replyCommentId.value}/replies`, {text: comment}, store.state.config);
    }
    await props.loadComments();
  } catch (e) {
    console.error(e);
  }
  clearComment();
}

async function replyTo(commentAuthorNickname, commentId) {
  isCommentReply.value = true;
  replyCommentAuthorsNickname.value = commentAuthorNickname;
  // userComment.value = `@${commentAuthorNickname}, ${userComment}`;
  replyCommentId.value = commentId;
}

function cancelReply() {
  isCommentReply.value = false;
  replyCommentId.value = undefined;
}

const setSendEmptyComment = async () => {
  sendEmptyComment.value = true;
  sendTooLongComment.value = false;
  sendTooShortComment.value = false;
}

const setSendTooShortComment = async () => {
  sendEmptyComment.value = false;
  sendTooLongComment.value = false;
  sendTooShortComment.value = true;
}

const setSendTooLongComment = async () => {
  sendEmptyComment.value = false;
  sendTooLongComment.value = true;
  sendTooShortComment.value = false;
}
function clearComment () {
  userComment.value = ''
  cancelReply();
}

async function addToFavourites(articleId) {
  try {
    await axios.post(`${store.state.API_URL}/api/saved-articles/${articleId}`, '', store.state.config);
  } catch (e) {
    console.error(e)
  }
}

async function deleteFromFavourites(articleId) {
  try {
    await axios.delete(`${store.state.API_URL}/api/saved-articles/${articleId}`, store.state.config);
  } catch (e) {
    console.error(e)
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
      shareLink.value =  (await axios.get(`${store.state.API_URL}/api/articles/${articleId}/share?share-type=${shareType}`)).data;
    } catch (e) {
      shareLink.value = undefined;
      console.error(e);
    }
  }
}

async function setLike() {
  const articleId = props.articleId;
  const data = {
    article_id: articleId,
    reaction_type: "LIKE"
  }
  try {
    await axios.post(`${store.state.API_URL}/api/article-reactions`, data, store.state.config);
  } catch (e) {
    console.error(e)
  }
}

async function setDislike() {
  const articleId = props.articleId;
  const data = {
    article_id: articleId,
    reaction_type: "DISLIKE"
  }
  try {
    await axios.post(`${store.state.API_URL}/api/article-reactions`, data, store.state.config);
  } catch (e) {
    console.error(e)
  }
}

function formatDateTime(timeString) {
  const dateTime = new Date(timeString);
  const formattedDateTime = dateTime.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
  return formattedDateTime;
}

function redirectIfNotAuthorized() {
  if (!(store.state.isAuthorized)) {
    router.push('/auth');
  }
}
</script>

<template>
  <main class = "container mx-auto">
    <div class = "scroll mx-auto border w-50 h-100 px-4 py-3">
      <hr>
      <div class = "article-header mt-3">
        <p style = "font-size: 2em; word-wrap: break-word;"> {{ articleTitle }} </p>
        <div class = "article-header-data my-2" style = "display: flex">
          <div class="article-header-data">
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
          <ArticleMenuComponent  style="float: right;" :articleStatus="articleStatus" :authorsNickname="authorsNickname"></ArticleMenuComponent>
        </div>
      </div>
      <div class="my-3">
        <!--   article content     -->
        <ContentRender :content="articleContent"/>
      </div>
      <div class="my-3">
        Секция тегов
        <!--  tags  reactions etc    -->
      </div>
      <hr class = "my-3">
      <div class = "article-footer-bar">
        <div class = "article-footer">
          <div v-if = "store.state.isAuthorized" class = "article-rating">
            <div class = "article-rating-icon">
              <img class = "article-reaction" src="/icons/chevron_up_icon.svg" alt="Rating Icon" @click="async () => {
                await setLike();
                //TODO change request
                articleRating = (await axios.get(`${store.state.API_URL}/api/articles/${articleId}`)).data.rating;
              }">
            </div>
            <b v-if = "articleRating > 0" style="color: green">{{ articleRating }}</b>
            <b v-else-if="articleRating < 0" if = "articleRating>0" style="color: red">{{ articleRating }}</b>
            <b v-else style="color: black">{{ articleRating }}</b>
            <div class = "article-rating-icon ml-3">
              <img class = "article-reaction" src="/icons/chevron_down_icon.svg" alt="Rating Icon" @click="async () => {
                await setDislike();
                //TODO change request
                articleRating = (await axios.get(`${store.state.API_URL}/api/articles/${articleId}`)).data.rating;
              }">
            </div>
          </div>
          <div v-else class = "article-rating pl-1">
              <div class = "article-rating-icon">
                <img src="/icons/zap_icon.svg" alt="Rating Icon">
              </div>
              <b v-if = "articleRating>0" style="color: green">{{ articleRating }}</b>
              <b v-else-if="articleRating<0" style="color: red">{{ articleRating }}</b>
              <b v-else style="color: black">{{ articleRating }}</b>
          </div>
          <div class = "article-favourites" style="margin-left: -1em">
            <div v-if="articleInFavourites" class = article-in-favourites-icon @click="() => {
              redirectIfNotAuthorized();
              deleteFromFavourites(articleId);
              articleInFavourites = false;
              articleTotalFavourites--;}">
              <img src="/icons/star_icon.svg" alt = "Favourites Icon">
            </div>
            <div v-else class = article-not-in-favourites-icon>
              <img src="/icons/star_icon.svg" alt = "Not Favourites Icon" @click="() => {
                redirectIfNotAuthorized();
                addToFavourites(articleId);
                articleInFavourites = true;
                articleTotalFavourites++;}">
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
                    <!--                      <v-card-text class = "text-center">-->
                    <!--                        Выберите способ-->
                    <!--                      </v-card-text>-->
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
                      v-if = "shareBy !== 'email'"
                      style="margin-left: 10em; margin-right: 10em;"
                      @click="() =>
                         {
                           copyText(shareLink);
                           showShareSnackMessage = true;
                         }"> Копировать
                    </v-btn>

                    <v-btn
                      v-else
                      style="margin-left: 10em; margin-right: 10em;"
                      @click="async () =>
                             {
                               let regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
                                if (regex.test(shareEmailAddress)) {
                                  isValidShareEmail = true;
                                  try {
                                    await axios.get(`${store.state.API_URL}/api/articles/${articleId}/share/email?to=${shareEmailAddress}`, store.state.config);
                                    showEmailShareSnackMessage = true;
                                  } catch (e) {
                                    console.error(e);
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
                    <v-snackbar
                      v-model="showShareSnackMessage"
                      :timeout="3000"
                    >
                      Ссылка успешно скопирована
                    </v-snackbar>
                    <v-snackbar
                      v-model="showEmailShareSnackMessage"
                      :timeout="3000"
                    >
                      Сообщение успешно отправлено
                    </v-snackbar>
                  </v-card>
                </template>
              </v-dialog>
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
                  <img :src="comment.user.avatar || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'" style = "margin-top: 0.35em; margin-right: 0.75em" alt = "Users avatar picture">
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
            <div class="my-2 ml-13">
              <div style = "font-size: 1.15em">
                <p v-html="comment.text"></p>
              </div>
              <div class = "my-2" style = "font-size: 0.85em">
                  <span class = "comment-reply-text" @click="async() => await replyTo(comment.user.nickname, comment.id)"> Ответить </span>
              </div>
            </div>

          <div v-if = "comment.replies.length > 0">
            <div class = "replies-list my-5 ml-11" v-for = "reply in comment.replies" :key="reply.id">
              <div class = "info-header">
                <div class = "user-avatar">
                  <router-link :to="`/user/${reply.user.nickname}`">
                    <img :src="reply.user.avatar || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'" style = "margin-top: 0.35em; margin-right: 0.75em" alt = "Users avatar picture">
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
              <div class="my-2 ml-13">
                <div style = "font-size: 1.15em">
                  <p v-html="reply.text"></p>
                </div>
              </div>
              </div>
          </div>
        </div>
        <hr class = "mt-5 pb-2 сomment-field">
        <div v-if="store.state.isAuthorized">
              <div class = "mb-2" v-if="isCommentReply">
                <span> Ответ пользователю {{ replyCommentAuthorsNickname }} </span> <v-icon @click="cancelReply" style="margin-top: -0.17em;">mdi-close</v-icon>
              </div>
              <v-text-field
                v-model="userComment"
                :append-icon="'mdi-send'"
                type="text"
                variant="filled"
                placeholder="Напишите комментарий"
                :error-messages="sendEmptyComment ? 'Ну не пустой комментарий же отправлять...' : '' ||
                                  sendTooShortComment ? 'Комментарий должен быть информативнее...' : '' ||
                                  sendTooLongComment ? 'Комментарий должен быть не настолько информативным!' : ''"
                :counter="255"
                :variant="outlined"
                clearable
                @click:append="async() => { await sendComment(userComment, articleId); }"
                @click:clear="clearComment"
                @update:model-value="newComment => userComment = newComment"
              ></v-text-field>
        </div>
        <div v-else>
          Не авторизован падла
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

.article-header-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.comment-reply-text:hover {
  cursor: pointer;
  color: mediumpurple;
  transition: all 0.35s ease;
}

.сomment-field {
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 1000;
}
</style>
