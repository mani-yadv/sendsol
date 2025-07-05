<template>
    <div>
        <div v-if="projectStore.isLoading">
            <div class="flex w-full flex-col gap-4">
                <div class="skeleton h-32 w-full" />
                <div class="skeleton h-32 w-full" />
                <div class="skeleton h-4 w-28" />
                <div class="skeleton h-4 w-full" />
                <div class="skeleton h-4 w-full" />
            </div>
        </div>
        <div v-else-if="projectStore.isError || projectStore.noDetails" class="my-10">
            <div role="alert" class="alert alert-error flex gap-1">
                <PhosphorIconWarningCircle class="animate-bounce" size="24" />
                <span class="text-sm">No project details found. Please check the url and try again.</span>
            </div>
        </div>

        <div v-else-if="projectStore.project" class="flex flex-col space-y-6">
            <div class="flex items-center justify-between space-x-2">
                <NuxtLink to="/">
                    <PhosphorIconArrowLeft class="text-primary" size="24" />
                </NuxtLink>
                <span class="px-2 text-lg font-bold">
                    {{ projectStore.project.name }}
                </span>
            </div>

            <div>
                <ProjectsDetailsStats :project="projectStore.project" />
            </div>
            <div>
                <ProjectsSenders :project="projectStore.project" />
            </div>
        </div>
    </div>
</template>
<script>
    import { defineComponent } from "vue";
    import { useProjectStore } from "~/stores/project/projectStore";
    export default defineComponent({
        name: "ProjectsDetails",

        setup() {
            return {
                projectStore: useProjectStore()
            };
        },
        data() {
            return {
                projectHandle: location.pathname.split("/")[1]
            };
        },

        created() {
            this.fetchProject();
        },

        methods: {
            fetchProject() {
                this.projectStore.fetchProject(this.projectHandle);
            }
        }
    });
</script>
