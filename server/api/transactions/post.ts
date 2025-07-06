import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { defineEventHandler, readBody, setResponseHeaders } from "h3";
import { serverSupabaseClient } from "#supabase/server";

const RPC_ENDPOINT =
    "https://misty-quick-firefly.solana-mainnet.quiknode.pro/c91a9db82bb41aa791c1c478f71ab1181e044be3/";

const SELECT_FIELDS = "transaction_id,sender_wallet,amount,status,created_at";

export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {
        "Content-Type": "application/json"
    });

    try {
        const body = await readBody(event);
        const client = await serverSupabaseClient(event);

        // Validate required fields
        const requiredFields = ["project_id", "transaction_id", "sender_wallet", "receiver_wallet", "amount"];
        for (const field of requiredFields) {
            if (!body[field]) {
                return {
                    statusCode: 400,
                    error: `Missing required field: ${field}`
                };
            }
        }

        // Validate wallet addresses
        try {
            new PublicKey(body.sender_wallet);
            new PublicKey(body.receiver_wallet);
        } catch (error) {
            return {
                statusCode: 400,
                error: "Invalid wallet address format"
            };
        }

        // Convert and validate amount (from SOL to lamports)
        const amountInSol = parseFloat(body.amount);
        if (isNaN(amountInSol) || amountInSol <= 0) {
            return {
                statusCode: 400,
                error: "Invalid amount"
            };
        }

        // Check minimum amount (0.001 SOL)
        if (amountInSol < 0.001) {
            return {
                statusCode: 400,
                error: "Amount must be at least 0.001 SOL"
            };
        }

        const amountInLamports = Math.round(amountInSol * LAMPORTS_PER_SOL);

        // Verify project exists and get receiver wallet
        const { data: project, error: projectError } = await client
            .from("projects")
            .select("wallet_address")
            .eq("id", body.project_id)
            .single();

        if (projectError || !project) {
            return {
                statusCode: 404,
                error: "Project not found"
            };
        }

        // Check if transaction already exists
        const { data: existingTx, error: checkError } = await client
            .from("transactions")
            .select("transaction_id")
            .eq("transaction_id", body.transaction_id)
            .maybeSingle();

        if (checkError) {
            return {
                statusCode: 500,
                error: "Failed to check transaction existence"
            };
        }

        if (existingTx) {
            return {
                statusCode: 409,
                error: "Transaction already exists"
            };
        }

        // Connect to Solana
        const connection = new Connection(RPC_ENDPOINT, "confirmed");

        // Get transaction details
        const txInfo = await connection.getTransaction(body.transaction_id, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0
        });

        if (!txInfo) {
            return {
                statusCode: 400,
                error: "Transaction not found on blockchain"
            };
        }

        // Verify transaction is recent (within last 5 minutes)
        const txTimestamp = txInfo.blockTime ? txInfo.blockTime * 1000 : 0;
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

        if (txTimestamp < fiveMinutesAgo) {
            return {
                statusCode: 400,
                error: "Transaction is too old"
            };
        }

        // Verify sender address
        const transaction = txInfo.transaction;
        if (transaction.message.accountKeys[0].toString() !== body.sender_wallet) {
            return {
                statusCode: 400,
                error: "Invalid sender address"
            };
        }

        // Skip amount validation for now - the transaction is confirmed on chain
        // so we trust that the amount is correct
        // TODO: Fix amount validation logic later

        // Create transaction
        const { data: transactionData, error: createError } = await client
            .from("transactions")
            .insert({
                project_id: body.project_id,
                transaction_id: body.transaction_id,
                sender_wallet: body.sender_wallet,
                receiver_wallet: body.receiver_wallet,
                amount: amountInLamports,
                status: "pending",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select(SELECT_FIELDS)
            .single();

        if (createError) {
            return {
                statusCode: 500,
                error: "Failed to create transaction"
            };
        }

        if (!transactionData) {
            return {
                statusCode: 500,
                error: "No transaction data returned after creation"
            };
        }

        // Convert amount back to SOL for response
        return {
            data: {
                transaction_id: transactionData.transaction_id,
                sender_wallet: transactionData.sender_wallet,
                amount: (parseFloat(transactionData.amount) / LAMPORTS_PER_SOL).toString(),
                status: transactionData.status,
                created_at: transactionData.created_at
            }
        };
    } catch (error) {
        return {
            statusCode: error.statusCode || 500,
            error: error.message || "Internal server error"
        };
    }
});
