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
          <div class="category-text" :class="{ 'category-text-clicked': selectedCategory === 'ML' }" @click="() => { selectCategory('ML'); playSoundBasic('heavy_click_1'); }">
            <p><strong>ML</strong></p>
          </div>
          <div class="category-text" :class="{ 'category-text-clicked': selectedCategory === 'Physics' }" @click="() => { selectCategory('Physics'); playSoundBasic('heavy_click_1'); }">
            <p><strong>Physics</strong></p>
          </div>
          <div class="category-text" :class="{ 'category-text-clicked': selectedCategory === 'RT' }" @click="() => { selectCategory('RT'); playSoundBasic('heavy_click_1'); }">
            <p><strong>Real Time</strong></p>
          </div>
          <div class="category-text" :class="{ 'category-text-clicked': selectedCategory === 'Sec ops' }" @click="() => { selectCategory('Sec ops'); playSoundBasic('heavy_click_1'); }">
            <p><strong>Sec ops</strong></p>
          </div>
          <div class="category-text" :class="{ 'category-text-clicked': selectedCategory === 'Random' }" @click="() => { selectCategory('Random'); playSoundBasic('heavy_click_1'); }">
            <p><strong>Random</strong></p>
          </div>
        </div>

        <ul>
          <li v-for="post in searchResult" :key="post._path" @click="setCurrentProject(post)">

            <div class="projects-text"  @mouseenter="() => playSoundBasic('key_hover_1')" @click="playSoundBasic('key_press_1')">
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

const inputRef = ref(null);
const searchValue = ref("");
const searchResult = ref([]);
const currentProject = ref({});
const markdownContent = ref('');
const selectedCategory = ref("");
const renderedContent = computed(() => marked(markdownContent.value));

const audioContext = ref(null);
const audioBuffer = ref(null);

const loadSound = async (url) => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  audioContext.value.decodeAudioData(arrayBuffer, (buffer) => {
    audioBuffer.value = buffer;
    playSound();
  }, (error) => console.error('Error with decoding audio data:', error));
};

const playSound = () => {
  const source = audioContext.value.createBufferSource();
  source.buffer = audioBuffer.value;
  source.connect(audioContext.value.destination);
  source.loop = true;
  source.start(0);
};

//onMounted(async () => {
//  if (!audioContext.value) {
//    audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
//  }
//  await loadSound(new URL('@/assets/sounds/bg_loop.wav', import.meta.url).href);
//});

onUnmounted(() => {
  if (audioContext.value) {
    audioContext.value.close();
  }
});

const playSoundBasic = async (soundName) => {
  try {
    const module = await import(`@/assets/sounds/${soundName}.wav`);
    const audio = new Audio(module.default);
    audio.play();
  } catch (error) {
    console.error('Error playing sound:', error);
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
  await playSoundBasic('heavy_click_1');
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
onMounted(fetchAllProjects);

</script>

<style>
@import url("~/assets/css/index.css");
</style>
