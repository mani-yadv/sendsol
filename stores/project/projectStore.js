import { defineStore } from "pinia";
import { useSupabaseClient } from "#imports";
import Transactions from "~/resources/supabase/Transactions.js";

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
            return this.project.wallet_address;
        },
        testProjectReceiverAddress() {
            return "CAg9fdpsthqunB1kpzAvSe3HmYRvrbKqMyZjycxbeYBn";
        }
    },
    actions: {
        // Refactor below two methods to use BaseModel and streamline error handling
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
            const { data, error } = await this.supabase.from("projects").select().eq("handle", projectHandle);

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

        sendSolToProjectTransaction(params) {
            const record = {
                project_id: this.project.id,
                ...params
            };

            return new Transactions().create(record);
        },

        updateTransactionStatus(transactionId, status) {
            return new Transactions().updateTransactionStatus(transactionId, status);
        },

        fetchAmountSentByUser(senderWalletAddress) {
            return new Transactions().fetchSentAmount(senderWalletAddress, this.testProjectReceiverAddress);
        }
    }
});
