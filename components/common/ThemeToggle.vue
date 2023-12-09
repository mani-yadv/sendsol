<template>
    <ClientOnly>
        <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
            color="gray"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark" />

        <template #fallback>
            <div class="h-8 w-8" />
        </template>
    </ClientOnly>
</template>

<script setup>
    const colorMode = useColorMode();

    const isDark = computed({
        get: function () {
            return colorMode.value === "dark";
        },
        set: function () {
            colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
        }
    });
</script>
