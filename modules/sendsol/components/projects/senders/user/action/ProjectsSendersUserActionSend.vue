<template>
    <div>
        <BottomDrawer :can-close="!isLoading" @close="handleClose">
            <template #header>
                <div v-if="!isLoading" class="text-xl font-bold">Send SOL to this project</div>
                <div v-else class="flex items-center space-x-2">
                    <PhosphorIconSpinner class="animate-spin" size="20" />
                    <span class="ml-2 text-xl font-bold">Sending SOL ...</span>
                </div>
            </template>
            <template #content>
                <div class="mt-4 flex h-full flex-col justify-end space-y-12">
                    <div v-if="transactionSuccess" class="alert alert-success shadow-lg">
                        <div class="flex items-center gap-0.5">
                            <PhosphorIconCheckCircle size="20" />
                            <span class="text-sm leading-tight">
                                Transaction successful! Amount sent: {{ amountToSend }} SOL
                            </span>
                        </div>
                    </div>

                    <div v-if="error" class="alert-soft alert alert-error">
                        <div class="flex w-full items-start gap-0.5">
                            <PhosphorIconXCircle size="20" />
                            <span class="text-sm leading-tight">{{ error }}</span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4">
                        <div class="form-control w-full">
                            <label class="label">
                                <span class="label-text">Amount</span>
                            </label>
                            <div class="relative">
                                <NumberInput
                                    v-model="amountToSend"
                                    :min="0.001"
                                    :max="solBalance"
                                    :steps="0.1"
                                    placeholder="0.00"
                                    class="input input-bordered w-full pr-16" />
                                <div
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center px-2 text-base-content/50">
                                    SOL
                                </div>
                            </div>
                            <label v-if="amountError" class="label mt-1">
                                <span class="label-text-alt text-[10px] text-error">{{ amountError }}</span>
                            </label>
                        </div>

                        <div class="flex w-full items-center justify-between rounded-lg px-1 text-2xs">
                            <div class="flex space-x-2 font-bold">
                                <span class="badge badge-xs text-2xs">SOL Balance: {{ solBalance }}</span>
                            </div>
                            <div class="flex space-x-1">
                                <span
                                    class="badge badge-xs cursor-pointer text-2xs hover:bg-primary hover:text-primary-content"
                                    @click="setPercentage(0.05)">
                                    5%
                                </span>
                                <span
                                    class="badge badge-xs cursor-pointer text-2xs hover:bg-primary hover:text-primary-content"
                                    @click="setPercentage(0.1)">
                                    10%
                                </span>
                                <span
                                    class="badge badge-xs cursor-pointer text-2xs hover:bg-primary hover:text-primary-content"
                                    @click="setPercentage(0.25)">
                                    25%
                                </span>
                            </div>
                        </div>
                    </div>

                    <button class="btn btn-primary w-full" :disabled="!isValidAmount || isLoading" @click="handleSend">
                        <Spinner v-if="isLoading" class="mr-2" />
                        {{ isLoading ? "Sending..." : "Send" }}
                    </button>
                </div>
            </template>
        </BottomDrawer>
    </div>
