import BaseModel from "~/resources/supabase/base/BaseModel.js";

export default class Transactions extends BaseModel {
    constructor() {
        super();
        this.tableName = "transactions";
    }

    create(record) {
        return this.supabase.from(this.tableName).insert([record]).select();
    }

    updateTransactionStatus(transactionId, status) {
        return this.supabase
            .from(this.tableName)
            .update({
                status
            })
            .eq("transaction_id", transactionId);
    }

    fetchSentAmount(senderWalletAddress, receiverWalletAddress) {
        return this.supabase
            .from(this.tableName)
            .select("amount")
            .eq("sender_wallet", senderWalletAddress)
            .eq("receiver_wallet", receiverWalletAddress)
            .eq("status", "confirmed");
    }
}
