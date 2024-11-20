<template>
    <a-layout class="site-layout-background">
        <aside-vue></aside-vue>
        <a-layout>
            <header-vue></header-vue>
            <main-vue></main-vue>
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import AsideVue from './aside/index.vue'
import HeaderVue from './header/index.vue'
import MainVue from './main/index.vue'



</script>
<style scoped>
.site-layout-background {
    height: 100vh;
}
</style>