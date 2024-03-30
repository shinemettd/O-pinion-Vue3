<template>
    <div class="editor">
        <editor-content :editor="contentEditor" />
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
import Youtube from '@tiptap/extension-youtube'

import { ref , onMounted, onUpdated } from 'vue';
import axios from "axios";

export default {
    props: ['content'],
    components: {
        EditorContent,
    },
    setup(props) {
       
        const lowlight = createLowlight(common);
        const contentEditor = new Editor({
            editable: false,
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
                CharacterCount,
                Youtube.configure({
                controls: false,
            }),
            ],
            content: props.content,
        });
        return {
            contentEditor,
        };
    }
}
</script>

