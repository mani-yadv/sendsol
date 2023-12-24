import { defineStore } from "pinia";
import { useSupabaseClient } from "#imports";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
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
        authenticated() {
            return !!this.user;
        },
        avatarUrl() {
            return this.user?.user_metadata.avatar_url || "https://ui-avatars.com/api/?background=random";
        },
        metadata() {
            return this.user?.user_metadata || {};
        },
        formattedData() {
            return {
                id: this.user?.id,
                email: this.user?.email,
                avatar: this.avatarUrl,
                metadata: this.metadata
            };
        }
    },
    actions: {
        async logout() {
            await this.supabase.auth.signOut();
        },
        loginWithTwitter() {
            this.state.loading = true;

            return this.supabase.auth
                .signInWithOAuth({
                    provider: "twitter"
                })
                .finally(() => {
                    this.state.loading = false;
                });
        },

        initAuth() {
            return this.supabase.auth
                .getUser()
                .then(({ data: { user } }) => {
                    this.user = user || null;
                })
                .finally(() => {
                    this.state.loading = false;
                });
        }
    }
});
