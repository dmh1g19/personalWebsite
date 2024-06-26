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
          <div class="category-text" :class="{ 'category-text-clicked': selectedCategory === 'All' }" @click="handleAllClick">
            <p><strong>All</strong></p>
          </div>
          <div class="category-text" :class="{ 'category-text-clicked': selectedCategory === 'ML' }" @click="() => { selectCategory('ML'); SoundService.playSoundBasic('heavy_click_1', playAuxSounds); }">
            <p><strong>ML</strong></p>
          </div>
          <div class="category-text" :class="{ 'category-text-clicked': selectedCategory === 'Physics' }" @click="() => { selectCategory('Physics'); SoundService.playSoundBasic('heavy_click_1', playAuxSounds); }">
            <p><strong>Physics</strong></p>
          </div>
          <div class="category-text" :class="{ 'category-text-clicked': selectedCategory === 'RT' }" @click="() => { selectCategory('RT'); SoundService.playSoundBasic('heavy_click_1', playAuxSounds); }">
            <p><strong>Real Time</strong></p>
          </div>
          <div class="category-text" :class="{ 'category-text-clicked': selectedCategory === 'Sec ops' }" @click="() => { selectCategory('Sec ops'); SoundService.playSoundBasic('heavy_click_1', playAuxSounds); }">
            <p><strong>Sec ops</strong></p>
          </div>
          <div class="category-text" :class="{ 'category-text-clicked': selectedCategory === 'Random' }" @click="() => { selectCategory('Random'); SoundService.playSoundBasic('heavy_click_1', playAuxSounds); }">
            <p><strong>Random</strong></p>
          </div>
          <div class="category-text" @click="startAudio">
            <p><strong>{{ audioStarted ? 'Mute' : 'Un-mute' }}</strong></p>
          </div>
        </div>

        <ul>
          <li v-for="post in searchResult" :key="post._path" @click="setCurrentProject(post)">

            <div class="projects-text"  @mouseenter="() => SoundService.playSoundBasic('key_hover_1', playAuxSounds)" @click="SoundService.playSoundBasic('key_press_1', playAuxSounds)">
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
import { onMounted, onUnmounted } from 'vue';
import { ref, watch, computed } from 'vue';
import { marked } from 'marked';
import SoundService from '@/services/soundService';

const inputRef = ref(null);
const searchValue = ref("");
const searchResult = ref([]);
const currentProject = ref({});
const markdownContent = ref('');
const selectedCategory = ref("");
const audioStarted = ref(false);
const renderedContent = computed(() => marked(markdownContent.value));
let playAuxSounds = false

const startAudio = async () => {
  if (audioStarted.value) {
    SoundService.playSoundBasic('end', playAuxSounds);
    SoundService.stopAllSounds();
    SoundService.cleanup();
    audioStarted.value = false;
    playAuxSounds = false
  } else {
    audioStarted.value = true;
    playAuxSounds = true 
    SoundService.playSoundBasic('start_up', playAuxSounds);
    SoundService.playLoop();
  }
};

const focusInput = () => {
  inputRef.value.focus();
};

const setCurrentProject = async (project) => {
  currentProject.value = project;
  const slug = project._path.replace(/^\//, ''); // This removes the leading slash
  await fetchMarkdown(slug);
};

const selectCategory = async (category) => {
  selectedCategory.value = category; // Set the selected category
  searchResult.value = await queryContent("/")
    .where({ category: { $eq: category } })
    .only(["_path", "title", "description", "category"])
    .find();
};

const handleAllClick = async () => {
  await SoundService.playSoundBasic('heavy_click_1', playAuxSounds);
  await selectCategory('All');
  await fetchAllProjects();
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
onMounted(async () => {
  await fetchAllProjects();
});

</script>

<style>
@import url("~/assets/css/index.css");
</style>
