<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

// 异步加载富文本编辑器组件
const RichTextEditor = defineAsyncComponent(() => import('./components/RichTextEditor.vue'));
</script>

<template>
  <div>
    <router-view />
  </div>
</template>

<style scoped>
</style>
