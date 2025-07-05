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
        const query = getQuery(event);
        const supabase = await serverSupabaseClient(event);

        // Validate required parameters
        const { project_id, sender_wallet, status } = query;

        // If transaction_id is provided, get single transaction
        if (query.transaction_id) {
            const { data: transaction, error: dbError } = await supabase
                .from("transactions")
                .select(SELECT_FIELDS)
                .eq("transaction_id", query.transaction_id)
                .single();

            if (dbError) {
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

            // If project_id is provided, verify it matches
            const { data: projectCheck } = await supabase
                .from("transactions")
                .select("project_id")
                .eq("transaction_id", query.transaction_id)
                .single();

            if (project_id && projectCheck?.project_id !== project_id) {
                throw createError({
                    statusCode: 403,
                    message: "Unauthorized access to transaction"
                });
            }

            // Update status if needed
            if (transaction.status === "pending") {
                const connection = new Connection(RPC_ENDPOINT, "confirmed");
                const txInfo = await connection.getTransaction(query.transaction_id, {
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

                if (newStatus !== transaction.status) {
                    const { error: updateError } = await supabase
                        .from("transactions")
                        .update({
                            status: newStatus,
                            updated_at: new Date().toISOString()
                        })
                        .eq("transaction_id", query.transaction_id);

                    if (!updateError) {
                        transaction.status = newStatus;
                    }
                }
            }

            // Convert amount from lamports to SOL
            transaction.amount = (parseFloat(transaction.amount) / LAMPORTS_PER_SOL).toString();

            return { data: transaction };
        }

        // Get confirmed transactions for project and sender
        if (!project_id) {
            throw createError({
                statusCode: 400,
                message: "Missing required parameter: project_id"
            });
        }

        const query_builder = supabase.from("transactions").select(SELECT_FIELDS).eq("project_id", project_id);

        if (status) {
            query_builder.eq("status", status);
        }

        if (sender_wallet) {
            query_builder.eq("sender_wallet", sender_wallet);
        }

        const { data, error } = await query_builder;

        if (error) {
            throw createError({
                statusCode: 500,
                message: "Failed to fetch transactions"
            });
        }

        // Convert amounts from lamports to SOL
        const transactions =
            data?.map((tx) => ({
                transaction_id: tx.transaction_id,
                sender_wallet: tx.sender_wallet,
                amount: (parseFloat(tx.amount) / LAMPORTS_PER_SOL).toString(),
                status: tx.status,
                created_at: tx.created_at
            })) || [];

        return { data: transactions };
    } catch (error) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Internal server error"
        });
    }
});
