<template>
    <div>
        <ProjectsDetails :project-id="`${$route.params.slug}`" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    definePageMeta({
        layout: "projects-default"
    });
    export default defineComponent({
        name: "ProjectSlug"
    });
</script>
