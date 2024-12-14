<template>
  <div class="max-w-2xl mx-auto pt-16 md:pt-16 lg:pt-24">
    <div class="bg-bgDark3 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 class="text-2xl mb-4 text-center text-white">
        Life Time Calculator
      </h1>
      <div class="mb-4">
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

      <h2 class="text-center text-lg text-white mt-16 mb-4">Wow! You have lived for</h2>
      <div class="grid grid-flow-row md:grid-flow-col gap-6 text-center auto-cols-max justify-center text-white">
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

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";

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
const lifetime = ref(null);
let countdownInterval;

const currentYear = new Date().getFullYear();
const minYear = 1900;

const minDate = ref(`${minYear}-01-01T00:00`);
const maxDate = ref(`${currentYear}-12-31T23:59`);

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
  lifetime.value
    ? Math.floor(lifetime.value / (1000 * 60 * 60 * 24))
    : 0
);
const hours = computed(() =>
  lifetime.value
    ? Math.floor(
        (lifetime.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
    : 0
);
const minutes = computed(() =>
  lifetime.value
    ? Math.floor((lifetime.value % (1000 * 60 * 60)) / (1000 * 60))
    : 0
);
const seconds = computed(() =>
  lifetime.value
    ? Math.floor((lifetime.value % (1000 * 60)) / 1000)
    : 0
);

onMounted(() => {
  if (birthDate.value) {
    updateCountdown();
  }
});

onUnmounted(() => {
  clearInterval(countdownInterval);
});
</script>
