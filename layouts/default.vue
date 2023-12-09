<template>
    <div>
        <HeaderDefault />
        <slot />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "default"
    });
</script>

<style scoped></style>
