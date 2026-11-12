<template>
    <footer aria-label="Site footer" class="bg-bgDark1 radius-for-skewed">
        <div class="container mx-auto px-4 w-11/12 lg:w-10/12 xl:w-4/5 2xl:w-2/3 pt-12 lg:pt-20">
            <!-- Brand row -->
            <div
                class="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pb-10 border-b border-gray-800">
                <div class="text-center md:text-left">
                    <a href="/" class="inline-flex items-center" aria-label="Free Online home">
                        <span class="text-white mr-2 text-6xl">
                            <Logo />
                        </span>
                        <span class="text-white font-['Inter'] font-bold text-xl">Free Online</span>
                    </a>
                    <p class="mt-4 max-w-md text-gray-400 leading-loose mx-auto md:mx-0">
                        Que se vayan los que se tienen que ir. Nosotros a lo nuestro: relajarnos y disfrutar.
                    </p>
                </div>

                <div
                    class="flex items-center justify-center gap-3 self-center rounded-2xl border border-gray-800 px-6 py-4">
                    <span class="relative inline-flex w-3 h-3">
                        <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span class="w-3 h-3 bg-green-500 rounded-full absolute top-0 left-0 animate-ping"></span>
                    </span>
                    <span class="text-3xl font-semibold tracking-tight text-white">{{ userCount }}</span>
                    <span class="text-sm font-semibold text-gray-300">Live users</span>
                </div>
            </div>

            <!-- Link sections -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 pt-12">
                <FooterSection v-for="section in footerData" :key="section.title" :title="section.title"
                    :items="section.items" :class="section.tall ? 'row-span-2' : ''" />
            </div>

            <!-- Bottom bar -->
            <div
                class="flex flex-col sm:flex-row items-center justify-between gap-2 py-6 border-t border-gray-800 text-sm text-gray-500">
                <p>&copy; {{ year }} Free Online. All tools are free to use.</p>
                <p>{{ toolCount }} tools and counting</p>
            </div>
        </div>
    </footer>
</template>

<script>
import Logo from "../assets/logos/LogoVue.vue";
import FooterSection from "./FooterSection.vue";
import { tools } from "../data/tools";
import { ref, onMounted, onUnmounted } from "vue";

// Footer section order; any category not listed here is appended after these.
const CATEGORY_ORDER = ["Developer", "Design", "Productivity", "Calculators", "Games", "Community"];
const CATEGORY_TITLES = {
    Developer: "Developer Tools",
    Design: "Design",
    Productivity: "Productivity",
    Calculators: "Calculators",
    Games: "Games",
    Community: "Community",
};

function buildFooterData() {
    const groups = new Map();
    for (const tool of tools) {
        if (!groups.has(tool.category)) groups.set(tool.category, []);
        groups.get(tool.category).push({ label: tool.name, value: tool.href });
    }

    const categories = [
        ...CATEGORY_ORDER.filter((c) => groups.has(c)),
        ...[...groups.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
    ];

    const sections = categories.map((category) => {
        const items = groups.get(category);
        return {
            title: CATEGORY_TITLES[category] || category,
            items,
            // Long lists span two rows so the short sections pack beside them
            tall: items.length > 5,
        };
    });

    sections.push({
        title: "Site",
        items: [
            { label: "Home", value: "/" },
            { label: "All Tools", value: "/#tools" },
            { label: "Blog", value: "/blog" },
        ],
    });

    return sections;
}

export default {
    name: "Footer",
    components: {
        Logo,
        FooterSection,
    },
    data() {
        return {
            footerData: buildFooterData(),
            toolCount: tools.length,
            year: new Date().getFullYear(),
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
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                userCount.value = JSON.parse(data.data).count;
            } catch (error) {
                console.error("Error fetching user count:", error);
            }
        };

        let interval;
        onMounted(() => {
            fetchUserCount();
            interval = setInterval(fetchUserCount, 10000);
        });
        onUnmounted(() => clearInterval(interval));

        return {
            userCount,
        };
    },
};
</script>
