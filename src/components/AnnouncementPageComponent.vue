<script setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import store from "@/store/store";
import router from "@/plugins/router";
import ContentRender from "@/components/ContentRender.vue";

const shareBy = ref('link');
const shareSortToggle = ref(0);
const shareLink = ref('');
const showShareSnackMessage = ref(false);
const isValidShareEmail = ref(true);
const showEmailShareSnackMessage = ref(false);
const shareEmailAddress = ref('');

const userComment = ref('');

const sendEmptyComment = ref(false);
const sendTooShortComment = ref(false);
const sendTooLongComment = ref(false);
const isCommentEditing = ref(false);
const editingCommentId = ref(-1);
const successGetNewComments = ref(false);

const snackMessageText = ref('');
const showSnackMessage = ref(false);

const props = defineProps({
  postedTimeAgo: String,
  announcementId: Number,
  announcementTitle: String,
  announcementContent: String,
  announcementMainPictureUrl: {
    type: String,
  },
  announcementTotalFavourites: Number,
  announcementInFavourites: {
    type: Boolean,
    default: false,
  },
  announcementTotalComments: Number,
  announcementTotalViews: Number,
  announcementComments: String,
  loadComments: {
    type: Function,
    default() {
    }
  },

})

async function sendComment(comment, announcementId) {
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
    await axios.post(`${store.state.API_URL}/api/announcement-comments/${announcementId}`, { text: comment }, store.state.config);
    await props.loadComments();
    successGetNewComments.value = true;
  } catch (e) {
    console.error(e);
    successGetNewComments.value = false;
  }
  clearComment();
}

async function sendEditComment(commentId, commentText) {
  if (commentText.length === 0) {
    await setSendEmptyComment();
    return;
  } else if (commentText.length > 255) {
    await setSendTooLongComment();
    return;
  } else if (commentText.length < 5) {
    await setSendTooShortComment();
    return;
  }

  try {
    await axios.put(`${store.state.API_URL}/api/announcement-comments/${commentId}`, { text: commentText }, store.state.config);
    await props.loadComments();
    successGetNewComments.value = true;
  } catch (e) {
    console.error(e);
    successGetNewComments.value = false;
  }
  clearComment();
}


async function editComment(commentId, newCommentText) {
  cancelEdit();
  isCommentEditing.value = true;
  userComment.value = newCommentText;
  editingCommentId.value = commentId;
}

function cancelEdit() {
  isCommentEditing.value = false;
  editingCommentId.value = undefined;
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
  cancelEdit();
}

const deleteComment = async (commentId) => {
  try {
    await axios.delete(`${store.state.API_URL}/api/announcement-comments/${commentId}`, store.state.config);
    await props.loadComments();
    showSnackbarMessage('Комментарий удален');
  } catch (e) {
    showSnackbarMessage('Произошла ошибка при удалении комментария');
  }
}

const showSnackbarMessage = (text) => {
  showSnackMessage.value = true;
  snackMessageText.value = text;
}

async function addToFavourites(announcementId) {
  try {
    await axios.post(`${store.state.API_URL}/api/saved-announcements/${announcementId}`, '', store.state.config);
  } catch (e) {
    showSnackbarMessage('Произошла ошибка при добавлении в избранное');
  }
}

async function deleteFromFavourites(announcementId) {
  try {
    await axios.delete(`${store.state.API_URL}/api/saved-announcements/${announcementId}`, store.state.config);
  } catch (e) {
    showSnackbarMessage('Произошла ошибка при удалении комментария');
  }
}

