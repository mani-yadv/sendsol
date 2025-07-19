import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {
        "Content-Type": "application/json"
    });

    try {
        const supabase = await serverSupabaseClient(event);

        // Get total amount sent across all confirmed transactions
        const { data, error } = await supabase
            .from("transactions")
            .select("amount")
            .eq("status", "confirmed");

        if (error) {
            throw createError({
                statusCode: 500,
                message: "Failed to fetch total transactions"
            });
        }

        // Calculate total SOL sent
        const totalLamports = data?.reduce((sum, tx) => sum + parseFloat(tx.amount), 0) || 0;
        const totalSol = totalLamports / LAMPORTS_PER_SOL;

        return { 
            data: {
                total_sol: totalSol,
                total_lamports: totalLamports,
                transaction_count: data?.length || 0
            }
        };
    } catch (error) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Internal server error"
        });
    }
});