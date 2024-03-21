<script setup>
import axios, {HttpStatusCode} from "axios";
import {onBeforeMount, ref} from "vue";
import { useRoute } from 'vue-router';
import AnnouncementPageComponent from "@/components/AnnouncementPageComponent.vue";
import store from "@/store/store";

const currentAnnouncement = ref('');
const currentAnnouncementComments = ref('');
const dataFetched = ref(false);

const route = useRoute();
const announcementId = (route.params.announcementId);

const getAnnouncement = async () => {
  if (store.state.isAuthorized) {
    currentAnnouncement.value = await axios.get(`${store.state.API_URL}/api/announcements/${announcementId}`, store.state.config);
  } else {
    currentAnnouncement.value = await axios.get(`${store.state.API_URL}/api/announcements/${announcementId}`);
  }
  dataFetched.value = true;
}

const getComments = async () => {
    currentAnnouncementComments.value = await axios.get(`${store.state.API_URL}/api/announcement-comments/${announcementId}`);
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

onBeforeMount(async () => {
  if (!(await isAuthorized())) {
    store.commit('logout');
  }
  if (!dataFetched.value) {
    await getAnnouncement();
    await getComments();
  }
});
</script>



<template>
    <AnnouncementPageComponent
    :announcement-id = "currentAnnouncement.data.id"
    :announcement-title = "currentAnnouncement.data.title"
    :announcement-content = "currentAnnouncement.data.content"
    :posted-time-ago = "currentAnnouncement.data.date_time"
    :announcement-total-views = "currentAnnouncement.data.total_views"
    :announcement-total-favourites = "currentAnnouncement.data.total_favourites"
    :announcement-total-comments = "currentAnnouncement.data.total_comments"
    :announcement-in-favourites = "currentAnnouncement.data.in_favourites"
    :announcement-comments = "currentAnnouncementComments.data"
    :load-comments="getComments"
    />
</template>

<style scoped>

</style>
