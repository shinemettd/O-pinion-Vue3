<script setup>
import axios from "axios";
import {useStore} from "vuex";
import {ref} from "vue";
import router from "@/plugins/router";


const store = useStore();
const shareBy = ref('link');
const shareSortToggle = ref(0);
const shareLink = ref('');
const isValidShareEmail = ref(true);
const shareEmailAddress = ref('');

const showSnackMessage = ref(false);
const snackMessageText = ref('');

const props = defineProps({
  showWithoutHeader: {
    type: Boolean,
    default: false
  },
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
  announcements: Function
})

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

async function addToFavourites(announcementId) {
  try {
    await axios.post(`${store.state.API_URL}/api/saved-announcements/${announcementId}`, '', store.state.config);
    showSnackbarMessage('Объявление успешно добавлено в избранное');
  } catch (e) {
    console.log(e)
    showSnackbarMessage('При удалении из избранного произошла ошибка');
  }
}

async function deleteFromFavourites(announcementId) {
  try {
    await axios.delete(`${store.state.API_URL}/api/saved-announcements/${announcementId}`, store.state.config);
    if(props.announcements) {
      const indexToRemove = props.announcements.findIndex(announcement => announcement.id === announcementId)
      if (indexToRemove !== -1) {
        props.announcements.splice(indexToRemove, 1)
      }
    }
    showSnackbarMessage('Объявление успешно удалена из избранного');
  } catch (e) {
    console.log(e)
    showSnackbarMessage('При удалении из избранного произошла ошибка');

  }
}
const shareAnnouncement = async (announcementId, shareType) => {
  shareBy.value = shareType;
  if (shareBy.value === 'link') {
    try {
      shareLink.value = (await axios.get(`${store.state.API_URL}/api/announcements/${announcementId}/share`)).data;
    } catch (e) {
      shareLink.value = undefined;
      console.error(e);
    }
  } else {
    try {
      shareLink.value =  (await axios.get(`${store.state.API_URL}/api/announcements/${announcementId}/share?share-type=${shareType}`)).data;
    } catch (e) {
      shareLink.value = undefined;
      console.error(e);
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
            <img src="/icons/announcement.jpg" alt = "Users avatar picture">
          </div>
          <div class = "article-authors-nickname">
            <p style = "font-weight: 700;"> O!pinion</p>
          </div>
          <div class = "article-recently-date">
            <router-link :to="'/announcement/' + announcementId">
              <p> {{ formatDateTime(postedTimeAgo) }} </p>
            </router-link>
          </div>
        </div>
      </div>
      <router-link :to="'/announcement/' + announcementId" v-show="showWithoutHeader" style = "float: right"> {{ formatDateTime(postedTimeAgo) }} <hr> </router-link>
      <div class = "article-data">
        <div class = "article-title">
          <router-link :to="'/announcement/' + announcementId">
            <p> {{ announcementTitle }} </p>

          </router-link>
        </div>
        <div v-if = "(announcementMainPictureUrl !== '' && announcementMainPictureUrl !== null)" class = "article-picture">
          <router-link :to="'/announcement/' + announcementId">
            <img :src = "announcementMainPictureUrl" alt = "Main picture of article preview">
          </router-link>
        </div>
        <div class="my-3">
          <ContentRender :content="announcementContent"/>
        </div>
        <div class = "article-footer-bar mt-4">
          <div class = "article-footer">
            <div class = "article-favourites">
              <div v-if="announcementInFavourites" class = article-in-favourites-icon @click="() => {
                  if (store.state.isAuthorized) {
                    deleteFromFavourites(announcementId);
                    announcementInFavourites = false;
                    announcementTotalFavourites--;
                  } else {
                    router.push('/auth');
                  }
                }">
                <img src="/icons/star_icon.svg" alt = "Favourites Icon">
              </div>
              <div v-else class = article-not-in-favourites-icon @click="() => {
                  if (store.state.isAuthorized) {
                    addToFavourites(announcementId);
                    announcementInFavourites = true;
                    announcementTotalFavourites++;
                  } else {
                    router.push('/auth');
                  }
                }">
                <img src="/icons/star_icon.svg" alt = "Not Favourites Icon">
              </div>
              <b> {{ announcementTotalFavourites }}</b>
            </div>
            <div class = "article-share pb-1">
              <div class = "article-share-icon">
                <v-dialog max-width="500">
                  <template v-slot:activator="{ props: activatorProps }">
                    <img src="/icons/corner_up_right_icon.svg" alt = "Share Icon" v-bind="activatorProps"
                         @click="async () => {shareLink = (await axios.get(`${store.state.API_URL}/api/announcements/${announcementId}/share`)).data;}">
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
                        v-if = "shareBy === 'email'"
                        style="margin-left: 10em; margin-right: 10em;"
                        @click="async () =>
                             {
                               let regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
                                if (regex.test(shareEmailAddress)) {
                                  console.log('valid')
                                  isValidShareEmail = true;
                                  try {
                                    await axios.get(`${store.state.API_URL}/api/announcements/${announcementId}/share/email?to=${shareEmailAddress}`, store.state.config);
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
                <router-link :to="'/announcement/' + announcementId" class="navbar-item">
                  <img src="/icons/message_square_icon.svg" alt="Comments Icon">
                </router-link>
              </div>
              <b>{{ announcementTotalComments }}</b>
            </div>
            <div class = "article-views-count">
              <div class = "article-views-icon">
                <img src ="/icons/eye_icon.svg" alt="Image Icon">
              </div>
              <b>{{ announcementTotalViews }}</b>
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
  background-color: #e3e4e5;
  /* background-color: #fdf6ee; */
}
.article-header div {
  display: inline-block;
  vertical-align: middle;
}


.article-header-data {
  margin-bottom: 10px;
}

.article-header-data a {
  text-decoration: none;
  color: black;
}


.article-title a
{
  text-decoration: none;
  color: black;
  transition: all 0.35s ease;
}

.article-title a:hover {
  color: rgb(120, 194, 255);
}


.article-authors-nickname p
{
  margin-left: 10px;
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


</style>
