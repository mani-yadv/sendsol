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
            try {
                const { page, perPage } = params;

                // Pagination
                const start = page * perPage;
                const end = start + perPage - 1;

                // Get featured projects with total amount raised and creator info
                const { data: projects, error } = await this.supabase
                    .from("projects")
                    .select(
                        `
                        *,
                        transactions!project_id (
                            amount
                        ),
                        user_profiles!user_id (
                            avatar_url,
                            avatar_url_original,
                            verified,
                            username,
                            name,
                            x_profile_url
                        )
                    `
                    )
                    .eq("is_featured", true)
                    .order("created_at", { ascending: false })
                    .range(start, end);

                if (error) throw error;

                // Calculate totals from the joined transactions
                this.projects =
                    projects?.map((project) => ({
                        ...project,
                        total_raised: project.transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0,
                        creator_image: project.user_profiles?.avatar_url || project.user_profiles?.avatar_url_original,
                        creator_verified: project.user_profiles?.verified,
                        creator_username: project.user_profiles?.username,
                        creator_name: project.user_profiles?.name,
                        creator_x_url: project.user_profiles?.x_profile_url
                    })) || [];

                this.state.loading = false;

                return this.projects;
            } catch (error) {
                console.error("Error fetching featured projects:", error);
                this.state.error = true;
                this.state.loading = false;
                return [];
            }
        },
        reset() {
            this.projects = [];
        },
        getProjectTotal(projectId) {
            // This method is not used anymore, but it's kept for compatibility
            // If you want to remove it, you can do so
            return 0;
        }
    }
});
