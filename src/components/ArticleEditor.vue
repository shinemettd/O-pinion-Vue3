<template>
    <!-- Hello from Editor ! -->
    <div class="editor-wrapper">
        <div class="editor">
            <div v-if="contentEditor" class="editor-tool">
                <div class="main-tools">
                  <img src="/icons/type-bold.svg" class="btn-toolbar icon" alt="icon" @click="toggleBold">
                  <img src="/icons/type-italic.svg" class="btn-toolbar icon" alt="icon" @click="toggleItalic">
                  <img src="/icons/type-underline.svg" class="btn-toolbar icon" alt="icon" @click="toggleUnderline">
                  <img src="/icons/type-strikethrough.svg" class="btn-toolbar icon" alt="icon"  @click="toggleStrike">

                  <div class="dropdown">
                    <img src="/icons/search-font.svg" class="btn-toolbar icon" alt="icon" @click="toggleFontMenu">
                    <ul v-if="showFontMenu  && contentCharacterCountNumber < contentLimit" class="toolbar-menu">
                      <li v-for="font in fontOptions" :key="font"  @click="setFont(font)" :style="{ fontFamily: font }">
                        {{ font }}
                      </li>
                    </ul>
                  </div>

                  <div class="dropdown">
                  <img src="/icons/type-h1.svg" class="btn-toolbar icon" alt="icon"  @click="toggleHeadingMenu">
                  <ul v-if="showHeadingMenu && contentCharacterCountNumber < contentLimit" class="toolbar-menu">
                        <li v-for="heading in headings" :key="heading" @click="setHeading(heading.value)" class="list-item">
                            <span>{{ heading.name }}</span>
                        </li>
                    </ul>
                  </div>

                  <img src="/icons/link.svg" class="btn-toolbar icon" alt="icon"   @click="toggleLink">
                  <img src="/icons/align_left.svg" class="btn-toolbar icon" alt="icon"  @click="setTextAlign('left')" :class="{ 'is-active': contentEditor.isActive({ textAlign: 'left' }) }">
                  <img src="/icons/align_justify.svg" class="btn-toolbar icon" alt="icon" @click="setTextAlign('justify')" :class="{ 'is-active': contentEditor.isActive({ textAlign: 'justify' }) }">
                  <img src="/icons/align_center.svg" class="btn-toolbar icon" alt="icon" @click="setTextAlign('center')" :class="{ 'is-active': contentEditor.isActive({ textAlign: 'center' }) }">
                  <img src="/icons/align_right.svg" class="btn-toolbar icon" alt="icon" @click="setTextAlign('right')" :class="{ 'is-active': contentEditor.isActive({ textAlign: 'right' }) }">

                  <img src="/icons/list-ul.svg" class="btn-toolbar icon" alt="icon" @click="toggleBulletList">
                  <img src="/icons/list-ol.svg" class="btn-toolbar icon" alt="icon" @click="toggleOrderedList">
                  <img src="/icons/quotes.svg" class="btn-toolbar icon" alt="icon" @click="toggleBlockquote">
                  <img src="/icons/code.svg" class="btn-toolbar icon" alt="icon" @click="toggleCodeBlock">
                  <input type="file"  style="display: none;" @change="addImage" accept="image/*" id = "addImage">
                  <img src="/icons/upload_img.svg" class="btn-toolbar icon" alt="icon"  @click="openFileInput">

                  <img src="/icons/rm-image.svg" class="btn-toolbar icon" alt="icon"  @click="deleteSelection">


                  <div class="dropdown">
                    <img src="/icons/math-sign.svg" class="btn-toolbar icon" alt="icon" @click="toggleMathMenu">
                    <ul v-if="showMathMenu && contentCharacterCountNumber < contentLimit" class="toolbar-menu">
                        <li v-for="operation in mathOptions" :key="operation.name" @click="insertMathOperation(operation)" class="list-item">
                            <img v-if="operation.icon !== null" :src="operation.icon" class="math-icon" :alt="operation.name">
                            <span v-else>{{ operation.value }}</span>
                        </li>
                    </ul>
                  </div>

                  <div class="dropdown">
                    <img src="/icons/highlighter.svg" id="colorPickerButton" class="btn-toolbar icon" alt="icon">
                    <ul v-if="showColorMenu && contentCharacterCountNumber < contentLimit" class="color-menu">
                          <li v-for="color in colors" :key="color" @click="highlightText(color)" class="color-item">
                            <div class="color-circle" :style="{ backgroundColor: color }"></div>
                          </li>
                    </ul>
                  </div>




                </div>

                <div class="undo-redo">
                  <img src="/icons/undo.svg" class="btn-toolbar icon" alt="icon"  @click="undoWithImages">
                  <img src="/icons/redo.svg" class="btn-toolbar icon" alt="icon"  @click="contentEditor.chain().focus().redo().run()" :disabled="!contentEditor.can().redo()">
                </div>
            </div>

            <editor-content :editor="contentEditor" class="custom-editor"/>
            <div class="character-count"  v-if="contentEditor">
                {{ contentEditor.storage.characterCount.words() }} words
                <br>
                <div class="character-count" v-if="contentCharacterCountNumber >= 38000" :style="{ color: 'red'}">
                    {{ contentCharacterCountNumber }}/{{ contentLimit }} HTML characters
                </div>
            </div>


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
import History from '@tiptap/extension-history'
import Highlight from '@tiptap/extension-highlight'
import CharacterCount from '@tiptap/extension-character-count'

