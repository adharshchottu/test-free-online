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
                        <p
                            class="mb-10 mt-4  text-gray-400 leading-loose text-center lg:text-left mx-auto lg:mx-0">
                            Que se vayan los que se tienen que ir. Nosotros a lo nuestro: relajarnos y disfrutar.
                        </p>
                        <div class="w-36 mx-auto lg:mx-0">
                            <a class="inline-block w-10 h-10 mr-2 p-2 pt-[0.55rem] outlined-button"
                                href="mailto:admin@test-free.online" aria-label="Mail">
                                <MailIcon />
                            </a>
                        </div>
                    </div>
                    <div class="w-full lg:w-2/3 lg:pl-16 hidden lg:flex flex-wrap justify-between">
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

export default {
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
                            value: "https://www.test-free.online/redis-lua"
                        },
                        {
                            label: "Server Side Events Test",
                            value: "https://www.test-free.online/sse"
                        }
                    ],
                },
                {
                    title: "Important Links",
                    items: [
                        {
                            label: "Typinks Poster Generator",
                            value: "https://www.test-free.online/typinks-poster-generator"
                        },
                        {
                            label: "Kroenger Poster Generator",
                            value: "https://www.test-free.online/kroenger-poster-generator"
                        },
                    ],
                },
                {
                    title: "Fun Tools",
                    items: [
                        {
                            label: "Slide Puzzle",
                            value: "https://www.test-free.online/slide-puzzle"
                        },
                        {
                            label: "Sudoku",
                            value: "https://www.test-free.online/sudoku"
                        }
                    ],
                },
            ],
        };
    },
};
</script>