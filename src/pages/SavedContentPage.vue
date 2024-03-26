<template>
    <main class="mx-auto">
        <div class="scroll mx-auto border w-full lg:w-2/3 xl:w-1/2 h-auto lg:h-100 px-10">
            <div class = "w-full lg:w-auto mb-5 lg:mb-0 text-center lg:text-left mt-3">
                <v-btn-toggle v-model="showToggle" color="purple" class="ml-5" mandatory>
                    <v-btn
                    @click = "content = 'article'">
                     Статьи
                    </v-btn>
                    <v-btn
                    @click = "content = 'announcement'">
                     Объявления
                    </v-btn>
                </v-btn-toggle>
                </div>
                <hr>
                <div v-if="content === 'article'">
                    <div v-if="articles.length > 0" v-for="article in articles" :key="article.id" class="scroll-content my-7">
                        <ArticlePreviewComponent
                        :authors-nickname="article.author.nickname"
                        :authors-avatar-url="article.author.avatar || 'https://cdn-icons-png.flaticon.com/512/10/10938.png'"
                        :postedTimeAgo="article.date_time"
                        :article-id="article.id"
                        :article-title="article.title"
                        :article-main-picture-url="article.cover_image"
                        :article-short-description="article.short_description"
                        :article-rating="article.rating"
                        :article-in-favourites="article.in_favourites"
                        :article-total-favourites="article.total_favourites"
                        :article-total-comments="article.total_comments"
                        :article-total-views="article.total_views"
                        />
                    </div>
                </div>
                <div v-else-if="content === 'announcement'">
                   <div v-if="announcements.length > 0" v-for="announcement in announcements" :key="announcement.id" class="scroll-content my-7">
                        <AnnouncementPreviewComponent
                        :postedTimeAgo="announcement.date_time"
                        :announcement-id="announcement.id"
                        :announcement-title="announcement.title"
                        :announcement-content = "announcement.content"
                        :announcement-main-picture-url="announcement.cover_image"
                        :announcement-total-favourites="announcement.total_favourites"
                        :announcement-in-favourites="announcement.in_favourites"
                        :announcement-total-comments="announcement.total_comments"
                        :announcement-total-views="announcement.total_views"
                        />
                    </div>
                </div>
                <div v-if="loading" class="loading-spinner">
                    <div class="loading-content">
                        <img src="/icons/heart-loading.gif" alt="Loading..." style="margin: auto;">
                    </div>
                </div>
                <div v-if = "articles.length" v-observe-visibility="handleScrolledToBottom"> </div>
        </div>
    </main>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import store from "@/store/store";
import axios, {HttpStatusCode} from "axios";
import ArticlePreviewComponent from "@/components/ArticlePreviewComponent.vue";
import AnnouncementPreviewComponent from "@/components/AnnouncementPreviewComponent.vue";


const showToggle = ref(0);
const content = ref('article');
const loading = ref(false);
const sortBy = ref('dateTime,desc');
const articles = ref([]);
const announcements = ref([]);
const currentArticlePage = ref(0);
const currentAnnouncementPage = ref(0);
const articleTotalPages = ref(0);
const announcementTotalPages = ref(0);

const getAnnouncements = async () => {
  loading.value = true;
  const config = {
    // params: {
    //   sort: sortBy.value
    // },
    headers: {
      'Authorization': `Bearer ${store.state.userToken}`
    }
  };

  try {
    const response = await axios.get(`${store.state.API_URL}/api/saved-announcements?page=${currentAnnouncementPage.value}`, config);
    loading.value = false;
    announcements.value.push(...response.data.content);
    announcementTotalPages.value = response.data.totalPages;
  } catch (error) {
    loading.value = false;
    console.error('Не удалось загрузить объявления:', error);
  }
}

const getArticles = async () => {
  loading.value = true;
  const config = {
    // params: {
    //   sort: sortBy.value
    // },
    headers: {
      'Authorization': `Bearer ${store.state.userToken}`
    }
  };

  try {
    const response = await axios.get(`${store.state.API_URL}/api/saved-articles?page=${currentArticlePage.value}`, config);
    loading.value = false;
    articles.value.push(...response.data.content);
    articleTotalPages.value = response.data.totalPages;
  } catch (error) {
    loading.value = false;
    console.error('Не удалось загрузить статьи:', error);
  }
}

const handleScrolledToBottom = (isVisible) => {
  if (!isVisible) { return };
  if(content.value === 'article') {
    if (currentArticlePage.value >= articleTotalPages.value) { return };
    currentArticlePage.value += 1;
    getArticles();
  } else if(content.value === 'announcement') {
    if (currentAnnouncementPage.value >= announcementTotalPages.value) { return };
    currentAnnouncementPage.value += 1;
    getAnnouncements();
  }
  
  
}


onBeforeMount(async () => {
  if (!(await isAuthorized())) {
    store.commit('logout');
  }
  await getArticles();
  await getAnnouncements();
});

const isAuthorized = async () => {
  if (store.state.nickname === null) {
    await router.push('/');
    return false;
  }
  try {
    const response = await axios.get(`${store.state.API_URL}/api/users/my-profile`, store.state.config);
    return response.status === HttpStatusCode.Ok;
  } catch (e) {
    return false;
  }
}

</script>
<style scoped>


.loading-spinner {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.loading-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%
}

.loading-content img {
    height: 100px;
}
</style>