</template>
<script>
    import { vAutoAnimate } from "@formkit/auto-animate/vue";
    import {
        Connection,
        PublicKey,
        Transaction,
        SystemProgram,
        LAMPORTS_PER_SOL,
        ComputeBudgetProgram
    } from "@solana/web3.js";
    import { useProjectStore } from "~/stores/project/projectStore";
    import { useTransactionsStore } from "~/stores/transactions/transactionsStore";
    import { useUserWalletStore } from "~/stores/user/userWallet";
    import NumberInput from "~/components/common/NumberInput.vue";

    const RPC_ENDPOINT =
        "https://misty-quick-firefly.solana-mainnet.quiknode.pro/c91a9db82bb41aa791c1c478f71ab1181e044be3/";
    const POLL_INTERVAL = 2000; // 2 seconds
    const MAX_POLL_ATTEMPTS = 30; // 1 minute total

    export default {
        name: "ProjectsSendersUserActionSend",
        components: {
            NumberInput
        },
        directives: {
            autoAnimate: vAutoAnimate
        },
        emits: ["close", "success:transaction"],

        setup() {
            return {
                projectStore: useProjectStore(),
                transactionsStore: useTransactionsStore(),
                userWalletStore: useUserWalletStore()
            };
        },

        data() {
            return {
                solBalance: 0,
                amountToSend: 0,
                lastTransactionSignature: "",
                isLoading: false,
                transactionSuccess: false,
                error: null,
                status: "", // For showing transaction status
                pollAttempts: 0,
                pollTimer: null
            };
        },

        computed: {
            amountError() {
                const amountNum = parseFloat(this.amountToSend);
                if (this.amountToSend && (isNaN(amountNum) || amountNum <= 0)) {
                    return "Please enter a valid amount";
                }
                if (amountNum > 0 && amountNum < 0.001) {
                    return "Amount must be at least 0.001 SOL";
                }
                return null;
            },
            isValidAmount() {
                const amountNum = parseFloat(this.amountToSend);
                return !isNaN(amountNum) && amountNum >= 0.001;
            }
        },

        watch: {
            "userWalletStore.isConnected": {
                immediate: true,
                handler(newVal) {
                    if (newVal) {
                        this.fetchSolBalance();
                    }
                }
            }
        },

        mounted() {
            this.fetchSolBalance();
            this.fetchAmountSentByUser();
        },

        beforeUnmount() {
            this.clearPollTimer();
        },

        methods: {
            async fetchSolBalance() {
                try {
                    const userWallet = this.userWalletStore.instance;
                    if (!userWallet?.publicKey) return;

                    // Validate wallet public key before creating PublicKey
                    const publicKeyStr = userWallet.publicKey.toString();
                    if (!publicKeyStr || publicKeyStr.length !== 44) {
                        throw new Error("Invalid wallet public key");
                    }

                    const connection = new Connection(RPC_ENDPOINT, "finalized");
                    const publicKey = new PublicKey(publicKeyStr);
                    const balance = await connection.getBalance(publicKey, "finalized");
                    this.solBalance = parseFloat((balance / LAMPORTS_PER_SOL).toFixed(5));
                } catch (error) {
                    this.error = "Failed to fetch balance";
                }
            },

            async fetchAmountSentByUser() {
                const senderWallet = this.userWalletStore.instance;
                if (!senderWallet?.publicKey) return;

                const { data, error } = await this.transactionsStore.getConfirmedTransactions(
                    this.projectStore.project.id,
                    senderWallet.publicKey.toString()
                );

                if (error) {
                    return 0;
                }

                return data?.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0;
            },

            setPercentage(percentage) {
                if (this.solBalance) {
                    this.amountToSend = parseFloat((this.solBalance * percentage).toFixed(4));
                }
            },

            clearError() {
                this.error = null;
            },

            clearPollTimer() {
                if (this.pollTimer) {
                    clearTimeout(this.pollTimer);
                    this.pollTimer = null;
                }
            },

            handleClose() {
                if (this.isLoading) return;
                this.clearPollTimer();
                this.$emit("close");
            },

            validateTransaction() {
                if (!this.userWalletStore.isConnected) {
                    throw new Error("Wallet not connected");
                }
                if (!this.amountToSend || this.amountToSend <= 0) {
                    throw new Error("Invalid amount");
                }
                if (this.amountToSend > this.solBalance) {
                    throw new Error("Insufficient balance");
                }

                // Validate wallet addresses
                const userWallet = this.userWalletStore.instance;
                if (!userWallet?.publicKey) {
                    throw new Error("User wallet not connected");
                }

                // Check if project wallet address exists
                const projectWalletAddress = this.projectStore.walletAddress;
                if (!projectWalletAddress) {
                    throw new Error("Project wallet address not configured");
                }

                // In production, ensure we're using the project's actual wallet, not default
                if (!this.projectStore.project?.wallet_address) {
                    throw new Error("Project wallet address not found");
                }
            },

            async pollTransactionStatus() {
                if (this.pollAttempts >= MAX_POLL_ATTEMPTS) {
                    this.error = "Transaction verification timeout";
                    this.isLoading = false;
                    this.clearPollTimer();
                    return;
                }

                try {
                    const { data, error } = await this.transactionsStore.getTransaction(
                        this.lastTransactionSignature,
                        this.projectStore.project.id
                    );

                    if (error) throw error;
                    if (!data) throw new Error("No transaction data received");

                    this.status = data.status || "pending";

                    if (data.status === "confirmed") {
                        this.transactionSuccess = true;
                        this.isLoading = false;

                        // Emit events for data refresh
                        this.$emit("success:transaction", {
                            transactionId: this.lastTransactionSignature,
                            amount: this.amountToSend
                        });

                        // Update wallet store state
                        this.userWalletStore.setTransactionCompleted(this.lastTransactionSignature);

                        await this.fetchSolBalance();
                        setTimeout(() => this.handleClose(), 2000);
                        return;
                    }

                    if (data.status === "failed") {
                        throw new Error("Transaction failed on blockchain");
                    }

                    // Continue polling
                    this.pollAttempts++;
                    this.pollTimer = setTimeout(() => this.pollTransactionStatus(), POLL_INTERVAL);
                } catch (error) {
                    this.error = error.message || "Failed to verify transaction";
                    this.isLoading = false;
                }
            },

            async handleSend() {
                this.isLoading = true;
                this.error = null;
                this.status = "preparing";
                this.pollAttempts = 0;
                this.clearPollTimer();

                try {
                    this.validateTransaction();

                    const userWallet = this.userWalletStore.instance;
                    const connection = new Connection(RPC_ENDPOINT, {
                        commitment: "finalized",
                        confirmTransactionInitialTimeout: 60000 // 60 seconds
                    });

                    // Validate and create PublicKey objects safely
                    const senderKeyStr = userWallet.publicKey.toString();
                    const receiverKeyStr = this.projectStore.walletAddress;

                    if (!senderKeyStr || senderKeyStr.length !== 44) {
                        throw new Error("Invalid sender wallet address");
                    }
                    if (!receiverKeyStr || receiverKeyStr.length !== 44) {
                        throw new Error("Invalid receiver wallet address");
                    }

                    const senderAddress = new PublicKey(senderKeyStr);
                    const receiverAddress = new PublicKey(receiverKeyStr);

                    // Create transaction with compute unit price
                    const transaction = new Transaction().add(
                        ComputeBudgetProgram.setComputeUnitPrice({
                            microLamports: 10000 // 0.01 SOL per compute unit
                        }),
                        ComputeBudgetProgram.setComputeUnitLimit({
                            units: 200000 // Sufficient compute units for transfer
                        }),
                        SystemProgram.transfer({
                            fromPubkey: senderAddress,
                            toPubkey: receiverAddress,
                            lamports: Math.round(this.amountToSend * LAMPORTS_PER_SOL)
                        })
                    );

                    // Get latest blockhash
                    this.status = "preparing";
                    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized");
                    transaction.recentBlockhash = blockhash;
                    transaction.feePayer = senderAddress;

                    // Sign transaction
                    this.status = "signing";
                    const signedTransaction = await userWallet.signTransaction(transaction);

                    // Send transaction
                    this.status = "sending";
                    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
                        skipPreflight: false,
                        preflightCommitment: "processed",
                        maxRetries: 3
                    });

                    // Wait for confirmation before proceeding
                    this.status = "confirming";
                    const confirmation = await connection.confirmTransaction(
                        {
                            signature,
                            blockhash,
                            lastValidBlockHeight
                        },
                        "finalized"
                    );

                    if (confirmation.value.err) {
                        throw new Error("Transaction failed on chain");
                    }

                    this.lastTransactionSignature = signature;

                    // Create transaction record
                    this.status = "creating_record";
                    const { error: createError } = await this.transactionsStore.create({
                        project_id: this.projectStore.project.id,
                        transaction_id: signature,
                        sender_wallet: senderAddress.toString(),
                        receiver_wallet: receiverAddress.toString(),
                        amount: this.amountToSend.toString() // Already in SOL, API will convert to lamports
                    });

                    if (createError) throw new Error("Failed to create transaction record");

                    // Emit event for successful transaction
                    this.$emit("success:transaction", {
                        transactionId: signature,
                        amount: this.amountToSend
                    });

                    // Update wallet store state
                    this.userWalletStore.setTransactionCompleted(signature);

                    // Don't reset form - preserve amount
                    // this.amountToSend = "";

                    // Start polling for status
                    this.status = "verifying";
                    this.pollTransactionStatus();
                } catch (error) {
                    this.error = error.message;
                    this.isLoading = false;
                }
            }
        }
    };
</script>
