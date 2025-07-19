import BaseModel from "~/resources/supabase/base/BaseModel.js";

/**
 * Transactions model for handling all transaction-related database operations
 * Can be used in both frontend and backend contexts by injecting the appropriate Supabase client
 *
 * @class Transactions
 * @extends {BaseModel}
 * @property {string} tableName - The name of the database table
 */
export default class Transactions extends BaseModel {
    /**
     * Constructor for the Transactions model
     * Initializes the tableName property
     */
    constructor() {
        super();
        /**
         * The name of the database table
         * @type {string}
         */
        this.tableName = "transactions";
    }

    /**
     * Creates a new transaction record in the database
     *
     * @async
     * @param {object} record - The transaction record to be created
     * @returns {Promise<object>} An object containing the created data and any error that occurred
     */
    async create(record) {
        const { data, error } = await this.supabase.from(this.tableName).insert([record]).select().single();

        return { data, error };
    }

    /**
     * Updates the status of a transaction record in the database
     *
     * @async
     * @param {string} transactionId - The ID of the transaction to be updated
     * @param {string} status - The new status of the transaction
     * @param {object} [verificationData={}] - Additional verification data to be updated
     * @returns {Promise<object>} An object containing the updated data and any error that occurred
     */
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

    /**
     * Retrieves a transaction record from the database by its ID
     *
     * @async
     * @param {string} transactionId - The ID of the transaction to be retrieved
     * @returns {Promise<object>} An object containing the retrieved data and any error that occurred
     */
    async getTransaction(transactionId) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("*")
            .eq("transaction_id", transactionId)
            .single();

        return { data, error };
    }

    /**
     * Retrieves a list of confirmed transactions for a specific project and sender wallet
     *
     * @async
     * @param {string} projectId - The ID of the project
     * @param {string} senderWallet - The sender wallet address
     * @returns {Promise<object>} An object containing the retrieved data and any error that occurred
     */
    async getConfirmedTransactions(projectId, senderWallet) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("*")
            .eq("project_id", projectId)
            .eq("sender_wallet", senderWallet)
            .eq("status", "confirmed");

        return { data, error };
    }

    /**
     * Checks if a transaction record exists in the database by its ID
     *
     * @async
     * @param {string} transactionId - The ID of the transaction to be checked
     * @returns {Promise<object>} An object containing a boolean indicating whether the transaction exists and any error
     */
    async checkTransactionExists(transactionId) {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select("id")
            .eq("transaction_id", transactionId)
            .single();

        return { exists: !!data, error };
    }
}
