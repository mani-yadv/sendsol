<template>
    <div class="flex w-full flex-col space-y-4">
        <div class="text-xl font-bold">Featured projects</div>

        <div v-if="state.loading" class="flex w-full justify-center py-4">
            <div class="flex w-full flex-col gap-4">
                <div class="skeleton h-32 w-full" />
            </div>
        </div>

        <div v-else class="flex w-full flex-col space-y-3">
            <div class="carousel carousel-center glass w-full space-x-4 rounded-box bg-primary p-4">
                <FeaturedProjectsItem
                    v-for="(project, index) in projectsListFeaturedStore.projects"
                    :id="`slide${index}`"
                    :key="project.id"
                    :project="project" />
            </div>

            <div v-if="$device.isDesktop" class="flex w-full justify-between px-4 opacity-50">
                <a href="#slide1">❮</a>
                <a href="#slide2">❯</a>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { useProjectsListFeaturedStore } from "~/stores/projects/projectsListFeaturedStore";
    import FeaturedProjectsItem from "~/modules/sendsol/components/featured/FeaturedProjectsItem.vue";

    export default {
        name: "FeaturedProjects",
        components: { FeaturedProjectsItem },

        setup() {
            return {
                projectsListFeaturedStore: useProjectsListFeaturedStore()
            };
        },
        data() {
            return {
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
            this.fetchProjects();
        },

        methods: {
            async fetchProjects() {
                this.state.loading = true;
                await this.projectsListFeaturedStore.listProjects({
                    page: this.pagination.page,
                    perPage: this.pagination.perPage
                });
                this.state.loading = false;
            },

            async getTwitterFollowersCount() {
                const supabase = useSupabaseClient();
                const { data } = await supabase.auth.getSession();

                const { session } = data;
                console.log(session, {
                    token: session.access_token,
                    userId: session.user.user_metadata.provider_id
                });
                // console.log(session, {
                //     token: session.access_token,
                //     userId: session.user.user_metadata.provider_id
                // });
                // axios
                //     .get("/api/twitter", {
                //         params: {
                //             token: session.provider_token,
                //             userId: session.user.user_metadata.provider_id
                //         }
                //     })
                //     .then((response) => {
                //         console.log(response);
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     });
            }
        }
    };
</script>
