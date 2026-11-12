<template>
    <div class="mb-10">
        <h3 class="mb-4 text-lg font-bold text-primaryText">{{ title }}</h3>
        <ul>
            <li v-for="item in items" :key="item.value" class="mb-3">
                <a class="text-sm text-gray-400 hover:text-gray-200 transition-colors" :href="item.value">
                    {{ item.label }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        items: Array,
    },
};
</script>
