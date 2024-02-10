<template>
     <div class="article-container">
      <div class="article-form">
        <h2>Создание статьи</h2>
  
        <label for="title">Заголовок:</label>
        <input v-model="title" type="text" id="title"/>
  
        <label for="short-description">Краткое описание:</label>
        <textarea v-model="short_description" id="short-description"></textarea>
  
        <label for="cover-image">Главное изображение (выберите файл):</label>
        <img id="uploaded-image" src="" alt="Загруженное изображение">
        <div class="image-upload">
            <input type="file" @change="handleFile" accept="image/*"/>
            <button class="delete-btn" @click="deleteImage">Удалить</button> 
        </div>
        
        <h2>Добавление контента</h2>
        <div class="editor-tool">
            <div v-if="editor">

                <img src="/icons/type-bold.svg" class="btn-toolbar icon" alt="icon" @click="toggleBold">
                <img src="/icons/type-italic.svg" class="btn-toolbar icon" alt="icon" @click="toggleItalic">
                <img src="/icons/type-underline.svg" class="btn-toolbar icon" alt="icon" @click="toggleUnderline">
                <img src="/icons/type-strikethrough.svg" class="btn-toolbar icon" alt="icon"  @click="toggleStrike">
            
                <div class="dropdown">
                  <img src="/icons/search-font.svg" class="btn-toolbar icon" alt="icon" @click="toggleFontMenu">
                  <ul v-if="showFontMenu" class="menu">
                    <li v-for="font in fontOptions" :key="font"  @click="setFont(font)" :style="{ fontFamily: font }">
                      {{ font }}
                    </li>
                  </ul>
                </div>

                <img src="/icons/link.svg" class="btn-toolbar icon" alt="icon"   @click="toggleLink">
                <img src="/icons/align_left.svg" class="btn-toolbar icon" alt="icon"  @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
                <img src="/icons/align_justify.svg" class="btn-toolbar icon" alt="icon" @click="editor.chain().focus().setTextAlign('justify').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
                <img src="/icons/align_center.svg" class="btn-toolbar icon" alt="icon" @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
                <img src="/icons/align_right.svg" class="btn-toolbar icon" alt="icon" @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">

                <img src="/icons/list-ul.svg" class="btn-toolbar icon" alt="icon" @click="editor.chain().focus().toggleBulletList().run()">
                <img src="/icons/list-ol.svg" class="btn-toolbar icon" alt="icon" @click="editor.chain().focus().toggleOrderedList().run()">
                <img src="/icons/quotes.svg" class="btn-toolbar icon" alt="icon" @click="editor.chain().focus().toggleBlockquote().run()">
                <img src="/icons/code.svg" class="btn-toolbar icon" alt="icon" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
                <input type="file" ref="fileInputRef" style="display: none;" @change="addImage">
                <img src="/icons/upload_img.svg" class="btn-toolbar icon" alt="icon"  @click="openFileInput">

              
                <div class="dropdown">
                  <img src="/icons/math-sign.svg" class="btn-toolbar icon" alt="icon" @click="toggleMathMenu">
                  <ul v-if="showMathMenu" class="menu">
                      <li v-for="operation in mathOptions" :key="operation.name" @click="insertMathOperation(operation)" class="list-item">
                          <img v-if="operation.icon !== null" :src="operation.icon" class="math-icon" :alt="operation.name">
                          <span v-else>{{ operation.value }}</span>
                      </li>
                  </ul>
              </div>
              <div class="dropdown">
                <img src="/icons/type-h1.svg" class="btn-toolbar icon" alt="icon"  @click="toggleHeadingMenu">
                <ul v-if="showHeadingMenu" class="menu">
                      <li v-for="heading in headings" :key="heading" @click="setHeading(heading.value)" class="list-item">
                          <span>{{ heading.name }}</span>
                      </li>
                  </ul>
              </div>
             



          </div>
        </div>
        <editor-content :editor="editor" class="custom-editor"/>
       
  
        <button class="btn" @click="submitArticle">Создать статью</button>
      </div>
    </div>
  </template>
  
  <script>
   import { Editor, EditorContent } from '@tiptap/vue-3'
  import Document from '@tiptap/extension-document'
  import FontFamily from '@tiptap/extension-font-family'
  import Dropcursor from '@tiptap/extension-dropcursor'
  import Paragraph from '@tiptap/extension-paragraph'
  import Text from '@tiptap/extension-text'
  import TextStyle from '@tiptap/extension-text-style'
  import Heading from '@tiptap/extension-heading'

  import Image from '@tiptap/extension-image'
  import Bold from '@tiptap/extension-bold'
  import Italic from '@tiptap/extension-italic'
  import Strike from '@tiptap/extension-strike'
  import Underline from '@tiptap/extension-underline'
  import Link from '@tiptap/extension-link'
  import TextAlign from '@tiptap/extension-text-align'
  import ListItem from '@tiptap/extension-list-item'
  import BulletList from '@tiptap/extension-bullet-list'
  import OrderedList from '@tiptap/extension-ordered-list'
  import Blockquote from '@tiptap/extension-blockquote'
  import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
  import {common, createLowlight} from 'lowlight'

  import { Mathematics } from '@tiptap-pro/extension-mathematics'
  import 'katex/dist/katex.min.css'
 
  import axios from 'axios';
  import { ref , onMounted } from 'vue';
  
  export default {
  components: {
    EditorContent,
  },
  setup() {
    // const lowlight = createLowlight(common)
    const title = ref('');
    const short_description = ref('');
    const cover_image = ref('');
    const id = ref('');
    const fileInputRef = ref(null);
    const lowlight = createLowlight(common);

    const showFontMenu = ref(false);
    const showMathMenu = ref(false);
    const showHeadingMenu = ref(false);
    const headings = [
                { name: 'H1', value: 1 },
                { name: 'H2', value: 2 },
                { name: 'H3', value: 3 },
                { name: 'H4', value: 4 },
                { name: 'H5', value: 5 },
                { name: 'H6', value: 6 }
    ];
    const fontOptions = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Tahoma', 'monospace'];
    const mathOptions = [
                { name: '√x', icon: '/icons/sqrt.svg' , value: '$\\sqrt{x}$'},
                { name: '√', icon: '/icons/root.svg', value: '$\\sqrt[n]{x}$' },
                { name: 'power', icon: '/icons/power.svg', value: '$x^{n}$' },
                { name: '∑', icon: '/icons/sum.svg', value: '$\\sum_{i=0}^n x_i$' },
                { name: '∫', icon: '/icons/integral.svg', value: '$\\int_a^b x^2 dx$' },
                { name: 'sin(x)', icon: null,  value:'sin(x)'},
                { name: 'cos(x)', icon: null, value:'cos(x)'},
                { name: 'tan(x)', icon: null, value:'tan(x)' },
                { name: 'log(x)', icon: null, value: 'log(x)'},
                { name: 'ln(x)',  icon: null, value: 'ln(x)'},
                { name: 'binom', icon: '/icons/binom.svg', value: '$\\binom{n}{k}$' },
                { name: '1/x', icon: '/icons/over.svg', value: '$\\frac{1}{x}$' },
                { name: '(1/x)', icon: '/icons/over2.svg', value: '$\\left(\\frac{1}{x}\\right)$' },
                { name: '𝝅', icon: null, value: '𝝅' },
                { name: 'e', icon: null, value: 'e' },
                { name: 'infinity', icon: '/icons/infinity.svg', value: '$\\infty$' }
            ];

    const editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Heading,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Image,
        TextStyle,
        FontFamily,
        Dropcursor,
        Bold,
        Italic,
        Strike,
        Underline,
        Link.configure({
          openOnClick: true,
        }),
        BulletList,
        ListItem,
        OrderedList,
        Blockquote,
        CodeBlockLowlight.configure({
          lowlight,
        }),
        Mathematics,
       
      ],
      content: `
        <p>This is a basic example of implementing images. </p>
      `,
    });

    // Функция, которая будет вызвана после монтирования элемента в DOM
    onMounted(() => {
      // Устанавливаем ссылку на DOM-элемент input
      fileInputRef.value = document.querySelector('input[type="file"]');
    });

    const insertMathOperation = (operation) => {
      //  editor.chain().focus().insertText(operation.value).run();
      editor.commands.insertContent(operation.value);
    }

    const toggleHeadingMenu = () => {
      showHeadingMenu.value = !showHeadingMenu.value;
    }
    const toggleMathMenu = () => {
      showMathMenu.value = !showMathMenu.value;
    };

    const toggleFontMenu = () => {
      showFontMenu.value = !showFontMenu.value;
    };

    const setHeading = (value) => {
      editor.chain().focus().toggleHeading({ level: value }).run();
    };
    
    const setFont = (font) => {
      editor.chain().focus().setFontFamily(font).run();
      toggleFontMenu(); 
    };
    
    const setLink = () => {
      const previousUrl = editor.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetLink()
          .run()

        return
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    };

     // Функция для переключения стиля жирного текста
    const toggleBold = () => {
      if (editor) {
        if (editor.isActive('bold')) {
          editor.chain().focus().unsetBold().run();
        } else {
          editor.chain().focus().setBold().run();
        }
      }
    };

    const toggleItalic = () => {
      if (editor) {
        if (editor.isActive('italic')) {
          editor.chain().focus().unsetItalic().run();
        } else {
          editor.chain().focus().setItalic().run();
        }
      }
    };

    const toggleStrike = () => {
      if (editor) {
        if (editor.isActive('strike')) {
          editor.chain().focus().unsetStrike().run();
        } else {
          editor.chain().focus().setStrike().run();
        }
      }
    };

    const toggleUnderline = () => {
      if (editor) {
        if (editor.isActive('underline')) {
          editor.chain().focus().unsetUnderline().run();
        } else {
          editor.chain().focus().setUnderline().run();
        }
      }
    };

    const toggleLink = () => {
      if (editor) {
        if (editor.isActive('link')) {
          editor.chain().focus().unsetLink().run();
        } else {
          setLink();
        }
      }
    };

    const openFileInput = () => {
      fileInputRef.value.click();
    };

    const handleFile = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('photo', file);
    
          const accessToken = localStorage.getItem('accessToken');
          const response = await axios.post('http://194.152.37.7:8812/api/images', formData, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          });
    
          cover_image.value = response.data;
          const imgElement = document.getElementById('uploaded-image');
          const fileName = cover_image.value.split('/').pop();
          imgElement.src = '/images/articles_images/' + fileName;
          console.log('Изображение успешно загружено:', imgElement.src);
        } catch (error) {
          console.error('Ошибка загрузки изображения:', error);
        }
      }
    };

    const addImage = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('photo', file);
    
          const accessToken = localStorage.getItem('accessToken');
          const response = await axios.post('http://194.152.37.7:8812/api/images', formData, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          });
    
          if (response) {
            const imagePath = response.data;
            const fileName = imagePath.split('/').pop();
            editor.chain().focus().setImage({ src: '/images/articles_images/' + fileName }).run();
            console.log(response.data);
            console.log('/images/articles_images/' + fileName)
          }
         
        } catch (error) {
          console.error('Ошибка загрузки изображения:', error);
        }
      }
    };

    const deleteImage = async (event) => {
      console.log("Удаление картинки");
      const imgElement = document.getElementById('uploaded-image');
      imgElement.src = "";
      const inputElement = document.querySelector('input[type="file"]');
      inputElement.value = '';
        
      // запрос на сервер для удаления картинки 
    };

    const submitArticle = async () => {
      try {
        const data = {
          title: title.value,
          short_description: short_description.value,
          cover_image: cover_image.value || '',
        };
    
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.post('http://194.152.37.7:8812/api/articles', data, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        id.value = response.data.id;
      } catch (error) {
        console.error('Error submitting article:', error);
      }
    };

    return {
      title,
      short_description,
      cover_image,
      id,
      editor,
      fileInputRef,
      openFileInput,
      handleFile,
      addImage,
      deleteImage,
      submitArticle,
      toggleBold,
      toggleItalic,
      toggleStrike,
      toggleUnderline,
      toggleLink,
      showFontMenu,
      showMathMenu,
      showHeadingMenu,
      fontOptions,
      mathOptions,
      headings,
      toggleFontMenu,
      toggleMathMenu,
      toggleHeadingMenu,
      setFont,
      setHeading,
      insertMathOperation,

    };
  },
  
  beforeUnmount() {
    editor.destroy();
  },
};


  </script>
  
  <style scoped>

  .article-container {
    background-color: #f8f8f8;
    padding: 20px;
  }
  
  .article-form,
  .content-form {
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }
  
  h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 16px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  
  .btn, .delete-btn{
    background-color: #1e066e;
    color: #fff;
    padding: 12px 20px;
    margin:20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }

  .delete-btn {
    background-color: red;
    padding: 6px 10px;
  }
  .delete-btn:hover {
    background-color: rgb(143, 37, 37);

  }
  .custom-editor {
    border: #1e066e solid;
    height: 50vh;
    max-height: 400px; /* Максимальная высота редактора */
    overflow-y: auto; /* Появляется вертикальный скролл, если контент выходит за пределы редактора */
    line-height: 2;
    padding: 20px;
    
  }
  .editor-tool {
    background-color: #f2f2f2;
    padding: 10px;
    border: 1px solid #ccc;
  }

  .btn-toolbar {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 6px 10px;
    margin-right: 5px;
    cursor: pointer;
    height: 2.5em;
    display: inline;
    width: 50px;
    height: 40px;
  }

  .btn-toolbar:hover {
  background-color: #eaeaea;
  }

  .icon  {
    display: inline;
  }

  .bold {
  font-weight: bold;
}

.italic {
  font-style: italic;
}

.underline {
  text-decoration: underline;
}

.strikethrough {
  text-decoration: line-through;
}

.dropdown {
  display: inline;
  position: relative;
}



.menu{
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
  max-height: 150px;
  overflow-y: auto; 
}

.menu li{
  padding: 8px 16px;
  cursor: pointer;
  max-height: 40px;
}

.menu li img {
  max-height: 30px;
}
.menu li:hover {
  background-color: #ddd;
}


.menu{
  display: none;
}

.dropdown:hover .menu {
  display: block;
}





</style>
  
