<template>
    <section class="w-full flex justify-center bg-bgDark2 relative pt-20 md:pt-24 lg:pt-28">
        <div class="absolute -top-16" id="blog"></div>
        <div class="pb-0 pt-4 bg-bgDark2 max-w-7xl w-full">
            <motion.div :initial="{ opacity: 0 }" :whileInView="{ opacity: 1 }" :viewport="{ once: true }"
                :transition="{ duration: 0.5, delay: 0.2 }">
                <div class="container px-4 mb-20">
                    <div class="max-w-2xl text-center lg:text-left mb-16 mx-auto lg:ml-0 lg:mr-0">
                        <span class="block-subtitle">Discover Our Thoughts</span>
                        <h2 class="mt-6 mb-6 text-4xl lg:text-5xl font-bold font-heading text-primaryText">
                            Fresh Ideas & Insights
                        </h2>
                        <p class="mb-6 text-secondaryText">
                            Stay ahead of the curve with the latest trends and game-changing perspectives.
                        </p>
                    </div>

                    <!-- Adjusted Flexbox layout for better control of blog card sizes -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div v-for="(blog, index) in blogData" :key="index"
                            class="p-6 sm:p-8 bg-bgDark3 rounded-3xl hover:bg-bgDark3Hover transition cursor-pointer">
                            <a :href="'/blog/' + blog.link">
                                <img :src="blog.image.src" :alt="blog.title"
                                    class="rounded-3xl mb-6 w-full h-auto object-cover" :aria-label="blog.title" />
                                <h3 class="mb-4 text-2xl font-bold font-heading text-primaryText">{{ blog.title }}</h3>
                                <p class="text-secondaryText leading-loose">{{ blog.subtitle }}</p>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
</template>

<script>
import { motion } from "framer-motion";
import testSSEOnline from "../assets/images/blog/test-sse-online.png";

export default {
    name: "Blog",
    components: { motion },
    data() {
        return {
            blogData: [
                {
                    title: "How to test SSE online",
                    subtitle:
                        "SSE allows a server to send real-time updates to the browser without the browser asking for them",
                    image: testSSEOnline,
                    link: 'how-to-test-sse-online'
                },
                {
                    title: "Comment tester SSE en ligne",
                    subtitle:
                        "SSE permet à un serveur d'envoyer des mises à jour en temps réel au navigateur sans que celui-ci les demande",
                    image: testSSEOnline,
                    link: 'comment-tester-sse-en-ligne'
                },
            ],
        };
    },
};
</script>