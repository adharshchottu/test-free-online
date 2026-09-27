<template>
    <div class="mb-12">
        <h3 class="mb-6 text-2xl font-bold text-primaryText">{{ title }}</h3>
        <ul>
            <li v-for="(item, index) in items" :key="index" class="mb-4">
                <a class="text-gray-400 hover:text-gray-300" :href=item.value :aria-label="item">
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