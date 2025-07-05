import { defineStore } from "pinia";
import { useSupabaseClient } from "#imports";

export const useProjectStore = defineStore("project", {
    state: () => ({
        project: null,
        state: {
            loading: false,
            error: false
        },
        supabase: useSupabaseClient()
    }),
    getters: {
        isLoading() {
            return this.state.loading;
        },
        isError() {
            return this.state.error;
        },
        noDetails() {
            return !this.project;
        },
        walletAddress() {
            // Get default from env
            const config = useRuntimeConfig();  
            return this.project?.creator_wallet || config.app.defaultCreatorWallet;
        
    },
    actions: {
        async createProject(projectParams) {
            this.state.loading = true;
            const { data, error } = await this.supabase.from("projects").insert(projectParams).select();

            if (error) {
                this.state.error = error;
                this.state.loading = false;
                return;
            }

            const [project] = data;
            this.project = project;
            this.state.loading = false;
            return project;
        },

        async fetchProject(projectHandle) {
            this.state.loading = true;

            try {
                // First get the project details
                const { data: project, error: projectError } = await this.supabase
                    .from("projects")
                    .select(
                        `
                        *,
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
                    .eq("handle", projectHandle)
                    .single();

                if (projectError) throw projectError;

                // Get all project transaction stats
                let allTransactions = [];
                let hasMore = true;
                const limit = 100; // Reasonable chunk size
                let offset = 0;

                while (hasMore) {
                    const { data: transactions, error: statsError } = await this.supabase.rpc(
                        "get_project_transactions_stats",
                        {
                            project_txn_stats_project_id: project.id,
                            project_txn_stats_offset: offset,
                            project_txn_stats_limit: limit
                        }
                    );

                    if (statsError) throw statsError;

                    if (!transactions || transactions.length === 0) {
                        hasMore = false;
                    } else {
                        allTransactions = [...allTransactions, ...transactions];
                        offset += transactions.length;
                        hasMore = transactions.length === limit;
                    }
                }

                // Calculate totals from all stats
                const totalRaised = allTransactions.reduce((sum, tx) => sum + (tx.total_amount || 0), 0);
                const uniqueSenders = allTransactions.length;

                // Process the data
                this.project = {
                    ...project,
                    total_raised: totalRaised, // This is in lamports
                    total_senders: uniqueSenders,
                    avatar_url: project.user_profiles?.avatar_url,
                    avatar_url_original: project.user_profiles?.avatar_url_original,
                    username: project.user_profiles?.username,
                    end_date: project.created_at
                        ? new Date(project.created_at).setDate(
                            new Date(project.created_at).getDate() + project.duration
                        )
                        : null
                };
            } catch (error) {
                this.state.error = error;
                this.project = null;
            } finally {
                this.state.loading = false;
            }

            return this.project;
        }
    }
});
