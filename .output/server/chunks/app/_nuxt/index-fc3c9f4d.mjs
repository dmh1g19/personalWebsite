import { q as queryContent } from './query-fded2491.mjs';
import { ref, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { marked } from 'marked';
import '../server.mjs';
import 'node:http';
import 'node:https';
import '../../nitro/node-server.mjs';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'unified';
import 'mdast-util-to-string';
import 'micromark';
import 'unist-util-stringify-position';
import 'micromark-util-character';
import 'micromark-util-chunked';
import 'micromark-util-resolve-all';
import 'micromark-util-sanitize-uri';
import 'slugify';
import 'remark-parse';
import 'remark-rehype';
import 'remark-mdc';
import 'hast-util-to-string';
import 'github-slugger';
import 'detab';
import 'remark-emoji';
import 'remark-gfm';
import 'rehype-external-links';
import 'rehype-sort-attribute-values';
import 'rehype-sort-attributes';
import 'rehype-raw';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import './preview-4c3c1787.mjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const searchValue = ref("");
    const searchResult = ref([]);
    const currentProject = ref({});
    const markdownContent = ref("");
    const selectedCategory = ref("");
    const audioStarted = ref(false);
    const renderedContent = computed(() => marked(markdownContent.value));
    async function searchForContent() {
      searchResult.value = await queryContent("/").where({
        $or: [
          { title: { $icontains: searchValue.value } },
          { description: { $icontains: searchValue.value } }
        ]
      }).only(["_path", "title", "description"]).find();
    }
    watch(searchValue, searchForContent);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-with-scanlines" }, _attrs))}><div class="center-container"><h1>Random Projects</h1><div class="split-screen"><div class="left-panel"><p class="larger-text">Search for a project below:</p><div class="search-container"><span class="blinking-cursor">&gt;</span><div class="search-display">${ssrInterpolate(searchValue.value)}<span class="blinking-pipe">|</span></div><input class="search-input" type="text"${ssrRenderAttr("value", searchValue.value)}></div><div class="categories-container"><div class="${ssrRenderClass([{ "category-text-clicked": selectedCategory.value === "All" }, "category-text"])}"><p><strong>All</strong></p></div><div class="${ssrRenderClass([{ "category-text-clicked": selectedCategory.value === "ML" }, "category-text"])}"><p><strong>ML</strong></p></div><div class="${ssrRenderClass([{ "category-text-clicked": selectedCategory.value === "Physics" }, "category-text"])}"><p><strong>Physics</strong></p></div><div class="${ssrRenderClass([{ "category-text-clicked": selectedCategory.value === "RT" }, "category-text"])}"><p><strong>Real Time</strong></p></div><div class="${ssrRenderClass([{ "category-text-clicked": selectedCategory.value === "Sec ops" }, "category-text"])}"><p><strong>Sec ops</strong></p></div><div class="${ssrRenderClass([{ "category-text-clicked": selectedCategory.value === "Random" }, "category-text"])}"><p><strong>Random</strong></p></div><div class="category-text"><p><strong>${ssrInterpolate(audioStarted.value ? "Mute" : "Un-mute")}</strong></p></div></div><ul><!--[-->`);
      ssrRenderList(searchResult.value, (post) => {
        _push(`<li><div class="projects-text"><p><strong>${ssrInterpolate(post.title)}</strong></p><p>${ssrInterpolate(post.description)}</p></div></li>`);
      });
      _push(`<!--]--></ul></div><div class="right-panel"><h2>${ssrInterpolate(currentProject.value.title)}</h2><div>${renderedContent.value}</div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-fc3c9f4d.mjs.map
