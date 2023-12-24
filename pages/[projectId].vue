<template>
    <div>
        <ProjectsDetails :project-id="`${$route.params.projectId}`" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    definePageMeta({
        layout: "projects-default"
    });
    export default defineComponent({
        name: "[projectId]"
    });
</script>
