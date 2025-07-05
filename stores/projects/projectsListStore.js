import { defineStore } from "pinia";
import { useSupabaseClient } from "#imports";

export const useProjectsListStore = defineStore("projectsList", {
    state: () => ({
        projects: [],
        state: {
            loading: false,
            error: false,
            hasMore: true // Add flag to track if more results are available
        },
        supabase: useSupabaseClient()
    }),
    getters: {
        isLoading() {
            return this.state.loading;
        },
        hasMoreResults() {
            return this.state.hasMore;
        }
    },
    actions: {
        async listProjects(params) {
            this.state.loading = true;
            try {
                const { page, perPage, projectStatus } = params;

                // Pagination
                const start = page * perPage;
                const end = start + perPage - 1;

                // Get projects with total amount raised and creator info
                let query = this.supabase
                    .from("projects")
                    .select(
                        `
                        *,
                        transactions!project_id (
                            amount,
                            sender_wallet
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
                    .order("created_at", { ascending: false });

                // Apply status filter if provided
                const currentDate = new Date().toISOString();
                if (projectStatus === "active") {
                    query = query.gte("end_date", currentDate);
                } else if (projectStatus === "ended") {
                    query = query.lte("end_date", currentDate);
                }

                // Apply pagination
                query = query.range(start, end);

                const { data: projects, error } = await query;

                if (error) throw error;

                // Process projects to include calculated fields
                const processedProjects = projects.map((project) => {
                    // Calculate total raised from transactions
                    const totalRaised = project.transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

                    // Calculate unique senders from sender_wallet
                    const uniqueSenders = new Set(project.transactions?.map((tx) => tx.sender_wallet) || []).size;

                    // Map creator info
                    const creatorProfile = project.user_profiles;

                    return {
                        ...project,
                        total_raised: totalRaised,
                        unique_senders: uniqueSenders,
                        creator_image: creatorProfile?.avatar_url || null,
                        creator_name: creatorProfile?.name || creatorProfile?.username || "Anonymous",
                        creator_handle: creatorProfile?.username || "anonymous",
                        creator_x_url: creatorProfile?.x_profile_url || null,
                        creator_verified: creatorProfile?.verified || false
                    };
                });

                // Update hasMore based on results
                this.state.hasMore = processedProjects.length === perPage;

                // Append new projects instead of replacing
                this.projects = [...this.projects, ...processedProjects];
                this.state.error = false;
            } catch (error) {
                console.error("Error fetching projects:", error);
                this.state.error = true;
                this.projects = [];
            } finally {
                this.state.loading = false;
            }
        },

        reset() {
            this.projects = [];
            this.state.loading = false;
            this.state.error = false;
            this.state.hasMore = true;
        }
    }
});
