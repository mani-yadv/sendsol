import { defineStore } from "pinia";
import { useSupabaseClient } from "#imports";

export const useProjectsListFeaturedStore = defineStore("projectsListFeatured", {
    state: () => ({
        projects: [],
        state: {
            loading: false,
            error: false
        },
        supabase: useSupabaseClient()
    }),
    getters: {
        isLoading() {
            return this.state.loading;
        }
    },
    actions: {
        async listProjects(params) {
            this.state.loading = true;
            const { page, perPage } = params;

            // Pagination
            const start = page * perPage;
            const end = start + perPage - 1;

            const { data } = await this.supabase.from("projects").select().eq("is_featured", true).range(start, end);

            this.projects = data;
            this.state.loading = false;
            return data;
        },
        reset() {
            this.projects = [];
        }
    }
});
