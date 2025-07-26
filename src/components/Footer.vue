<template>
    <footer aria-label="Site footer">
        <div class="pt-10 lg:pt-20 lg:pb-16 bg-bgDark1 radius-for-skewed">
            <div class="container mx-auto px-4 w-4/5 md:w-11/12 lg:w-10/12 xl:w-4/5 2xl:w-2/3">
                <div class="flex flex-wrap">
                    <div class="w-full lg:w-1/3 mb-16 lg:mb-0">
                        <div class="flex justify-center lg:justify-start items-center grow basis-0">
                            <div class="text-white mr-2 text-6xl">
                                <Logo />
                            </div>
                            <div class="text-white font-['Inter'] font-bold text-xl">Free Online</div>
                        </div>
                        <p class="mb-10 mt-4  text-gray-400 leading-loose text-center lg:text-left mx-auto lg:mx-0">
                            Que se vayan los que se tienen que ir. Nosotros a lo nuestro: relajarnos y disfrutar.
                        </p>
                        <div className="flex flex-col my-2 overflow-hidden rounded-2xl text-center">
                            <dt className="text-sm font-semibold leading-6 text-gray-300">
                                Live Users Count
                            </dt>
                            <dd className="order-first text-3xl font-semibold tracking-tight text-white">
                                <div className="relative inline-flex">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div
                                        className="w-3 h-3 bg-green-500 rounded-full absolute top-0 left-0 animate-ping">
                                    </div>
                                    <div
                                        className="w-3 h-3 bg-green-500 rounded-full absolute top-0 left-0 animate-pulse">
                                    </div>
                                </div> {{ userCount }}
                            </dd>
                        </div>
                    </div>
                    <div class="w-full lg:w-2/3 lg:pl-16 flex flex-wrap items-start gap-8">
                        <FooterSection v-for="(section, index) in footerData" :key="index" :title="section.title"
                            :items="section.items" />
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
import MailIcon from "../assets/icons/MailIcon.vue";
import Logo from "../assets/logos/LogoVue.vue";
import FooterSection from "./FooterSection.vue";
import { ref, onMounted, onUnmounted } from "vue";

export default {
    name: "Footer",
    components: {
        MailIcon,
        Logo,
        FooterSection
    },
    data() {
        return {
            footerData: [
                {
                    title: "Products",
                    items: [
                        {
                            label: "Redis Lua Script Test",
                            value: "/redis-lua"
                        },
                        {
                            label: "Server Side Events Test",
                            value: "/sse"
                        },
                        {
                            label: "Typinks Poster Generator",
                            value: "/typinks-poster-generator"
                        },
                        {
                            label: "Kroenger Poster Generator",
                            value: "/kroenger-poster-generator"
                        },
                        {
                            label: "Prelims Marks Calculator",
                            value: "/prelims-marks-calculator"
                        }
                    ],
                },
                {
                    title: "Important Links",
                    items: [
                        {
                            label: "Blog",
                            value: "/blog"
                        }
                    ],
                },
                {
                    title: "Fun Tools",
                    items: [
                        {
                            label: "Slide Puzzle",
                            value: "/slide-puzzle"
                        },
                        {
                            label: "Sudoku",
                            value: "/sudoku"
                        },
                        {
                            label: "Life Time Calculator",
                            value: "/life-time-calculator"
                        }
                    ],
                },
            ],
        };
    },
    setup() {
        const userCount = ref(1);

        const fetchUserCount = async () => {
            try {
                const response = await fetch(
                    `https://users-count.tools.typinks.com/api/count-user?url=${encodeURIComponent(
                        window.location.href
                    )}`
                );
                if (!response.ok) {
                    console.error("Network response was not ok");
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                console.log("User count data:", data);
                userCount.value = JSON.parse(data.data).count;
            } catch (error) {
                console.error("Error fetching user count:", error);
            }
        };

        onMounted(() => {
            fetchUserCount();

            const interval = setInterval(fetchUserCount, 10000);

            onUnmounted(() => clearInterval(interval));
        });

        return {
            userCount
        }
    }
}
</script>