const shareAnnouncement = async (announcementId, shareType) => {
  shareBy.value = shareType;
  if (shareBy.value === 'link') {
    try {
      shareLink.value = (await axios.get(`${store.state.API_URL}/api/announcements/${announcementId}/share`)).data;
    } catch (e) {
      shareLink.value = undefined;
    }
  } else {
    try {
      window.location.href = (await axios.get(`${store.state.API_URL}/api/announcements/${announcementId}/share?share-type=${shareType}`)).data;
    } catch (e) {
      shareLink.value = undefined;
    }
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

onMounted(async () => {
    document.title = props.announcementTitle;
    console.log("comments : " + announcementComments.content);
})
</script>

<template>
  <main class = "container mx-auto">
    <div class = "scroll mx-auto border scroll-container h-100 px-4 py-3">
      <hr>
      <div class = "article-header mt-3">
        <p style = "font-size: 2em; word-wrap: break-word;"> {{ announcementTitle }} </p>
        <div class = "article-header-data my-2" style = "display: flex">
          <div class="article-header-data">
            <div class = "user-avatar mr-3">
                <img  src="/icons/announcement.jpg" class = "my-1 mt-2" alt = "user avatar">
            </div>
            <div class = "">
              <p> {{ formatDateTime(postedTimeAgo) }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if = "(announcementMainPictureUrl !== '' && announcementMainPictureUrl !== null)" class = "article-picture">
          <router-link :to="'/announcement/' + announcementId">
            <img :src = "announcementMainPictureUrl" alt = "Main picture of article preview">
          </router-link>
      </div>
      <div class="my-3">
        <ContentRender :content="announcementContent"/>
      </div>

      <hr class = "my-3">
      <div class = "article-footer-bar">
        <div class = "article-footer">
          <div class = "article-favourites" >
            <div v-if="announcementInFavourites" class = article-in-favourites-icon @click="async () => {
              redirectIfNotAuthorized();
              await deleteFromFavourites(announcementId);
              announcementInFavourites = false;
              announcementTotalFavourites--;
              }">
              <img src="/icons/star_icon.svg" alt = "Favourites Icon">
            </div>
            <div v-else class = article-not-in-favourites-icon>
              <img src="/icons/star_icon.svg" alt = "Not Favourites Icon" @click="async () => {
                redirectIfNotAuthorized();
                await addToFavourites(announcementId);
                announcementInFavourites = true;
                announcementTotalFavourites++;
                }">
            </div>
            <b> {{ announcementTotalFavourites }}</b>
          </div>
          <div class = "article-share pb-1">
            <div class = "article-share-icon">
              <v-dialog max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                  <img src="/icons/corner_up_right_icon.svg" alt = "Share Icon" v-bind="activatorProps"
                       @click="async () => {shareLink = (await axios.get(`${store.state.API_URL}/api/articles/${announcementId}/share`)).data;}">
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card title="Поделиться">
                    <div class="w-full my-3 text-center">
                      <v-btn-toggle v-model="shareSortToggle" color="#20b2aa" class="ml-2" mandatory>
                        <v-btn
                          @click="async () => { await shareAnnouncement(announcementId, 'link'); }"
                          icon
                          size="large">
                          <img src="/icons/share_link_icon.webp" style="height: 2.5em; width: 2.5em;">
                        </v-btn>

                        <v-btn @click="async () => { await shareAnnouncement(announcementId, 'vk'); }"
                               icon
                               size="large">
                          <img src="/icons/share_vk_icon.png" style="height: 2.5em; width: 2.5em;">
                        </v-btn>

                        <v-btn
                          @click="async () => { await shareAnnouncement(announcementId, 'telegram'); }"
                          icon
                          size="large">
                          <img src="/icons/share_tg_icon.png" style="height: 2.5em; width: 2.5em;">
                        </v-btn>

                        <v-btn @click="async () => { await shareAnnouncement(announcementId, 'whatsapp'); }"
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
                                    await axios.get(`${store.state.API_URL}/api/announcements/${announcementId}/share/email?to=${shareEmailAddress}`, store.state.config);
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
            <b>{{ announcementTotalViews }}</b>
          </div>
        </div>
      </div>
      <hr class = "my-3">

      <div class="my-5" style = "z-index: 1000">
        <div style = "z-index: 100">
          <p style="font-size: 1.5em"> Комментарии <strong> {{ announcementTotalComments }}</strong> </p>
          <div v-show = "announcementTotalComments === 0" class = "px-5 pt-5" style = "font-style: italic">
            Комментариев пока нет :(
          </div>
        </div>
        <div class = "comments-list my-5 ml-1" v-for = "comment in announcementComments.content" :key="comment.id">
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
              <span v-if = "store.state.isAuthorized && (comment.user.nickname === store.state.nickname)"
                    class = "comment-edit-text mr-2"
                    @click="async () =>
                      {
                        await editComment(comment.id, comment.text);
                      }"
              > <strong> Редактировать </strong> </span>
              <span v-if = "store.state.isAuthorized && (comment.user.nickname === store.state.nickname)"
                    class = "comment-delete-text"
                    @click="async () =>
                      {
                        await deleteComment(comment.id);
                        try {
                          const response = await axios.get(`${store.state.API_URL}/api/announcement-comments/${announcementId}/total-comments`);
                          announcementTotalComments = response.data;
                        } catch (e) {
                          showSnackbarMessage('Произошла ошибка при подсчете комментариев');
                        }
                      }"
              > <strong> Удалить </strong> </span>
            </div>
          </div>
        </div>
        <div class = "сomment-field">
          <hr class = "mt-5 pb-2">
          <div v-if="store.state.isAuthorized" class="mt-2">
            <div class = "mb-2" v-if="isCommentEditing" style = "margin-top: -0.314em">
              <span> Изменение комментария </span> <v-icon @click="cancelEdit" style="margin-top: -0.17em;">mdi-close</v-icon>
            </div>
            <v-text-field
              v-model="userComment"
              :append-icon="'mdi-send'"
              type="text"
              placeholder="Напишите комментарий"
              :error-messages="sendEmptyComment ? 'Ну не пустой комментарий же отправлять...' : '' ||
                                    sendTooShortComment ? 'Комментарий должен быть информативнее...' : '' ||
                                    sendTooLongComment ? 'Комментарий должен быть не настолько информативным!' : ''"
              :counter="255"
              variant="outlined"
              clearable
              @click:append="
                  async () => {
                    if (!isCommentEditing) {
                      await sendComment(userComment, announcementId);
                    } else {
                      await sendEditComment(editingCommentId, userComment);
                    }
                    try {
                      const response = await axios.get(`${store.state.API_URL}/api/announcement-comments/${announcementId}/total-comments`);
                      announcementTotalComments = response.data;
                    } catch (e) {
                      showSnackbarMessage('Произошла ошибка при подсчете комментариев');
                    }
                  }"
              @click:clear="clearComment"
              @update:model-value="newComment => userComment = newComment"
            ></v-text-field>
            <hr>
          </div>
          <div v-else>
            <v-text-field
              readonly
              :append-icon="'mdi-send'"
              variant="outlined"
              placeholder = "Для того чтобы оставить комментарий, авторизуйтесь"
              @click:append="() => { router.push('/auth'); }"
            ></v-text-field>
          </div>
        </div>
        </div>
    </div>
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

.article-picture img {
  max-width: 100%;
  max-height: 80%;
  display: block;
  margin: 0 auto;
  padding-top: 10px;
  padding-bottom: 10px;
}


.article-in-favourites-icon {
  opacity: 100%;
}

.article-in-favourites-icon:hover {
  cursor: pointer;
  opacity: 50%;
}

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

.comment-reply-text:hover, .comment-edit-text:hover {
  cursor: pointer;
  color: mediumpurple;
  transition: all 0.35s ease;
}

.comment-delete-text:hover {
  cursor: pointer;
  color: red;
  transition: all 0.35s ease;
}

.сomment-field {
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 1;
}

@media screen and (max-width: 720px) {
  .scroll {
    width: 100%;
  }

  .scroll-container {
    width: 100%;
  }

  .article-header {
    text-align: center;
  }

  .article-header-data {
    flex-direction: column;
    align-items: center;
  }

  .article-footer-bar {
    flex-direction: column;
  }

}

@media screen and (min-width: 1280px) {
  .scroll {
    width: 66%;
  }
}
@media screen and (max-width: 360px) {
  .article-views-count {
    float: none;
  }
}

</style>
