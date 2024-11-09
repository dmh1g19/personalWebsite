<!-- File: pages/mobile/[slug].vue -->

<template>
  <div class="text-with-scanlines blog-page">
    <div class="center-container">
      <h1>{{ blogEntry.title }}</h1>
      <div v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';

const route = useRoute();
const blogEntry = ref({ title: '', content: '' });
const renderedContent = computed(() => marked(blogEntry.value.content));

async function fetchBlogEntry(slug) {
  try {
    const response = await fetch(`/pub_content/${slug}`);
    let text = await response.text();
    
    text = text.replace(/^---[\s\S]*?---\s*/, ''); // Remove front matter (metadata between "---" markers)
    
    blogEntry.value = {
      title: slug.replace(/-/g, ' '),
      content: text,
    };
  } catch (error) {
    console.error('Error loading blog entry:', error);
    blogEntry.value.content = 'Error loading content. Please try again later.';
  }
}


onMounted(() => {
  const slug = route.params.slug; //gets the markdown filename only with the .md extension
  fetchBlogEntry(slug);
});
</script>

<style>
@import url("~/assets/css/mobile.css");
</style>
