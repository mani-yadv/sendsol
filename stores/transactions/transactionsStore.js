import { defineStore } from "pinia";
import axios from "axios";

export const useTransactionsStore = defineStore("transactions", {
    state: () => ({
        state: {
            loading: false,
            error: null
        }
    }),
    getters: {
        isLoading() {
            return this.state.loading;
        },
        hasError() {
            return !!this.state.error;
        }
    },
    actions: {
        setLoading(loading) {
            this.state.loading = loading;
        },
        setError(error) {
            this.state.error = error;
        },
        clearError() {
            this.state.error = null;
        },
        async create(transactionData) {
            try {
                this.setLoading(true);
                this.clearError();

                const { data } = await axios.post("/api/transactions/post", transactionData, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                });

                if (!data || !data.data) {
                    throw new Error("Invalid response format");
                }

                return { data: data.data };
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status < 600) {
                    const errorMessage = error.response.data?.message || error.message;
                    this.setError(errorMessage);
                } else {
                    this.setError(error.message);
                }
                return { error };
            } finally {
                this.setLoading(false);
            }
        },
        async getTransaction(transactionId, projectId) {
            try {
                this.setLoading(true);
                this.clearError();

                const params = { transaction_id: transactionId };
                if (projectId) {
                    params.project_id = projectId;
                }

                const { data } = await axios.get("/api/transactions/get", {
                    params,
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (!data || !data.data) {
                    throw new Error("Invalid response format");
                }

                return { data: data.data };
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status < 600) {
                    const errorMessage = error.response.data?.message || error.message;
                    this.setError(errorMessage);
                } else {
                    this.setError(error.message);
                }
                return { error };
            } finally {
                this.setLoading(false);
            }
        },
        async getConfirmedTransactions(projectId, senderWallet) {
            try {
                this.setLoading(true);
                this.clearError();

                const params = {
                    project_id: projectId,
                    sender_wallet: senderWallet,
                    status: "confirmed"
                };

                const { data } = await axios.get("/api/transactions/get", {
                    params,
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (!data || !data.data) {
                    throw new Error("Invalid response format");
                }

                return { data: data.data };
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status < 600) {
                    const errorMessage = error.response.data?.message || error.message;
                    this.setError(errorMessage);
                } else {
                    this.setError(error.message);
                }
                return { error };
            } finally {
                this.setLoading(false);
            }
        },
        async updateTransaction(transactionId, projectId) {
            try {
                this.setLoading(true);
                this.clearError();

                const { data } = await axios.put(
                    "/api/transactions/put",
                    {
                        transaction_id: transactionId,
                        project_id: projectId
                    },
                    {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!data || !data.data) {
                    throw new Error("Invalid response format");
                }

                return { data: data.data };
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status < 600) {
                    const errorMessage = error.response.data?.message || error.message;
                    this.setError(errorMessage);
                } else {
                    this.setError(error.message);
                }
                return { error };
            } finally {
                this.setLoading(false);
            }
        }
    }
});
