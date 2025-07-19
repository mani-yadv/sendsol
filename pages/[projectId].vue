<template>
    <div>
        <ProjectsDetails :project-id="`${$route.params.projectId}`" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    definePageMeta({
        layout: "projects-default",
        validate: async (route) => {
            // Exclude static file extensions and public paths
            const path = route.params.projectId as string;
            if (!path) return false;
            
            // Don't match if it's a static file or public path
            const staticExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.json', '.ico', '.txt', '.xml'];
            const isStaticFile = staticExtensions.some(ext => path.endsWith(ext));
            const isPublicPath = path.startsWith('public');
            
            return !isStaticFile && !isPublicPath;
        }
    });
    export default defineComponent({
        name: "[projectId]"
    });
</script>
