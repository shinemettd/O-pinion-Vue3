<script setup>

import CommentComponent from "@/components/CommentComponent.vue";
import axios from "axios";
import {onMounted} from "vue";

const props = defineProps({
  articleId: Number
})

const articles = async () => {
  onMounted(await axios.get('http://194.152.37.7:8812/api/articles').data.content);
}


</script>

<template>
  <main class = "container mx-auto">
    <div class = "scroll mx-auto border w-50 h-100">
      <div>
        <!--   article content     -->
      </div>
      <div>
        <!--  tags  reactions etc    -->
      </div>
      <div>
        <CommentComponent/>
      </div>
    </div>

    <div>

      <!-- aside panel -->

    </div>
  </main>
</template>

<style scoped>

</style>
