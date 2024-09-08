<template>
    <div>
        <BottomDrawer @close="handleClose">
            <template #header>
                <div class="text-xl font-bold">Send SOL to this project</div>
            </template>
            <template #content>
                <div class="mt-4 flex h-full flex-col justify-end space-y-12">
                    <div>
                        <NumberInput v-model="amountToSend" />
                        <div class="flex w-full items-center justify-between rounded-lg px-1 pt-2.5 text-2xs">
                            <div class="flex space-x-2 font-bold">
                                <span class="badge badge-xs text-2xs">SOL Balance: {{ solBalance }}</span>
                            </div>
                            <div class="flex space-x-1">
                                <span class="badge badge-xs cursor-pointer text-2xs" @click="setPercentage(0.01)">
                                    1%
                                </span>
                                <span class="badge badge-xs cursor-pointer text-2xs" @click="setPercentage(0.05)">
                                    5%
                                </span>
                                <span class="badge badge-xs cursor-pointer text-2xs" @click="setPercentage(0.1)">
                                    10%
                                </span>
                            </div>
                        </div>
                    </div>

                    <button class="btn btn-primary" @click="handleSend">Send</button>
                </div>
            </template>
        </BottomDrawer>
    </div>
</template>
<script lang="ts">
    import { vAutoAnimate } from "@formkit/auto-animate/vue";
    import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
    import { useProjectStore } from "~/stores/project/projectStore";
    import { useUserWalletStore } from "~/stores/user/userWallet";

    export default {
        name: "ProjectsSendersUserActionSend",
        directives: {
            autoAnimate: vAutoAnimate
        },
        emits: ["close"],

        setup() {
            return {
                projectStore: useProjectStore(),
                userWalletStore: useUserWalletStore()
            };
        },

        data() {
            return {
                solBalance: 0,
                amountToSend: 0,
                lastTransactionSignature: ""
            };
        },

        mounted() {
            this.fetchSolBalance();
            this.fetchAmountSentByUser();
        },

        methods: {
            async fetchSolBalance() {
                const userWallet = this.userWalletStore.instance;
                const connection = new Connection(
                    "https://misty-quick-firefly.solana-mainnet.quiknode.pro/c91a9db82bb41aa791c1c478f71ab1181e044be3/",
                    "confirmed"
                );
                const publicKey = new PublicKey(userWallet.publicKey);
                const balance = await connection.getBalance(publicKey);

                console.log(`SOL balance: ${balance / LAMPORTS_PER_SOL}`);
                this.solBalance = balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
            },

            async fetchAmountSentByUser() {
                const senderWallet = this.userWalletStore.instance;

                // Fetch the amount of SOL sent to the project
                const { data, error } = await this.projectStore.fetchAmountSentByUser(
                    senderWallet.publicKey.toString()
                );

                if (error || !data?.length) {
                    console.error(error);
                }

                const totalSent = data.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
                console.log(`Total SOL sent: ${totalSent}`);

                return totalSent;
            },

            setPercentage(percentage: number) {
                const amount = this.solBalance * percentage; // Set amount to percentage of balance
                this.amountToSend = parseFloat(amount.toFixed(5)); // Round to 5 decimal places

                console.log(`Amount to send: ${this.amountToSend}`);
            },

            handleClose() {
                this.$emit("close");
            },
            handleSend() {
                if (!this.userWalletStore.isConnected) {
                    console.error(this.userWalletStore.instance);
                    this.handleClose();
                    return;
                }
                // if (!this.projectStore.walletAddress) {
                //     console.error(this.projectStore.project);
                //     this.handleClose();
                //     return;
                // }

                this.initiateTransaction();
            },

            async initiateTransaction() {
                try {
                    const connection = new Connection(
                        "https://misty-quick-firefly.solana-mainnet.quiknode.pro/c91a9db82bb41aa791c1c478f71ab1181e044be3/",
                        "confirmed"
                    );
                    const senderWallet = this.userWalletStore.instance;
                    // TODO: Replace with the project's wallet address
                    const receiverAddress = new PublicKey(this.projectStore.testProjectReceiverAddress);
                    const amountToSend = this.amountToSend * LAMPORTS_PER_SOL;

                    // Check balance before sending
                    const balance = await connection.getBalance(senderWallet.publicKey);
                    if (balance < amountToSend) {
                        console.error("Insufficient balance");
                        return;
                    }

                    const transaction = new Transaction().add(
                        SystemProgram.transfer({
                            fromPubkey: senderWallet.publicKey,
                            toPubkey: receiverAddress,
                            lamports: amountToSend
                        })
                    );

                    const { blockhash } = await connection.getLatestBlockhash("finalized");
                    transaction.recentBlockhash = blockhash;
                    transaction.feePayer = senderWallet.publicKey;

                    const signedTransaction = await senderWallet.signTransaction(transaction);
                    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
                        skipPreflight: false,
                        preflightCommitment: "confirmed"
                    });
                    this.lastTransactionSignature = signature;

                    // Insert a pending transaction record into Supabase
                    const { error: insertError } = await this.projectStore.sendSolToProjectTransaction({
                        sender_wallet: senderWallet.publicKey.toString(),
                        receiver_wallet: receiverAddress.toString(),
                        amount: amountToSend, // Amount in SOL, adjust as necessary
                        transaction_id: signature, // Transaction signature from sending the transaction
                        status: "pending"
                    });

                    if (insertError) throw insertError;

                    console.log("Transaction signature", signature);

                    // Optionally, confirm the transaction
                    await connection.confirmTransaction(signature, "confirmed");
                    console.log("Transaction confirmed");

                    // Update the transaction record in Supabase to 'confirmed'
                    const { error: updateError } = await this.projectStore.updateTransactionStatus(
                        signature,
                        "confirmed"
                    );
                    if (updateError) throw updateError;
                } catch (error) {
                    console.error("Error initiating transaction:", error);
                    // Update the transaction record in Supabase to 'failed'
                    await this.projectStore.updateTransactionStatus(this.lastTransactionSignature, "failed");
                }
            }
        }
    };
</script>
