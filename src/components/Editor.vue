<template>
   <div class="text-editor">
            <div v-if="editor" class="editor-toolbar">
                <div class="main-tools">
                    <img src="/icons/type-bold.svg" class="toolbar-item" alt="icon" @click="toggleBold">
                    <img src="/icons/type-italic.svg" class="toolbar-item" alt="icon" @click="toggleItalic">
                    <img src="/icons/type-underline.svg" class="toolbar-item" alt="icon" @click="toggleUnderline">
                    <img src="/icons/type-strikethrough.svg" class="toolbar-item" alt="icon"  @click="toggleStrike">
                
                    <img src="/icons/link.svg" class="toolbar-item" alt="icon"   @click="toggleLink">

                    <img src="/icons/quotes.svg" class="toolbar-item" alt="icon" @click="toggleBlockquote">
                    <img src="/icons/code.svg" class="toolbar-item" alt="icon" @click="toggleCodeBlock" :class="{ 'is-active': editor.isActive('codeBlock') }">
                
                    <div class="dropdown">
                        <img src="/icons/math-sign.svg" class="toolbar-item" alt="icon" @click="toggleMathMenu">
                        <ul v-if="showMathMenu && characterCountNumber < limit" class="toolbar-menu">
                            <li v-for="operation in mathOptions" :key="operation.name" @click="insertMathOperation(operation)" class="list-item">
                                <img v-if="operation.icon !== null" :src="operation.icon" class="math-icon" :alt="operation.name">
                                <span v-else>{{ operation.value }}</span>
                            </li>
                        </ul>
                    </div>
                    

                </div>
                
                <div class="undo-redo">
                  <img src="/icons/undo.svg" class="toolbar-item" alt="icon"  @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()">
                  <img src="/icons/redo.svg" class="toolbar-item" alt="icon"  @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()">
                </div>
            </div>

            <editor-content :editor="editor" class="custom-text-editor"/>
            <!-- <div class="character-count" v-if="editor">
            {{ editor.storage.characterCount.characters() }}/{{ limit }} characters
            </div> -->
            <div class="character-count"  v-if="editor">
                {{ editor.storage.characterCount.words() }} words
                <br>
                <div class="character-count" v-if="characterCountNumber >= 100" :style="{ color: 'red'}">
                    {{ characterCountNumber }}/{{ limit }} HTML characters
                </div>
            </div>
        </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'

import Blockquote from '@tiptap/extension-blockquote'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import {common, createLowlight} from 'lowlight'

import { Mathematics } from '@tiptap-pro/extension-mathematics'
import 'katex/dist/katex.min.css'
import History from '@tiptap/extension-history'
import CharacterCount from '@tiptap/extension-character-count'

import { ref , onMounted, onUpdated } from 'vue';

