<template>
  <section class="pt-16 md:pt-16 lg:pt-24">
    <div class="flex flex-col h-[65dvh] min-h-[420px] md:h-[600px] w-full max-w-4xl mx-auto rounded-lg border border-mainBorder bg-bgDark1 font-Inter overflow-hidden shadow-xl mt-4 mb-8">
      <div class="flex items-center justify-between px-6 py-4 bg-bgDark2 border-b border-mainBorder">
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full bg-primaryColor animate-pulse"></div>
          <h1 class="text-primaryText font-semibold tracking-wide">Image Chat</h1>
        </div>
        <div class="text-xs text-secondaryText bg-bgDark3 px-3 py-1 rounded-full border border-mainBorderDarker">
          yo soy <span class="text-primaryColor font-medium">{{ currentUser }}</span>
        </div>
      </div>

      <div ref="chatContainer" class="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 bg-bgDark1 custom-scrollbar">
        <div v-if="images.length === 0" class="flex items-center justify-center h-full text-secondaryText text-sm italic">
          Aún no hay imágenes. ¡Comparte la primera!
        </div>

        <article
          v-for="(image, index) in images"
          :key="`${image.timestamp}-${index}`"
          class="flex flex-col max-w-[85%] space-y-1"
          :class="image.user === currentUser ? 'ml-auto items-end' : 'mr-auto items-start'"
        >
          <div class="flex items-center space-x-2 text-xs text-secondaryText px-1">
            <span :class="image.user === currentUser ? 'text-secondaryColor font-medium' : ''">{{ image.user }}</span>
            <span>•</span>
            <span>{{ formatTime(image.timestamp) }}</span>
          </div>
          <a :href="image.image_url" target="_blank" rel="noopener noreferrer" class="block">
            <img
              :src="image.image_url"
              :alt="`Image shared by ${image.user}`"
              class="max-h-72 max-w-full rounded-lg border border-mainBorderDarker object-contain bg-bgDark3"
              loading="lazy"
            />
          </a>
        </article>
      </div>

      <form @submit.prevent="sendImage" class="p-4 bg-bgDark2 border-t border-mainBorder flex items-center gap-3">
        <label class="flex-1 min-w-0 cursor-pointer">
          <span class="sr-only">Choose an image</span>
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            :disabled="isSending"
            class="block w-full text-sm text-secondaryText file:mr-3 file:rounded-md file:border-0 file:bg-bgDark3 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primaryText hover:file:bg-bgDark3Hover disabled:opacity-50"
            @change="selectImage"
          />
        </label>
        <button
          type="submit"
          :disabled="isSending || !selectedImage"
          class="shrink-0 bg-primaryColor hover:bg-secondaryColor text-primaryText font-medium text-sm px-5 py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:hover:bg-primaryColor"
        >
          {{ isSending ? 'Uploading...' : 'Send' }}
        </button>
      </form>
      <p v-if="errorMessage" class="px-4 pb-3 bg-bgDark2 text-sm text-red-400">{{ errorMessage }}</p>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

const IMAGE_MESSAGES_API = 'https://users-count.tools.typinks.com/api/image-chat/messages';
const IMAGE_MESSAGE_API = 'https://users-count.tools.typinks.com/api/image-chat/message';
const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_USERS = [
  'adharsh', 'benny', 'ouseph', 'stephen', 'martin', 'santhosh', 'reju',
  'job', 'baby', 'abin', 'tinil', 'dolly', 'jojo', 'dominic', 'jobin',
  'scott', 'mati', 'lucas', 'reynolds', 'edison', 'shibu', 'ruban',
  'peter', 'sebastian', 'lalan', 'sansilo', 'tomy', 'joy',
];

const images = ref([]);
const selectedImage = ref(null);
const currentUser = ref('');
const isSending = ref(false);
const errorMessage = ref('');
const chatContainer = ref(null);
const fileInput = ref(null);
let pollInterval = null;

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const fetchImages = async () => {
  try {
    const response = await fetch(IMAGE_MESSAGES_API);
    if (!response.ok) throw new Error('Failed to load images');

    const result = await response.json();
    const latestImages = Array.isArray(result) ? [...result].reverse() : [];
    if (JSON.stringify(images.value) !== JSON.stringify(latestImages)) {
      images.value = latestImages;
      scrollToBottom();
    }
  } catch (error) {
    console.error('Error loading image history:', error);
  }
};

const selectImage = (event) => {
  errorMessage.value = '';
  const [file] = event.target.files || [];
  if (!file) {
    selectedImage.value = null;
    return;
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    errorMessage.value = 'Choose a JPEG, PNG, GIF, or WebP image.';
    event.target.value = '';
    return;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    errorMessage.value = 'Images must be 15 MB or smaller.';
    event.target.value = '';
    return;
  }

  selectedImage.value = file;
};

const sendImage = async () => {
  if (!selectedImage.value || isSending.value) return;

  isSending.value = true;
  errorMessage.value = '';
  const payload = new FormData();
  payload.append('user', currentUser.value);
  payload.append('image', selectedImage.value);

  try {
    const response = await fetch(IMAGE_MESSAGE_API, { method: 'POST', body: payload });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.data || 'Unable to upload image');
    }

    selectedImage.value = null;
    fileInput.value.value = '';
    await fetchImages();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isSending.value = false;
  }
};

const formatTime = (unixSecs) => new Date(unixSecs * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

onMounted(() => {
  currentUser.value = ALLOWED_USERS[Math.floor(Math.random() * ALLOWED_USERS.length)];
  fetchImages();
  pollInterval = setInterval(fetchImages, 10000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgb(31, 32, 35); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgb(48, 49, 54); border-radius: 3px; }
</style>