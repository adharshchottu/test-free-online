<template>
  <section class="pt-24 lg:pt-32 pb-16 px-4">
    <div class="w-full max-w-4xl mx-auto font-Inter">
      <header class="mb-8">
        <h1 class="text-4xl md:text-5xl font-bold text-primaryText mb-3">Suggestion Box</h1>
        <p class="text-secondaryText leading-relaxed">
          Want a new tool, a feature, or a fix? Tell us. Every suggestion is public, so check the list below
          before posting. No signup needed.
        </p>
      </header>

      <!-- New suggestion -->
      <form
        @submit.prevent="submitSuggestion"
        class="rounded-2xl border border-mainBorder bg-bgDark2 p-6 mb-10 shadow-lg space-y-4"
      >
        <div>
          <div class="flex items-baseline justify-between mb-2">
            <label for="suggestion-name" class="text-primaryText font-semibold">Name</label>
            <span class="text-xs" :class="name.length > MAX_NAME ? 'text-red-400' : 'text-secondaryText'">
              {{ charCount(name) }}/{{ MAX_NAME }}
            </span>
          </div>
          <input
            id="suggestion-name"
            v-model="name"
            type="text"
            :maxlength="MAX_NAME"
            placeholder="Your name, or anything you like"
            class="w-full bg-bgDark3 text-primaryText placeholder-secondaryText rounded-lg px-4 py-3 outline-none border border-mainBorder focus:border-primaryColor transition-colors"
          />
        </div>

        <div>
          <div class="flex items-baseline justify-between mb-2">
            <label for="suggestion-description" class="text-primaryText font-semibold">Suggestion</label>
            <span class="text-xs" :class="charCount(description) > MAX_DESCRIPTION ? 'text-red-400' : 'text-secondaryText'">
              {{ charCount(description) }}/{{ MAX_DESCRIPTION }}
            </span>
          </div>
          <textarea
            id="suggestion-description"
            v-model="description"
            rows="5"
            :maxlength="MAX_DESCRIPTION"
            placeholder="Describe the tool or feature you'd like to see, and why it would help."
            class="w-full bg-bgDark3 text-primaryText placeholder-secondaryText rounded-lg px-4 py-3 outline-none border border-mainBorder focus:border-primaryColor transition-colors resize-y"
          ></textarea>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            :disabled="!canSubmit"
            class="bg-primaryColor hover:bg-secondaryColor text-primaryText font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-primaryColor"
          >
            {{ isSubmitting ? 'Sending...' : 'Submit suggestion' }}
          </button>
          <p v-if="successMessage" class="text-sm text-green-400">{{ successMessage }}</p>
          <p v-if="formError" class="text-sm text-red-400">{{ formError }}</p>
        </div>
      </form>

      <!-- Suggestion list -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-primaryText">
          Suggestions <span class="text-secondaryText font-normal text-lg">({{ suggestions.length }})</span>
        </h2>
        <span v-if="isAdmin" class="text-xs text-red-400 border border-red-600 rounded-full px-3 py-1">Admin mode</span>
      </div>

      <p v-if="listError" class="text-sm text-red-400 mb-4">{{ listError }}</p>

      <div v-if="isLoading" class="text-secondaryText text-sm py-12 text-center">Loading suggestions...</div>
      <div
        v-else-if="suggestions.length === 0"
        class="text-secondaryText text-sm py-12 text-center rounded-2xl border border-dashed border-mainBorder"
      >
        No suggestions yet. Be the first!
      </div>

      <ul v-else class="space-y-4">
        <li
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          class="rounded-2xl border border-mainBorder bg-bgDark2 p-5"
        >
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-secondaryText mb-3">
            <span class="text-secondaryColor font-semibold text-sm break-all">{{ suggestion.name }}</span>
            <span>•</span>
            <time :datetime="new Date(suggestion.timestamp * 1000).toISOString()">
              {{ formatDate(suggestion.timestamp) }}
            </time>
            <template v-if="isAdmin">
              <span>•</span>
              <button
                type="button"
                :disabled="deletingId === suggestion.id"
                class="text-red-400 hover:text-red-300 font-medium disabled:opacity-50"
                @click="deleteSuggestion(suggestion)"
              >
                {{ deletingId === suggestion.id ? 'Deleting...' : 'Delete' }}
              </button>
            </template>
          </div>
          <p class="text-primaryText whitespace-pre-wrap break-words leading-relaxed">{{ suggestion.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const API_BASE = 'https://users-count.tools.typinks.com/api/suggestions';
// Keep in sync with maxSuggestionNameLength / maxSuggestionDescriptionLength in users-count-server
const MAX_NAME = 120;
const MAX_DESCRIPTION = 5000;

const suggestions = ref([]);
const name = ref('');
const description = ref('');
const isLoading = ref(true);
const isSubmitting = ref(false);
const formError = ref('');
const successMessage = ref('');
const listError = ref('');
// Admin controls only show the button; the API checks the passcode before deleting anything
const isAdmin = ref(false);
const deletingId = ref('');
let pollInterval = null;

// Count characters the way the server does (code points), so emoji count as one
const charCount = (text) => [...text].length;

const canSubmit = computed(
  () =>
    !isSubmitting.value &&
    name.value.trim() !== '' &&
    description.value.trim() !== '' &&
    charCount(name.value.trim()) <= MAX_NAME &&
    charCount(description.value.trim()) <= MAX_DESCRIPTION,
);

const readError = async (response, fallback) => {
  const result = await response.json().catch(() => null);
  return result?.data || fallback;
};

const fetchSuggestions = async () => {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error(await readError(response, 'Unable to load suggestions'));
    const result = await response.json();
    suggestions.value = Array.isArray(result) ? result : [];
    listError.value = '';
  } catch (error) {
    console.error('Error loading suggestions:', error);
    listError.value = 'Unable to load suggestions right now.';
  } finally {
    isLoading.value = false;
  }
};

const submitSuggestion = async () => {
  if (!canSubmit.value) return;

  isSubmitting.value = true;
  formError.value = '';
  successMessage.value = '';
  try {
    const response = await fetch(`${API_BASE}/new`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.value.trim(), description: description.value.trim() }),
    });
    if (!response.ok) throw new Error(await readError(response, 'Unable to send suggestion'));

    description.value = '';
    successMessage.value = 'Thanks! Your suggestion is posted.';
    await fetchSuggestions();
  } catch (error) {
    formError.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

const deleteSuggestion = async (suggestion) => {
  const passcode = window.prompt('Enter the admin passcode to delete this suggestion:');
  if (!passcode) return;

  deletingId.value = suggestion.id;
  listError.value = '';
  try {
    const response = await fetch(`${API_BASE}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: suggestion.id, passcode }),
    });
    if (!response.ok) throw new Error(await readError(response, 'Unable to delete suggestion'));
    await fetchSuggestions();
  } catch (error) {
    listError.value = error.message;
  } finally {
    deletingId.value = '';
  }
};

const formatDate = (unixSecs) =>
  new Date(unixSecs * 1000).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

onMounted(() => {
  isAdmin.value = new URLSearchParams(window.location.search).get('repaso') === 'true';
  fetchSuggestions();
  pollInterval = setInterval(fetchSuggestions, 30000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>
