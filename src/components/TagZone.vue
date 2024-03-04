<template>
    <div class="tag-zone-wrapper">
        <div class="tag-zone">
            <div class="selected-tags-container">
              <div v-for="tag in selectedTags" :key="tag.id" class="selected-tag">
                {{ tag.name }}
                <span class="close-icon" @click="removeTag(tag)">×</span>
              </div>
            </div>
            <div class="tag-functionality">
              <div class="select-tag">
                <div class="dropdown">
                    <button @click="toggleTagMenu">Выбрать теги</button>
                    <ul v-if="showTagMenu" class="tag-menu" ref="tagMenuRef" @scroll="handleScroll">
                        <li v-for="tag in existingTags" :key="tag.id" @click="pickTag(tag)" class="list-item">
                            <div>{{ tag.name }}</div>
                        </li>
                    </ul>
                </div>
              

            </div>
            <div class="find-tag" >
              <input type="text" @input="() => loadTags(0)" placeholder="Поиск..." class="search-tag-input" v-model="searchTagQuery"  >
              <!-- <button @click="searchTag" class="search-button"><i class="fas fa-search"></i></button> -->
              <div v-if="searchTagQuery && matchingTags.length > 0" class="matching-tags" ref="searchResponseContainer" @scroll="handleSearchResponseScroll">
                <ul>
                  <li v-for="tag in matchingTags" :key="tag.id" @click="pickTag(tag)" class="list-item">{{ tag.name }}</li>
                </ul>
              </div>
            </div>
            <div class="create-tag">
              <input type="text" placeholder="Введите название тега" v-model="newTagName" class="search-tag-input">
              <button @click="createTag">Создать</button>
            </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUpdated } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const selectedTags = ref([]);
      const existingTags = ref([]);
      const showTagMenu = ref(false);
      const page = ref(0); 
      const currentSearchResponsePage = ref(0);
      const pageSize = ref(10);
      const tagMenuRef = ref(null); 
      const searchResponseContainer = ref(null);
      const isScrollEnd = ref(false);
      const searchTagQuery = ref(null);
      const matchingTags = ref([]);
      const accessToken = localStorage.getItem('accessToken');
      const newTagName = ref('');


      onMounted(() => {
        fetchExistingTags(page.value);
        const storedTags = localStorage.getItem('selectedTags');
        selectedTags.value = storedTags ? JSON.parse(storedTags) : [];
      });

      onUpdated(() => {
        localStorage.setItem('selectedTags', JSON.stringify(selectedTags.value));
      });

      const fetchExistingTags = async (pageNumber) => {
        try {
            const response = await axios.get('http://194.152.37.7:8812/api/tags', {
                params: {
                    page: pageNumber,
                    size: pageSize.value
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            // console.log('страница ' + pageNumber + ' response.data.content.length' + response.data.content.length);
            if (response.data.content.length === 0) {
                isScrollEnd.value = true;
                return;
            }
            existingTags.value = [...existingTags.value, ...response.data.content];
        } catch (error) {
            console.error('Ошибка при получении тегов:', error);
        }
    };

      const toggleTagMenu = async () => {
        showTagMenu.value = !showTagMenu.value;
      };

      const pickTag = (tag) => {
        if (!selectedTags.value.some(existingTag => existingTag.id === tag.id)) {
          selectedTags.value.push(tag);
        } else {
          alert('Тег ' + tag.name + ' уже выбран');
        }
      }
      
      const removeTag = (tag) => {
        const index = selectedTags.value.indexOf(tag);
        if (index !== -1) {
          selectedTags.value.splice(index, 1);
        }
      }
      

      const handleScroll = () => {
        if(!isScrollEnd.value) {
            const container = tagMenuRef.value;
            if (container.scrollHeight - container.clientHeight <= container.scrollTop + 100) {
                page.value++;
                fetchExistingTags(page.value);
            }
        }
      };

      const handleSearchResponseScroll = () => {
        const container = searchResponseContainer.value;
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
          loadTags(currentSearchResponsePage.value); 
        }
      };

      const loadTags = async (pageNum) => {
        if(pageNum === 0) {
          currentSearchResponsePage.value = 0;
        }
        try {
          const response = await axios.get('http://194.152.37.7:8812/api/tags/search', {
            params: {
              name: searchTagQuery.value,
              page: pageNum,
              size: pageSize.value
            }, 
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          if (response.data.content && response.data.content.length > 0) {
            matchingTags.value = response.data.content;
            currentSearchResponsePage.value++; 
          }
        } catch (error) {
          console.error('Error fetching tags:', error);
        }
    };

    const createTag = async () => {
      if(newTagName.value === '') {
        alert('Прежде чем создать тег введите имя тега ');
        return;
      }

      if(selectedTags.value.some(existingTag => existingTag.name.toLowerCase() === newTagName.value.toLowerCase())) {
        alert('тег ' + newTagName.value + ' уже добавлен');
        return;
      }

      try {
          const response = await axios.post('http://194.152.37.7:8812/api/tags', {
            name: newTagName.value
          }, {
              headers: {
                  'Authorization': `Bearer ${accessToken}`
              }
          });
          if(!selectedTags.value.some(existingTag => existingTag.name.toLowerCase() === response.data.name.toLowerCase())) {
            selectedTags.value.push({ id: response.data.id, name: response.data.name});
          }
          newTagName.value = '';
        } catch (error) {
          alert('Ошибка сохранения тега ');
        }
      
    };
  
      return {
        selectedTags,
        existingTags,
        fetchExistingTags,
        toggleTagMenu,
        showTagMenu,
        pickTag, 
        handleScroll,
        handleSearchResponseScroll,
        tagMenuRef,
        searchResponseContainer,
        removeTag,
        searchTagQuery,
        matchingTags,
        loadTags,
        newTagName,
        createTag
      };
    }
  };
  </script>
  
  <style scoped>
  .tag-zone-wrapper {
    background-color: #f8f8f8;
    padding: 20px;
  }
  .tag-zone {
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  
  .selected-tags-container {
    margin-bottom: 20px;
    border: 1px solid #ccc;
    padding: 5px;
    display: flex;
    flex-wrap: wrap;
    min-height: 200px;
  }
  
  .tag-functionality {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .selected-tag {
  display: inline-block;
  background-color: #350454;
  color: white;
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 5px;
  display: inline-block; 
  white-space: nowrap; 
  height: 2rem;
}

.selected-tag .close-icon {
  cursor: pointer;
  margin-left: 5px;
 
}

.selected-tag .close-icon:hover {
  color: red;
}

.search-tag-input {
  padding: 5px;
  border : 2px black solid;
  border-radius: 5px;
}

.matching-tags {
  overflow-y: auto;
  max-height: 200px; 
}
  .existing-tags {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .tag-menu {
    list-style: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    z-index: 1;
    min-width: 300px;
    max-height: 400px;
    overflow-y: auto; 
  }

  .tag-menu {
    display: none;
  }

  .dropdown:hover .tag-menu {
  display: block;
}

  .tag-menu li {
    padding: 8px 16px;
    cursor: pointer;
  }

  .tag-menu li:hover {
    background-color: #ddd;
}
  
  button {
    background-color: #1e066e;
    color: #fff;
    padding: 12px 20px;
    margin:20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  </style>
  