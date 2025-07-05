import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { serverSupabaseClient } from "#supabase/server";

const RPC_ENDPOINT =
    "https://misty-quick-firefly.solana-mainnet.quiknode.pro/c91a9db82bb41aa791c1c478f71ab1181e044be3/";

// Fields we want to return from database
const SELECT_FIELDS = "transaction_id,sender_wallet,amount,status,created_at";

export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {
        "Content-Type": "application/json"
    });

    try {
        const body = await readBody(event);
        const supabase = await serverSupabaseClient(event);

        // Validate required fields
        const { transaction_id, project_id } = body;
        if (!transaction_id || !project_id) {
            throw createError({
                statusCode: 400,
                message: "Missing required fields"
            });
        }

        // Get transaction
        const { data: transaction, error: txError } = await supabase
            .from("transactions")
            .select(SELECT_FIELDS)
            .eq("transaction_id", transaction_id)
            .eq("project_id", project_id)
            .single();

        if (txError) {
            throw createError({
                statusCode: 500,
                message: "Database error"
            });
        }

        if (!transaction) {
            throw createError({
                statusCode: 404,
                message: "Transaction not found"
            });
        }

        // Check transaction status on chain
        const connection = new Connection(RPC_ENDPOINT, "confirmed");
        const txInfo = await connection.getTransaction(transaction_id, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0
        });

        let newStatus = transaction.status;
        if (!txInfo) {
            if (Date.now() - new Date(transaction.created_at).getTime() > 5 * 60 * 1000) {
                newStatus = "failed";
            }
        } else if (txInfo.meta?.err) {
            newStatus = "failed";
        } else {
            newStatus = "confirmed";
        }

        // Update status if changed
        if (newStatus !== transaction.status) {
            const { data: updatedTx, error: updateError } = await supabase
                .from("transactions")
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq("transaction_id", transaction_id)
                .select(SELECT_FIELDS)
                .single();

            if (updateError) {
                throw createError({
                    statusCode: 500,
                    message: "Failed to update transaction"
                });
            }

            if (!updatedTx) {
                throw createError({
                    statusCode: 500,
                    message: "No transaction data returned after update"
                });
            }

            // Convert amount to SOL and return updated transaction
            return {
                data: {
                    transaction_id: updatedTx.transaction_id,
                    sender_wallet: updatedTx.sender_wallet,
                    amount: (parseFloat(updatedTx.amount) / LAMPORTS_PER_SOL).toString(),
                    status: updatedTx.status,
                    created_at: updatedTx.created_at
                }
            };
        }

        // Convert amount to SOL and return unchanged transaction
        return {
            data: {
                transaction_id: transaction.transaction_id,
                sender_wallet: transaction.sender_wallet,
                amount: (parseFloat(transaction.amount) / LAMPORTS_PER_SOL).toString(),
                status: transaction.status,
                created_at: transaction.created_at
            }
        };
    } catch (error) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Internal server error"
        });
    }
});
