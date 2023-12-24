<template>
    <div class="flex items-center">
        <NuxtLink href="/projects/create">
            <button class="btn btn-primary btn-sm px-4">
                <PhosphorIconWallet class="h-4 w-4" />
                <span class="text-xs">Create</span>
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
