<template>
  <div class="library-container">
    <component
      :is="uploadComponent"
      v-if="showUploadPage"
      @uploaded="handleItemUploaded"
      @cancel="showUploadPage = false"
    />
    <div v-else class="two-column-layout">
      <!-- Left Column: Item List -->
      <div class="left-column">
        <div class="header">
          <h1>{{ title }}</h1>
          <button class="upload-btn" @click="showUploadPage = true">
            Upload {{ itemType }}
          </button>
        </div>
        <ErrorDisplay :error="error" class="mb-4" @close="clearError" />
        <div v-if="isLoading" class="loading-text">
          Loading {{ itemType }}s...
        </div>
        <div v-if="!isLoading && items.length === 0" class="no-items-text">
          No {{ itemType }}s found.
        </div>
        <ul v-if="items.length > 0" class="item-list">
          <slot
            name="list-item"
            :items="items"
            :selected-item="selectedItem"
            :select-item="selectItem"
            :delete-item="deleteItem"
          ></slot>
        </ul>
      </div>

      <!-- Right Column: Viewer and Code Snippet -->
      <div class="right-column">
        <div v-if="selectedItem" class="viewer-section">
          <div class="viewer-container">
            <component :is="viewerComponent" v-bind="viewerProps" />
          </div>
          <div class="code-snippet-container">
            <div class="code-snippet-header">
              <h3>Code Example</h3>
              <div class="language-selector">
                <button
                  :class="{ active: selectedLanguage === 'js' }"
                  @click="selectedLanguage = 'js'"
                >
                  CesiumJS
                </button>
                <button
                  :class="{ active: selectedLanguage === 'unity' }"
                  @click="selectedLanguage = 'unity'"
                >
                  Cesium Unity
                </button>
              </div>
            </div>
            <pre><code>{{ currentCodeSnippet }}</code></pre>
          </div>
        </div>
        <div v-else class="placeholder">
          <p>
            Select an {{ itemType }} from the list to visualize it and get the
            integration code.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type Component } from 'vue';
import {
  fetchItems as apiFetchItems,
  deleteItem as apiDeleteItem,
  type Asset,
} from '@/lib/api';
import { useErrorHandler } from '@/composables/useErrorHandler';
import ErrorDisplay from '@/components/ui/ErrorDisplay.vue';

interface LibraryItem extends Asset {
  [key: string]: any;
}

interface CodeSnippets {
  [language: string]: (item: LibraryItem) => string;
}

interface Props {
  title: string;
  itemType: string;
  fetchUrl: string;
  deleteUrlBase: string;
  viewerComponent: Component;
  uploadComponent: Component;
  codeSnippets: CodeSnippets;
  transformData?: (data: any[]) => LibraryItem[];
  deleteItem?: (item: LibraryItem) => Promise<void>;
}

const props = defineProps<Props>();

// Composables
const { error, isLoading, handleError, clearError, withLoading } =
  useErrorHandler();

// State
const items = ref<LibraryItem[]>([]);
const selectedItem = ref<LibraryItem | null>(null);
const showUploadPage = ref(false);
const selectedLanguage = ref<'js' | 'unity'>('js');

const viewerProps = computed(() => {
  if (!selectedItem.value) return {};
  if (props.itemType === 'asset') return { assetUrl: selectedItem.value.url };
  if (props.itemType === 'map') return { mapLayer: selectedItem.value };
  if (props.itemType === 'tileset')
    return { tilesetUrl: selectedItem.value.url };
  return {};
});

const currentCodeSnippet = computed(() => {
  if (!selectedItem.value) return '';
  const snippetGenerator = props.codeSnippets[selectedLanguage.value];
  return snippetGenerator ? snippetGenerator(selectedItem.value) : '';
});

const fetchItems = async () => {
  const result = await withLoading(async () => {
    const response = await apiFetchItems(props.fetchUrl);
    const data = response.data;

    if (Array.isArray(data)) {
      items.value = props.transformData ? props.transformData(data) : data;
      if (items.value.length > 0) {
        selectedItem.value = items.value[0];
      }
    } else {
      items.value = [];
    }

    return data;
  });

  if (!result) {
    items.value = [];
  }
};

const handleItemUploaded = () => {
  showUploadPage.value = false;
  fetchItems();
};

const deleteItem = async (item: LibraryItem) => {
  if (props.deleteItem) {
    const result = await withLoading(() => props.deleteItem!(item));
    if (result !== null) {
      await fetchItems(); // Refetch items after custom delete
    }
    return;
  }

  const result = await withLoading(() =>
    apiDeleteItem(props.deleteUrlBase, item)
  );
  if (result !== null) {
    items.value = items.value.filter(i => i.url !== item.url);
    if (selectedItem.value && selectedItem.value.url === item.url) {
      selectedItem.value = items.value.length > 0 ? items.value[0] : null;
    }
  }
};

const selectItem = (item: LibraryItem) => {
  selectedItem.value = item;
  clearError();
};

// Lifecycle
onMounted(fetchItems);
</script>

<style scoped>
.library-container {
  height: 100vh;
  display: flex;
}
.two-column-layout {
  display: flex;
  width: 100%;
}
.left-column {
  width: 40%;
  padding: 20px;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  background-color: #f9f9f9;
}
.right-column {
  width: 60%;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
h1 {
  color: #333;
}
.upload-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}
.upload-btn:hover {
  background-color: #45a049;
}
.item-list {
  list-style: none;
  padding: 0;
}
.viewer-section {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.viewer-container {
  flex-grow: 1;
  background-color: #e0e0e0;
  margin-bottom: 20px;
}
.code-snippet-container {
  flex-shrink: 0;
}
.code-snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.language-selector button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #f0f0f0;
}
.language-selector button.active {
  background-color: #ccc;
  font-weight: bold;
}
pre {
  background-color: #2d2d2d;
  color: #f1f1f1;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
}
.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
}
.error {
  color: red;
}
.loading-text,
.no-items-text {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
