<template>
<div class="text-with-scanlines">
  <div class="center-container">
    <h1>Random Projects</h1>
    <div class="split-screen">
      <div class="left-panel">
        <p class="larger-text">Search for a project below:</p>
        <div class="search-container" @click="focusInput">
          <span class="blinking-cursor">></span>
          <div class="search-display">
            {{ searchValue }}<span class="blinking-pipe">|</span>
          </div>
          <input class="search-input" ref="inputRef" type="text" v-model="searchValue">
        </div>
        <ul>
          <li v-for="post in searchResult" :key="post._path" @click="setCurrentProject(post)">
            <div class="projects-text">
              <p><strong>{{ post.title }}</strong></p>
              <p>{{ post.description }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="right-panel">
        <h2>{{ currentProject.title }}</h2>
        <div v-html="renderedContent"></div> 
      </div>
    </div>
  </div>
</div>
</template>

<script setup>

import { ref, watch, computed } from 'vue';
import { marked } from 'marked';

const inputRef = ref(null);
const searchValue = ref("");
const searchResult = ref([]);
const currentProject = ref({});

const focusInput = () => {
  inputRef.value.focus();
};

const markdownContent = ref(''); 
const renderedContent = computed(() => marked(markdownContent.value));

const setCurrentProject = async (project) => {
  currentProject.value = project;
  const slug = project._path.replace(/^\//, ''); // This removes the leading slash
  await fetchMarkdown(slug);
};

async function fetchMarkdown(path) {
  try {
    const response = await fetch(path);
    const text = await response.text();
    markdownContent.value = text;
  } catch (error) {
    console.error('Error fetching markdown:', error);
    markdownContent.value = ''; // Handle error, maybe set a default message
  }
}

async function searchForContent() {
  searchResult.value = await queryContent("/")
    .where({
      $or: [
        { title: { $icontains: searchValue.value } },
        { description: { $icontains: searchValue.value } },
      ]
    })
    .only(["_path", "title", "description"])
    .find();
}

watch(searchValue, searchForContent);

// Function to fetch all projects
async function fetchAllProjects() {
  try {
    const allProjects = await queryContent("/") // Adjust the path as needed
      .only(["_path", "title", "description"])
      .find();

    searchResult.value = allProjects;
  } catch (error) {
    console.error('Error fetching all projects:', error);
    searchResult.value = []; // Handle error, maybe set a default message
  }
}

// Call fetchAllProjects when the component is first loaded
onMounted(fetchAllProjects);

</script>

<style>
@import url("~/assets/css/index.css");
</style>
