<template>
    <section className='pt-16 md:pt-16 lg:pt-24'>
        <div class="flex flex-col min-h-[80vh] md:h-[600px] w-full max-w-4xl mx-auto rounded-lg border border-mainBorder bg-bgDark1 font-Inter overflow-hidden shadow-xl mt-4 mb-8">
            
            <div class="flex items-center justify-between px-6 py-4 bg-bgDark2 border-b border-mainBorder">
            <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full bg-primaryColor animate-pulse"></div>
                <h2 class="text-primaryText font-semibold tracking-wide">Chat Room</h2>
            </div>
            <div class="text-xs text-secondaryText bg-bgDark3 px-3 py-1 rounded-full border border-mainBorderDarker">
                yo soy <span class="text-primaryColor font-medium">{{ currentUser }}</span>
            </div>
            </div>

            <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-bgDark1 custom-scrollbar">
            <div v-if="messages.length === 0" class="flex items-center justify-center h-[60vh] text-secondaryText text-sm italic">
                Aún no hay mensajes. ¡Empieza la conversación!
            </div>
            
            <div 
                v-for="(msg, index) in messages" 
                :key="index" 
                class="flex flex-col max-w-[85%] space-y-1"
                :class="msg.user === currentUser ? 'ml-auto items-end' : 'mr-auto items-start'"
            >
                <div class="flex items-center space-x-2 text-xs text-secondaryText px-1">
                <span :class="msg.user === currentUser ? 'text-secondaryColor font-medium' : ''">
                    {{ msg.user }}
                </span>
                <span>•</span>
                <span>{{ formatTime(msg.timestamp) }}</span>
                </div>

                <div 
                class="px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words"
                :class="msg.user === currentUser 
                    ? 'bg-primaryColor text-primaryText rounded-tr-none' 
                    : 'bg-bgDark3 text-primaryText rounded-tl-none border border-mainBorderDarker'"
                >
                {{ msg.message }}
                </div>
            </div>
            </div>

            <form @submit.prevent="sendMessage" class="p-4 bg-bgDark2 border-t border-mainBorder flex items-center space-x-3">
            <input 
                v-model="newMessage" 
                type="text" 
                placeholder="Type a message..." 
                maxLength="500"
                :disabled="isSending"
                class="flex-1 bg-bgDark3 hover:bg-bgDark3Hover text-primaryText placeholder-secondaryText text-sm rounded-lg px-4 py-3 outline-none border border-mainBorderDarker focus:border-primaryColor transition duration-200 disabled:opacity-50"
            />
            <button 
                type="submit" 
                :disabled="isSending || !newMessage.trim()"
                class="bg-primaryColor hover:bg-secondaryColor text-primaryText font-medium text-sm px-5 py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:hover:bg-primaryColor flex items-center space-x-2"
            >
                <span v-if="isSending">Sending...</span>
                <span v-else>Send</span>
            </button>
            </form>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const MESSAGES_API = 'https://users-count.tools.typinks.com/api/chat/messages';
const MESSAGE_API = `https://users-count.tools.typinks.com/api/chat/message`;
const ALLOWED_USERS = [
    "adharsh", "benny", "ouseph", "stephen", "martin", "santhosh", "reju",
	"job", "baby", "abin", "tinil", "dolly", "jojo", "dominic", "jobin",
	"scott", "mati", "lucas", "reynolds", "edison", "shibu", "ruban",
  "peter", "sebastian", "lalan", "sansilo", "tomy", "joy",
];

const messages = ref([]);
const newMessage = ref('');
const currentUser = ref('');
const isSending = ref(false);
const chatContainer = ref(null);
let pollInterval = null;

const assignRandomUser = () => {
  const randomIndex = Math.floor(Math.random() * ALLOWED_USERS.length);
  currentUser.value = ALLOWED_USERS[randomIndex];
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const fetchMessages = async () => {
  try {
    const response = await fetch(MESSAGES_API);
    if (!response.ok) throw new Error('Failed to fetch logs');
    
    const result = await response.json();
    const reversedLogs = [...result].reverse();
    
    if (JSON.stringify(messages.value) !== JSON.stringify(reversedLogs)) {
      messages.value = reversedLogs;
      scrollToBottom();
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return;

  isSending.value = true;
  const messageContent = newMessage.value.trim();
  const payload = {
    user: currentUser.value,
    message: messageContent,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    local_time: new Date().toISOString(),
    language: navigator.language || navigator.userLanguage,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    user_agent: navigator.userAgent,
    platform: navigator.userAgentData?.platform || navigator.platform || 'Unknown'
  };

  try {
    const response = await fetch(MESSAGE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('yo mama so fat she broke the server');

    newMessage.value = '';
    await fetchMessages();
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    isSending.value = false;
  }
};

const formatTime = (unixSecs) => {
  if (!unixSecs) return '';
  const date = new Date(unixSecs * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
  assignRandomUser();
  fetchMessages();
  
  pollInterval = setInterval(fetchMessages, 10000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgb(31, 32, 35);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgb(48, 49, 54);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgb(55, 56, 62);
}
</style>