import { ref , onMounted, onUpdated } from 'vue';
import axios from "axios";
import store from "@/store/store";

export default {
    props: ['showModal', 'isImageValid'],
    components: {
        EditorContent,
    },
    setup(props) {
        console.log('showModal received as', typeof props.showModal); // Добавляем console.log при получении пропса showModal
        const lowlight = createLowlight(common);
        const contentLimit = ref(40000);
        const contentCharacterCountNumber = ref(0);
        const maxAcceptableImgNum = ref(3);

        const imageInput = ref(null);

        const showFontMenu = ref(false);
        const showMathMenu = ref(false);
        const showHeadingMenu = ref(false);
        const showColorMenu = ref(false);
        const colors = ['#DBA945','#FC8282','#9ADEFF','#9AFFC3'];

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

        const contentEditor = new Editor({
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
            History.configure({
                depth: 10,
            }),
            Highlight.configure({ multicolor: true }),
            CharacterCount
        ],
            content: `
            <p>Введите текст ...</p>
            `,
        });

        // Функция, которая будет вызвана после монтирования элемента в DOM
        onMounted(() => {
            const savedContent = localStorage.getItem('articleContent');
            if (savedContent) {
                contentEditor.commands.setContent(savedContent);
                contentCharacterCountNumber.value = contentEditor.getHTML().length;
            }


            contentEditor.on('update', ({  }) => {
                contentCharacterCountNumber.value = contentEditor.getHTML().length;
                if (contentCharacterCountNumber.value > contentLimit.value) {
                    contentEditor.chain().focus().undo().run();
                    props.showModal('/icons/risovach.ru.jpg', null);
                }
                if (contentCharacterCountNumber.value >= contentLimit.value) {
                    contentEditor.setOptions({ editable: false });

                } else {
                    contentEditor.setOptions({ editable: true });

                }
            });


            imageInput.value = document.getElementById('addImage');

            const colorPickerButton = document.getElementById('colorPickerButton');

            colorPickerButton.addEventListener('click', () => {
            showColorMenu.value = !showColorMenu.value;
            });

        });

        onUpdated(() => {
            localStorage.setItem('articleContent', contentEditor.getHTML());
        });


        const undoWithImages = () => {
            const imgNumBedoreUndo = ref(countImagesInEditor());
            contentEditor.chain().focus().undo().run();
            if(imgNumBedoreUndo.value !== countImagesInEditor()) { // если удалили фотографию
                contentEditor.chain().focus().redo().run();
            }
        }

        function countImagesInEditor() {
            var editor = document.querySelector('.custom-editor');
            if (!editor) {
                return -1;
            }

            var images = editor.querySelectorAll('img');

            return images.length;
        }

        const deleteSelection = () => {
            const selection = contentEditor.state.selection;
            if (selection.node && selection.node.attrs && selection.node.attrs.src) {
                const src = selection.node.attrs.src;
                console.log("Путь к изображению:", src);
                contentEditor.commands.deleteSelection();
                deleteImageFromServer(src);
            }
        };

        const deleteImageFromServer = async(imagePath) => {
            try {
                const accessToken = localStorage.getItem('accessToken');

                const response = await axios.delete(`${store.state.API_URL}/api/images?image-path=${encodeURIComponent(imagePath)}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                console.log('Изображение успешно удалено');

            } catch (error) {
                if (error.response && error.response.data && error.response.data.errors) {
                    const serverErrors = error.response.data.errors;
                    showModal(null, serverErrors);

                } else {
                    console.error('Ошибка удаления изображения:', error);
                }
            }

        }

        const getHTMLContent = () => {
            return contentEditor.getHTML();
        };


        const highlightText = (selectedColor) => {
            contentEditor.chain().focus().toggleHighlight({ color: selectedColor}).run();
        }
        const insertMathOperation = (operation) => {
            contentEditor.commands.insertContent(operation.value);
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
            contentEditor.chain().focus().toggleHeading({ level: value }).run();
        };

        const setFont = (font) => {
            contentEditor.chain().focus().setFontFamily(font).run();
            toggleFontMenu();
        };

        const setLink = () => {
            const previousUrl = contentEditor.getAttributes('link').href
            const url = window.prompt('URL', previousUrl)

            if (url === null) {
            return
            }

            if (url === '') {
            contentEditor
                .chain()
                .focus()
                .extendMarkRange('link')
                .unsetLink()
                .run()

            return
            }

            contentEditor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run()
        };

        const toggleBlockquote = () => {
            if (contentEditor) {
                if(contentCharacterCountNumber.value >= contentLimit.value) {
                    return;
                }
                contentEditor.chain().focus().toggleBlockquote().run();
            }
        }
        const toggleOrderedList = () => {
            if (contentEditor) {
                if(contentCharacterCountNumber.value >= contentLimit.value) {
                    return;
                }
                contentEditor.chain().focus().toggleOrderedList().run();
            }
        }
        const toggleBulletList = () => {
            if (contentEditor) {
                if(contentCharacterCountNumber.value >= contentLimit.value) {
                    return;
                }
                contentEditor.chain().focus().toggleBulletList().run();
            }
        }
        const setTextAlign = (type) => {
            if (contentEditor) {
                if(contentCharacterCountNumber.value >= contentLimit.value) {
                    return;
                }
                contentEditor.chain().focus().setTextAlign(type).run();
            }
        }
        const toggleCodeBlock = () => {
            if (contentEditor) {
                if(contentCharacterCountNumber.value >= contentLimit.value) {
                    return;
                }
                contentEditor.chain().focus().toggleCodeBlock().run();
            }
        }
        const toggleBold = () => {
            if (contentEditor) {
                if(contentCharacterCountNumber.value >= contentLimit.value) {
                    return;
                }
                contentEditor.chain().focus().toggleBold().run();
            }
        };

        const toggleItalic = () => {
            if (contentEditor) {
                if(contentCharacterCountNumber.value >= contentLimit.value) {
                    return;
                }
                contentEditor.chain().focus().toggleItalic().run();
            }
        };

        const toggleStrike = () => {
            if (contentEditor) {
                if(contentCharacterCountNumber.value >= contentLimit.value) {
                    return;
                }
                contentEditor.chain().focus().toggleStrike().run();
            }
        };

        const toggleUnderline = () => {
            if (contentEditor) {
                if(contentCharacterCountNumber.value >= contentLimit.value) {
                    return;
                }
                contentEditor.chain().focus().toggleUnderline().run();
            }
        };

        const toggleLink = () => {
            if (contentEditor) {
                if(contentCharacterCountNumber.value >= contentLimit.value) {
                    return;
                }
                if (contentEditor.isActive('link')) {
                    contentEditor.chain().focus().unsetLink().run();
                } else {
                    setLink();
                }
            }
        };

        const openFileInput = () => {
            console.log(countImagesInEditor());
            if(countImagesInEditor() >= maxAcceptableImgNum.value) {
                props.showModal("/icons/limit_mem.jpg", 'Максимальное количество фотографий в статье ' + maxAcceptableImgNum.value);
                return;
            }
            if(contentCharacterCountNumber.value >= contentLimit.value) {
                return;
            }
            imageInput.value.click();
        };

        const addImage = async (event) => {
            const imageFile = ref(event.target.files[0]);
            if(await props.isImageValid(imageFile)) {
                console.log('valid image');
                loadImageOnServer(imageFile);

            }
        };


        const loadImageOnServer = async(file) => {
            try {
                const formData = new FormData();
                formData.append('photo', file.value);

                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.post(`${store.state.API_URL}/api/images`, formData, {
                    headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                    }
                });

                if (response) {

                    contentEditor.commands.focus(contentEditor.state.doc.content.size);
                    contentEditor.chain().setImage({ src: response.data }).run();

                    console.log(response.data);
                    console.log('currentImNum = ' + countImagesInEditor());
                }

            } catch (error) {
                if (error.response && error.response.data && error.response.data.errors) {
                    const serverErrors = error.response.data.errors;
                    showModal(null, serverErrors);

                } else {
                    console.error('Ошибка загрузки  изображения:', error);
                }
            }
        }


        return {
            contentEditor,
            toggleBold,
            toggleItalic,
            toggleStrike,
            toggleUnderline,
            toggleLink,
            showFontMenu,
            showMathMenu,
            showHeadingMenu,
            showColorMenu,
            fontOptions,
            mathOptions,
            colors,
            headings,
            toggleFontMenu,
            toggleMathMenu,
            toggleHeadingMenu,
            setFont,
            setHeading,
            insertMathOperation,
            highlightText,
            contentLimit,
            openFileInput,
            addImage,
            getHTMLContent,
            deleteSelection,
            undoWithImages,
            contentCharacterCountNumber,
            toggleCodeBlock,
            toggleBulletList,
            toggleOrderedList,
            toggleBlockquote,
            setTextAlign,
        };
    },

}

</script>

<style>

.editor-wrapper {
    background-color: #f8f8f8;
    padding: 20px;
}

.editor {
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.editor-tool {
    background-color: #f2f2f2;
    padding: 10px;
    border: 1px solid #ccc;

    display: flex;
    justify-content: space-between;
}

.btn-toolbar {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 6px 10px;
    margin-right: 5px;
    cursor: pointer;
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



.toolbar-menu {
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

.color-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  z-index: 1;
  min-width: 200px;
  max-height: 60px;
  overflow-x: auto;
  display: flex;
}
.color-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-block;
}

.toolbar-menu li, .color-menu li{
  padding: 8px 16px;
  cursor: pointer;
  max-height: 40px;
}

.toolbar-menu li img {
  max-height: 30px;
}
.toolbar-menu li:hover {
  background-color: #ddd;
}


.toolbar-menu, .color-menu {
  display: none;
}

.dropdown:hover .toolbar-menu {
  display: block;
}

.dropdown:hover .color-menu {
  display: flex;
}


.custom-editor {
    border: #000000 solid;
    height: 90vh;
    max-height: 700px;
    overflow-y: auto;
    line-height: 2;
    padding: 20px;

}


</style>
