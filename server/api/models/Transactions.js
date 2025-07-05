import BaseModel from "./base/BaseModel";

export default class Transactions extends BaseModel {
    constructor(client) {
        super(client);
        this.tableName = "transactions";
    }

    async create(record) {
        const { data, error } = await this.supabase.from(this.tableName).insert([record]).select().single();

        return { data, error };
    }

    async updateTransactionStatus(transactionId, status, verificationData = {}) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .update({
                status,
                ...verificationData,
                updated_at: new Date().toISOString()
            })
            .eq("transaction_id", transactionId)
            .select()
            .single();

        return { data, error };
    }

    async getTransaction(transactionId) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("*")
            .eq("transaction_id", transactionId)
            .single();

        return { data, error };
    }

    async getConfirmedTransactions(projectId, senderWallet = null) {
        let query = this.supabase
            .from(this.tableName)
            .select("*")
            .eq("project_id", projectId)
            .eq("status", "confirmed");

        // Only filter by sender_wallet if provided
        if (senderWallet) {
            query = query.eq("sender_wallet", senderWallet);
        }

        const { data, error } = await query;

        return { data, error };
    }

    async checkTransactionExists(transactionId) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("id")
            .eq("transaction_id", transactionId)
            .single();

        return { exists: !!data, error };
    }
}
