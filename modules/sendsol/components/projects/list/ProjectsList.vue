<template>
    <div class="my-12 w-full flex-col space-y-4">
        <div class="w-36">
            <div role="tablist" class="tabs-boxed tabs">
                <a
                    role="tab"
                    class="tab-sm tab"
                    :class="{ 'tab-active': projectStatus === 'active' }"
                    @click="setProjectType('active')">
                    Active
                </a>
                <a
                    role="tab"
                    class="tab-sm tab"
                    :class="{ 'tab-active': projectStatus === 'ended' }"
                    @click="setProjectType('ended')">
                    Ended
                </a>
            </div>
        </div>

        <div v-if="state.loading" class="flex w-full justify-center">
            <div class="loading loading-dots loading-md my-10" />
        </div>
        <div v-else>
            <div
                v-if="projectsListStore.projects.length"
                class="stats stats-vertical w-full border border-neutral shadow">
                <ProjectsListItem
                    v-for="project in projectsListStore.projects"
                    :key="project.id"
                    :project="project"
                    class="stat" />
            </div>
            <div v-else>
                <div
                    class="mx-5 my-10 flex items-center justify-center gap-2 rounded-lg border border-neutral p-16 font-bold opacity-50">
                    <PhosphorIconSiren size="22" />
                    <div>No results</div>
                </div>
            </div>
            <div v-if="projectsListStore.hasMoreResults" class="my-4 flex justify-center">
                <div v-if="projectsListStore.isLoading" class="loading loading-dots loading-xs" />
                <button v-else class="btn btn-outline btn-xs text-opacity-25" @click="handlePagination">
                    Load more...
                </button>
            </div>
            <div v-else-if="projectsListStore.projects.length > 0" class="my-4 flex justify-center">
                <div class="text-sm opacity-50">End of results</div>
            </div>
        </div>
    </div>
</template>
<script>
    import { useProjectsListStore } from "~/stores/projects/projectsListStore";

    export default {
        name: "ProjectsList",

        setup() {
            return {
                projectsListStore: useProjectsListStore()
            };
        },

        data() {
            return {
                projectStatus: "active",
                pagination: {
                    page: 0,
                    perPage: 20,
                    ended: false
                },
                state: {
                    loading: true
                }
            };
        },

        created() {
            this.projectsListStore.reset();
            this.fetchProjects();
        },

        methods: {
            async fetchProjects() {
                return await this.projectsListStore.listProjects(this.getParams()).then((projects) => {
                    this.state.loading = false;
                    if (Array.isArray(projects)) {
                        this.pagination.ended = projects?.length < this.pagination.perPage;
                    }
                });
            },

            getParams() {
                return {
                    projectStatus: this.projectStatus,
                    page: this.pagination.page,
                    perPage: this.pagination.perPage
                };
            },

            handlePagination() {
                this.pagination.page++;
                this.fetchProjects();
            },

            setProjectType(status) {
                this.projectStatus = status;
                this.pagination.page = 0;
                this.state.loading = true;
                this.projectsListStore.reset();
                this.fetchProjects();
            }
        }
    };
</script>
