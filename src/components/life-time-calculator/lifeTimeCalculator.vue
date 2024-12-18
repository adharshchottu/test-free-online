<template>
  <div class="max-w-2xl mx-auto pt-16 md:pt-16 lg:pt-24">
    <div class="bg-bgDark3 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 class="text-2xl mb-4 text-center text-white">Life Time Calculator</h1>
      <div class="mb-4" v-if="!isShared">
        <label class="block text-white text-sm font-bold mb-2"
          >Enter your Date of Birth:</label
        >
        <input
          type="datetime-local"
          v-model="birthDate"
          class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          @input="updateCountdown"
          :min="minDate"
          :max="maxDate"
        />
      </div>

      <h2 class="text-center text-lg text-white mt-8 md:mt-16 mb-4">
        {{
          !isShared
            ? `wow ${name ? name : ""}! You have lived for`
            : `${name} has lived for`
        }}
      </h2>
      <div
        class="grid grid-flow-row md:grid-flow-col gap-6 text-center auto-cols-max justify-center text-white"
      >
        <div class="flex flex-col">
          <span class="countdown font-mono text-6xl">{{ days }}</span> days
        </div>
        <div class="flex flex-col">
          <span class="countdown font-mono text-6xl">{{ hours }}</span> hours
        </div>
        <div class="flex flex-col">
          <span class="countdown font-mono text-6xl">{{ minutes }}</span> min
        </div>
        <div class="flex flex-col">
          <span class="countdown font-mono text-6xl">{{ seconds }}</span> sec
        </div>
      </div>

      <div class="mt-8 text-center">
        <button
          v-if="isShared"
          @click="reset"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Check Yours
        </button>
        <button
          v-else
          @click="open = true"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Share with Friends
        </button>
      </div>

      <TransitionRoot as="template" :show="open">
        <Dialog class="relative z-10" @close="open = false">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div
              class="fixed inset-0 bg-bgDarkTransparentDarker transition-opacity"
            ></div>
          </TransitionChild>

          <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div
              class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
            >
              <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leave-from="opacity-100 translate-y-0 sm:scale-100"
                leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel
                  class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                >
                  <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div
                        class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10"
                      >
                        <SparklesIcon
                          class="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div
                        class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                      >
                        <DialogTitle
                          as="h3"
                          class="text-base font-semibold text-gray-900"
                          >Enter your name to share with friends!</DialogTitle
                        >
                        <div class="my-3">
                          <input
                            type="text"
                            v-model="name"
                            placeholder="eg. Popey, rockstar, etc."
                            class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            @input="validateName"
                            @change="validateName"
                          />
                          <label
                            class="block text-gray-500 text-xs font-bold my-2"
                            >A short quirky name - no space please 😊</label
                          >
                          <p
                            class="text-red-500 text-sm"
                            v-if="name && name.length > 10"
                          >
                            Name too long!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
                  >
                    <button
                      type="button"
                      class="inline-flex w-full justify-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                      @click="share"
                      :disabled="
                        !name || name.trim().length === 0 || name.length > 10
                      "
                    >
                      Share
                    </button>
                    <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      @click="open = false"
                      ref="cancelButtonRef"
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { SparklesIcon } from "@heroicons/vue/24/outline";
import CryptoJS from "crypto-js";

const open = ref(false);

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const birthDate = ref(getCurrentDateTime());
const name = ref(null);
const lifetime = ref("");
const isShared = ref(false);
let countdownInterval;

const currentYear = new Date().getFullYear();
const minYear = 1900;

const minDate = ref(`${minYear}-01-01T00:00`);
const maxDate = ref(`${currentYear}-12-31T23:59`);

var key = CryptoJS.enc.Utf8.parse("93wj660t8fok9jws");
var iv = CryptoJS.enc.Utf8.parse("r0yy7e67p49ee4d7");

const encrypt = (plainText) => {
  return CryptoJS.AES.encrypt(plainText, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  }).ciphertext.toString(CryptoJS.enc.Base64url); // Use Base64url encoding
};

const decrypt = (encryptedText) => {
  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64url.parse(encryptedText), // Use Base64url decoding
  });
  return CryptoJS.AES.decrypt(cipherParams, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  }).toString(CryptoJS.enc.Utf8);
};

// Function to calculate hash
const calculateHash = () => {
  const data = JSON.stringify({
    username: name.value,
    userBirthDate: birthDate.value,
  });
  const hash = encrypt(data); // Encode as Base64url
  return hash;
};

// generate share url
const generateShareUrl = () => {
  return `https://www.test-free.online/life-time-calculator?gente=${calculateHash()}`;
};

const updateCountdown = () => {
  clearInterval(countdownInterval);

  if (birthDate.value) {
    const birthDateTime = new Date(birthDate.value);

    countdownInterval = setInterval(() => {
      const now = new Date();
      lifetime.value = now.getTime() - birthDateTime.getTime();

      if (lifetime.value <= 0) {
        clearInterval(countdownInterval);
        lifetime.value = 0;
      }
    }, 1000);
  } else {
    lifetime.value = null;
  }
};

const days = computed(() =>
  lifetime.value ? Math.floor(lifetime.value / (1000 * 60 * 60 * 24)) : 0
);
const hours = computed(() =>
  lifetime.value
    ? Math.floor((lifetime.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    : 0
);
const minutes = computed(() =>
  lifetime.value
    ? Math.floor((lifetime.value % (1000 * 60 * 60)) / (1000 * 60))
    : 0
);
const seconds = computed(() =>
  lifetime.value ? Math.floor((lifetime.value % (1000 * 60)) / 1000) : 0
);

onMounted(() => {
  if (birthDate.value) {
    updateCountdown();
  }
});

onUnmounted(() => {
  clearInterval(countdownInterval);
});

// validateName
const validateName = () => {
  if (name.value) {
    // Remove leading or trailing spaces
    name.value = name.value.trim();

    // Limit the name to 10 characters
    if (name.value.length > 10) {
      name.value = name.value.slice(0, 10);
    }
  }
};

// share with social media
const share = async () => {
  open.value = false;

  const shareUrl = generateShareUrl();

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Life Time Calculator",
        text: `Checkout how long ${name.value} have lived!`,
        url: shareUrl,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      if (error.name !== "AbortError") {
        alert("Error sharing. Please try again later.");
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } catch (clipboardError) {
      console.error("Error copying to clipboard:", clipboardError);
      alert(
        "Sharing is not supported on this browser. Please copy the link manually:\n" +
          shareUrl
      );
    }
  }
};

// on mount check the gente url param if found check the hash and try decode it. if got value set it
onMounted(() => {
  // Check for 'gente' query parameter on component mount
  const urlParams = new URLSearchParams(window.location.search);
  const gente = urlParams.get("gente");

  if (gente) {
    try {
      const decoded = decrypt(gente);

      const { username, userBirthDate } = JSON.parse(decoded);
      name.value = username;
      birthDate.value = userBirthDate;
      isShared.value = true;
      updateCountdown();
    } catch (error) {
      console.error("Error decoding hash:", error);
    }
  }
});

// reset name, birthdata and shared
const reset = () => {
  name.value = null;
  birthDate.value = getCurrentDateTime();
  isShared.value = false;
  updateCountdown();
};
</script>
