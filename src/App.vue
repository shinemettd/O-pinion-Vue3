<template>
  <v-app>
    <v-main>
      <HelloWorld/>
      <ArticleComponent authors-avatar-url="https://sun1-47.userapi.com/impg/NJf9hcg9WJj_aDXELv4VORt3jpxDKsJ531LSjA/jJjKIsRvD9c.jpg?size=1735x2160&quality=96&sign=af75e7bd1c26dffd16ea73f9ce0c3d78"
                        authors-nickname="shinemettd"
                        postedTimeAgo = "3 часа назад"
                        :article-id = "1"
                        article-title = "Cамая первая статья на сайте, который еще в супер-ранней разработке"
                        article-main-picture-url = "https://i.imgflip.com/76gvoe.jpg"
                        article-short-description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                        :article-rating = "1"
                        :article-total-favourites = "0"
                        :article-total-comments = "0"
                        :article-total-views = "1"/>
    </v-main>
  </v-app>
</template>

<script setup>
  import ArticleComponent from "@/components/ArticleComponent.vue";
</script>
