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

        <div class="categories-container">
          <div class="category-text" @click="fetchAllProjects">
            <p><strong>All</strong></p>
          </div>
          <div class="category-text" @click="selectCategory('ML')">
            <p><strong>ML</strong></p>
          </div>
          <div class="category-text" @click="selectCategory('Physics')">
            <p><strong>Physics</strong></p>
          </div>
          <div class="category-text" @click="selectCategory('RT')">
            <p><strong>Real Time</strong></p>
          </div>
          <div class="category-text" @click="selectCategory('Sec ops')">
            <p><strong>Sec ops</strong></p>
          </div>
          <div class="category-text" @click="selectCategory('Random')">
            <p><strong>Random</strong></p>
          </div>
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
const markdownContent = ref(''); 
const renderedContent = computed(() => marked(markdownContent.value));

const focusInput = () => {
  inputRef.value.focus();
};

const setCurrentProject = async (project) => {
  currentProject.value = project;
  const slug = project._path.replace(/^\//, ''); // This removes the leading slash
  await fetchMarkdown(slug);
};

const selectCategory = async (category) => {
  searchResult.value = await queryContent("/")
    .where({ category: { $eq: category } })
    .only(["_path", "title", "description", "category"])
    .find();
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

//async function fetchAllProjects() {
//  try {
//    const allProjects = await queryContent("/")
//      .only(["_path", "title", "description", "category"])
//      .find();
//    searchResult.value = allProjects;
//  } catch (error) {
//    console.error('Error fetching all projects:', error);
//    searchResult.value = [];
//  }
//}

const fetchAllProjects = async () => {
  try {
    const allProjects = await queryContent("/")
      .only(["_path", "title", "description", "category"])
      .find();

    searchResult.value = allProjects;

    // Automatically set "About me" as the current project
    const aboutMeProject = allProjects.find(project => project.title === "About me");
    if (aboutMeProject) {
      setCurrentProject(aboutMeProject);
    }
  } catch (error) {
    console.error('Error fetching all projects:', error);
    searchResult.value = [];
  }
};

// Call fetchAllProjects when the component is first loaded
onMounted(fetchAllProjects);

</script>

<style>
@import url("~/assets/css/index.css");
</style>
