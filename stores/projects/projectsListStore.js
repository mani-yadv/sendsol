import { defineStore } from "pinia";
import { useSupabaseClient } from "#imports";

export const useProjectsListStore = defineStore("projectsList", {
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
            const { page, perPage, projectStatus, isFeatured } = params;

            // Pagination
            const start = page * perPage;
            const end = start + perPage - 1;

            let query = this.supabase.from("projects").select().range(start, end);

            // Filter based on project status
            const currentDate = new Date().toISOString();
            if (projectStatus === "active") {
                query = query.gte("end_date", currentDate);
            } else if (projectStatus === "ended") {
                query = query.lte("end_date", currentDate);
            }

            // Filter based on featured status
            if (isFeatured) {
                query = query.eq("is_featured", true);
            }

            const { data } = await query;

            this.projects = [...this.projects, ...data];
            this.state.loading = false;
            return data;
        },
        reset() {
            this.projects = [];
        }
    }
});
