<template>
    <div class="flex items-center">
        <NuxtLink href="/projects/create">
            <button class="btn btn-primary btn-sm">
                <span class="flex items-center gap-1">
                    <PhosphorIconLightning size="15" />
                    <span class="whitespace-nowrap text-xs font-bold">Create project</span>
                </span>
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

