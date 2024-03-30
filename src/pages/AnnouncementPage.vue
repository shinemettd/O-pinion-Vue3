<script setup>
import axios, {HttpStatusCode} from "axios";
import {onBeforeMount, ref} from "vue";
import { useRoute } from 'vue-router';
import AnnouncementPageComponent from "@/components/AnnouncementPageComponent.vue";
import store from "@/store/store";
import PageNotFound from "@/pages/PageNotFound.vue";

const currentAnnouncement = ref('');
const currentAnnouncementComments = ref('');
const dataFetched = ref(false);

const route = useRoute();
const announcementId = (route.params.announcementId);

const isNotFound = ref(false);

const getAnnouncement = async () => {
  try {
    if (store.state.isAuthorized) {
      currentAnnouncement.value = await axios.get(`${store.state.API_URL}/api/announcements/${announcementId}`, store.state.config)
    } else {
      currentAnnouncement.value = await axios.get(`${store.state.API_URL}/api/announcements/${announcementId}`);
    }
    dataFetched.value = true;
    } catch (e) {
      isNotFound.value = true;
    }
}

const getComments = async () => {
    currentAnnouncementComments.value = await axios.get(`${store.state.API_URL}/api/announcement-comments/${announcementId}`, store.state.config);
}

const isAuthorized = async () => {
  if (store.state.nickname === null) {
    return false;
  }
  try {
    const response = await axios.get(`${store.state.API_URL}/api/users/my-profile`, store.state.config);
    return response.status === HttpStatusCode.Ok;
  } catch (e) {
    return false;
  }
}

const checkNotifications = async () => {
  try {
    const notificationCount = (await axios.get(`${store.state.API_URL}/api/user-notifications/not-read-count`, store.state.config)).data;
    store.commit('setNotificationCount', notificationCount);
  } catch (e) {
    console.error(e);
  }
}

onBeforeMount(async () => {
  if (!(await isAuthorized())) {
    store.commit('logout');
  } else {
    await checkNotifications();
  }
  if (!dataFetched.value) {
    await getAnnouncement();
    await getComments();
  }
});
</script>



<template>
    <AnnouncementPageComponent v-if="!isNotFound"
    :announcement-id = "currentAnnouncement.data.id"
    :announcement-title = "currentAnnouncement.data.title"
    :announcement-content = "currentAnnouncement.data.content"
    :announcement-main-picture-url="currentAnnouncement.data.cover_image"
    :posted-time-ago = "currentAnnouncement.data.date_time"
    :announcement-total-views = "currentAnnouncement.data.total_views"
    :announcement-total-favourites = "currentAnnouncement.data.total_favourites"
    :announcement-total-comments = "currentAnnouncement.data.total_comments"
    :announcement-in-favourites = "currentAnnouncement.data.in_favourites"
    :announcement-comments = "currentAnnouncementComments.data"
    :load-comments="getComments"
    />
  <PageNotFound v-if="isNotFound"
                secondary-message="У вас нет доступа к этому объявлению"/>
</template>

<style scoped>

</style>
