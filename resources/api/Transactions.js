import axios from "axios";

export default class ApiTransactions {
    constructor() {
        this.baseURL = "/api/transactions";
    }

    async create(transactionData) {
        try {
            const { data } = await axios.post(`${this.baseURL}/post`, transactionData);
            return { data };
        } catch (error) {
            console.error("Error creating transaction:", error);
            return {
                error: {
                    message: error.response?.data?.message || error.message,
                    status: error.response?.status || 500
                }
            };
        }
    }

    async update(transactionId) {
        try {
            const { data } = await axios.put(`${this.baseURL}/put`, {
                transaction_id: transactionId
            });
            return { data };
        } catch (error) {
            console.error("Error updating transaction:", error);
            return {
                error: {
                    message: error.response?.data?.message || error.message,
                    status: error.response?.status || 500
                }
            };
        }
    }

    async getConfirmedTransactions(projectId, senderWallet) {
        try {
            const { data } = await axios.get(`${this.baseURL}/get`, {
                params: {
                    project_id: projectId,
                    sender_wallet: senderWallet,
                    status: "confirmed"
                }
            });
            return { data };
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return {
                error: {
                    message: error.response?.data?.message || error.message,
                    status: error.response?.status || 500
                }
            };
        }
    }
}
