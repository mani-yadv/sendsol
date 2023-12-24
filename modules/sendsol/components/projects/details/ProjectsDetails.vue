<template>
    <div class="flex flex-col space-y-6">
        <div class="flex items-center justify-between space-x-2">
            <NuxtLink to="/">
                <PhosphorIconArrowLeft class="text-primary" size="24" />
            </NuxtLink>
            <span class="px-2 text-lg font-bold">SEND SOL Token</span>
        </div>

        <div>
            <ProjectsDetailsStats />
        </div>
        <div>
            <ProjectsSenders />
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "ProjectsDetails",
        props: {
            projectId: {
                type: String,
                required: true
            }
        }
    });
</script>