export default {
    props: {
        showModal: Function,
        isForArticleShortDescription : Boolean,
        editedArticleShortDescription: String,
        
    },
    components: {
        EditorContent,
    },
    setup(props) {
       
        const lowlight = createLowlight(common);
        const limit = ref(1000);
        const characterCountNumber = ref(0);

       
        const showMathMenu = ref(false);
        
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
            Dropcursor,
            Bold,
            Italic,
            Strike,
            Underline,
            Link.configure({
                openOnClick: true,
            }),
            Blockquote,
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Mathematics,
            History.configure({
                depth: 10,
            }),
            CharacterCount.configure({
                limit: 1000,
            }),
            ],
            content: `
            <p>Введите текст ...</p>
            `,
        });

        // Функция, которая будет вызвана после монтирования элемента в DOM
        onMounted(() => {
            setContent();

            editor.on('update', ({  }) => {
                characterCountNumber.value = editor.getHTML().length; 
                if (characterCountNumber.value > limit.value) {
                    editor.chain().focus().undo().run();
                    props.showModal('/icons/risovach.ru.jpg', null);
                }
                if (characterCountNumber.value >= limit.value) {
                    editor.setOptions({ editable: false });
                   
                } else {
                    editor.setOptions({ editable: true });
                    
                }
            });
        });

        onUpdated(() => {
            if(!props.isForArticleShortDescription) {
                return;
            }
            if(props.editedArticleShortDescription) {
                return;
            }
            localStorage.setItem('savedShortDescription', editor.getHTML());
            
        });

        const setContent = () => {
            if(!props.isForArticleShortDescription) {
                editor.commands.setContent('<p>Ваш комментарий ...<p/>');
                return;
            }
            if(props.editedArticleShortDescription) {
                editor.commands.setContent(props.editedArticleShortDescription);
                return;
            }
            const savedShortDescription = localStorage.getItem('savedShortDescription');
            if (savedShortDescription) {
                editor.commands.setContent(savedShortDescription);
            }
        }
        const getHTMLContent = () => {
            return editor.getHTML();
        };

        const insertMathOperation = (operation) => {
            editor.commands.insertContent(operation.value);
        }

        const toggleMathMenu = () => {
            showMathMenu.value = !showMathMenu.value;
        };

      

        const setLink = () => {
            const previousUrl = editor.getAttributes('link').href
            const url = window.prompt('URL', previousUrl)

            if (url === null) {
            return
            }

            if (url === '') {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .unsetLink()
                .run()

            return
            }

            editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run()
        };

        const toggleBlockquote = () => {
            if (editor) {
                if(characterCountNumber.value >= limit.value) {
                    return;
                }
                editor.chain().focus().toggleBlockquote().run();
            }
        };

        const toggleCodeBlock = () => {
            if (editor) {
                if(characterCountNumber.value >= limit.value) {
                    return;
                }
                editor.chain().focus().toggleCodeBlock().run();
            }
        };

        const toggleBold = () => {
            if (editor) {
                if(characterCountNumber.value >= limit.value) {
                    return;
                }
                editor.chain().focus().toggleBold().run();
            }
        };

        const toggleItalic = () => {
            if (editor) {
                if(characterCountNumber.value >= limit.value) {
                    return;
                }
                editor.chain().focus().toggleItalic().run();
            }
        };

        const toggleStrike = () => {
            if (editor) {
                if(characterCountNumber.value >= limit.value) {
                    return;
                }
                editor.chain().focus().toggleStrike().run();
            }
        };

        const toggleUnderline = () => {
            if (editor) {
                if(characterCountNumber.value >= limit.value) {
                    return;
                }
                editor.chain().focus().toggleUnderline().run();
            }
        };

        const toggleLink = () => {
            if (editor) {
                if(characterCountNumber.value >= limit.value) {
                    return;
                }
                if (editor.isActive('link')) {
                    editor.chain().focus().unsetLink().run();
                } else {
                    setLink();
                }
            }
        };


        return {
            editor,
            toggleBold,
            toggleItalic,
            toggleStrike,
            toggleUnderline,
            toggleLink,
            showMathMenu,
            mathOptions,
            toggleMathMenu,
            insertMathOperation,
            limit,
            getHTMLContent,
            characterCountNumber, 
            toggleCodeBlock,
            toggleBlockquote, 
        };
    },

}

</script>

<style>
.text-editor {
    background-color: #ffffff;
    border-radius: 8px;
    margin: 20px 0;
}

.editor-toolbar {
    background-color: #f2f2f2;
    padding: 10px;
    border: 1px solid #ccc;
    
    display: flex;
    justify-content: space-between;
}

.toolbar-item {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 2px 2px;
    margin-right: 5px;
    cursor: pointer;
    display: inline;
    width: 30px;
    height: 30px;
}

.toolbar-item:hover {
  background-color: #eaeaea;
}

.custom-text-editor {
    border: #f2f2f2 solid;
    height: 30vh;
    max-height: 300px; 
    overflow-y: auto;
    line-height: 1;
    padding: 20px;
    
}

</style>