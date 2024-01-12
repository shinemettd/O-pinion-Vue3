<template>
    <div class="hello">
        <button v-if="!textVisible" @click="showHelloWorld" class="hello-world-button">click me 🙂</button>
        <p class="hello-world-text">{{ responseText }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            responseText: '',
            textVisible: false,
        };
    },
    methods: {
        async showHelloWorld() {
            try {
                const res = await fetch('http://194.152.37.7:8812/');
                if (res.ok) {
                    this.responseText = await res.text();
                    this.textVisible = true;
                }
            } catch (error) {
                console.error(error);
            }
        },
    },
};
</script>

<style scoped>
    button {
        width: 300px;
        height: 150px;
        font-size: 50px;
    }
    p {
        margin-top: 115px;
        font-size: 50px;
    }
</style>
