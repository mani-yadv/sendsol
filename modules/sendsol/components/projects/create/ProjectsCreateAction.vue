<template>
    <div class="flex items-center">
        <NuxtLink href="/projects/create">
            <button class="btn btn-primary btn-sm px-3">
                <PhosphorIconLightning size="14" />
                <span class="text-xs font-bold">Start project</span>
            </button>
        </NuxtLink>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "ProjectsCreateAction"
    });
</script>

<style scoped></style>
