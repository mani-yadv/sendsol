<template>
    <div>
        <!-- Form -->
        <VeeForm :validation-schema="validationSchema" @submit="handleSubmit">
            <div class="z-10 flex w-full flex-col gap-1">
                <label class="form-control h-32 w-full">
                    <span class="label">
                        <span class="label-text font-bold">Name your project</span>
                    </span>
                    <VeeField
                        v-model.trim="input.name"
                        as="input"
                        name="name"
                        placeholder="Dog wif hat"
                        class="input input-bordered" />
                    <VeeErrorMessage name="name" class="m-2 text-xs text-error/75" />
                </label>

                <label class="form-control w-full" :class="input.handle ? 'min-h-32' : 'h-36'">
                    <span class="label">
                        <span class="label-text font-bold">Choose project page handle</span>
                    </span>
                    <VeeField
                        v-model.trim="input.handle"
                        as="input"
                        name="handle"
                        placeholder="dog_wif_hat"
                        class="input input-bordered" />
                    <VeeErrorMessage name="handle" class="m-2 text-xs text-error/75" />

                    <span class="m-3 text-right text-2xs">
                        <span v-show="input.handle">
                            Project url
                            <span class="break-words text-info/90">
                                {{ projectUrl }}
                            </span>
                        </span>
                    </span>
                </label>

                <label class="form-control h-32 w-full">
                    <span class="label">
                        <span class="label-text font-bold">Are you allocating coins to senders?</span>
                    </span>
                    <VeeField
                        v-model="input.isCoinProject"
                        as="select"
                        class="select select-bordered"
                        name="isCoinProject">
                        <option disabled value="">Please select an option</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </VeeField>
                    <VeeErrorMessage name="isCoinProject" class="m-2 text-xs text-error/75" />
                </label>

                <label v-if="isCoinProject" class="form-control h-32 w-full">
                    <span class="label">
                        <span class="label-text font-bold">Ticker of the coin allocated</span>
                    </span>

                    <VeeField
                        v-model.trim="input.coinTicker"
                        as="input"
                        name="coinTicker"
                        placeholder="wif"
                        class="input input-bordered" />
                    <VeeErrorMessage name="coinTicker" class="m-2 text-xs text-error/75" />
                </label>

                <label v-if="isCoinProject" class="form-control h-32 w-full">
                    <span class="label">
                        <span class="label-text font-bold">Coin allocation type</span>
                    </span>

                    <VeeField
                        v-model="input.allocationType"
                        as="select"
                        class="select select-bordered"
                        name="allocationType">
                        <option disabled value="">Select how you want to distribute coins allocation</option>
                        <option value="proportionate">Proportionate to SOL Sent</option>
                        <option value="fixed">Fixed allocation per Sender</option>
                        <option value="not_revealed">Allocation details not revealed</option>
                    </VeeField>
                    <VeeErrorMessage name="allocationType" class="m-2 text-xs text-error/75" />
                </label>

                <label
                    v-if="isCoinProject"
                    class="form-control w-full"
                    :class="input.totalAllocatedQuantity ? 'min-h-32' : 'h-36'">
                    <span class="label">
                        <span class="label-text font-bold">Total allocated coins (for all senders)</span>
                    </span>

                    <VeeField
                        v-model="input.totalAllocatedQuantity"
                        as="input"
                        type="number"
                        min="0"
                        name="totalAllocatedQuantity"
                        placeholder="20000000"
                        class="input input-bordered" />
                    <VeeErrorMessage name="totalAllocatedQuantity" class="m-2 text-xs text-error/75" />

                    <span v-if="input.totalAllocatedQuantity" class="label mx-2 mt-1 flex justify-end">
                        <span class="label-text-alt">
                            Formatted: {{ input.totalAllocatedQuantity.toLocaleString() }}
                        </span>
                    </span>
                </label>

                <label class="form-control h-32 w-full">
                    <span class="label">
                        <span class="label-text font-bold">SOL Transfer Duration</span>
                    </span>
                    <VeeField v-model="input.duration" as="select" class="select select-bordered" name="duration">
                        <option disabled value="">Select the duration of this project</option>
                        <option value="1">1 week</option>
                        <option value="2">2 weeks</option>
                        <option value="3">3 weeks</option>
                        <option value="4">4 weeks</option>
                    </VeeField>

                    <VeeErrorMessage name="duration" class="m-2 text-xs text-error/75" />
                </label>

                <label class="form-control h-32 w-full">
                    <span class="label">
                        <span class="label-text font-bold">Wallet to receive SOL</span>
                    </span>

                    <span class="w-full">
                        <WalletConnect class="mt-2" />
                    </span>

                    <VeeField v-model.trim="input.walletAddress" as="input" type="hidden" name="walletAddress" />
                    <VeeErrorMessage name="walletAddress" class="m-2 text-xs text-error/75" />
                </label>

                <label class="form-control w-full">
                    <span class="label">
                        <span class="label-text font-bold">
                            Describe your project
                            <span v-if="false" class="text-2xs font-medium">(optional)</span>
                        </span>
                    </span>

                    <VeeField
                        v-model="input.description"
                        as="textarea"
                        name="description"
                        placeholder="You can include project description and any relevant links here"
                        class="min-h-24 textarea textarea-bordered max-h-36" />
                    <VeeErrorMessage name="description" class="m-2 text-xs text-error/75" />
                    <span class="label flex justify-end">
                        <span class="label-text-alt" :class="{ 'text-error': input.description.length > 250 }">
                            {{ input.description.length }}
                        </span>
                        <span class="label-text-alt">/ 250</span>
                    </span>
                </label>
            </div>

            <div v-if="userStore.authenticated" class="z-20">
                <div class="fixed inset-x-0 bottom-0 border-t border-neutral bg-base-300 p-8 shadow-lg">
                    <div class="mx-auto flex max-w-md flex-col items-center space-y-2">
                        <span v-if="state.error" class="mx-2 text-2xs text-error">
                            Something went wrong. Please report this issue to the team.
                        </span>

                        <button class="btn btn-outline btn-primary w-full" :disabled="state.loading">
                            <span v-if="state.loading" class="loading loading-spinner loading-sm" />
                            Create project
                        </button>
                    </div>
                </div>
            </div>
        </VeeForm>
    </div>
</template>

<script lang="ts">
    import { useWallet } from "solana-wallets-vue";
    import { defineComponent } from "vue";
    import createSchema from "./validation/schema";
    import { useUserStore } from "~/stores/user/userStore";
    import { useProjectStore } from "~/stores/project/projectStore";

    export default defineComponent({
        name: "ProjectsCreateForm",
        setup() {
            return {
                userStore: useUserStore(),
                projectStore: useProjectStore(),
                supabase: useSupabaseClient()
            };
        },
        data() {
            return {
                input: {
                    name: "",
                    handle: "",
                    isCoinProject: "true",
                    coinTicker: "",
                    allocationType: "",
                    totalAllocatedQuantity: "",
                    duration: "",
                    walletAddress: "",
                    description: ""
                },
                wallet: {
                    connected: false,
                    instance: null as any | null
                },
                state: {
                    loading: false,
                    error: false
                }
            };
        },

        computed: {
            projectUrl() {
                // Use handle for creating project url
                // only letters numbers and underscores can be used
                const handle = this.input.handle.replace(/[^a-zA-Z0-9_]/g, "");
                const currentDomain = window.location.hostname;
                return `https://${currentDomain}/${handle}`;
            },
            isCoinProject() {
                return this.input.isCoinProject === "true";
            },
            validationSchema() {
                if (this.isCoinProject) {
                    return createSchema(this.supabase);
                }
                return createSchema(this.supabase).omit(["coinTicker", "allocationType", "totalAllocatedQuantity"]);
            }
        },

        watch: {
            "input.handle": {
                handler() {
                    this.input.handle = this.input.handle.toLowerCase();
                }
            },
            "wallet.connected": {
                handler() {
                    if (this.wallet.connected) {
                        this.input.walletAddress = this.wallet.instance?.toString() || "";
                    } else {
                        this.input.walletAddress = "";
                    }
                }
            }
        },

        mounted() {
            const { connected, publicKey } = useWallet();
            this.wallet.connected = connected;
            this.wallet.instance = publicKey;
        },

        methods: {
            handleSubmit() {
                this.state.loading = true;
                this.projectStore
                    .createProject(this.getParams())
                    .then(() => {
                        this.handleSuccess();
                    })
                    .catch(() => {
                        this.state.error = true;
                    })
                    .finally(() => {
                        this.state.loading = false;
                    });
            },

            handleSuccess() {
                if (this.projectStore.project?.handle) {
                    const handle = this.projectStore.project.handle;

                    const runtimeConfig = useRuntimeConfig();
                    window.location.href = `${runtimeConfig.app.url}/${handle}`;
                }
            },

            getParams() {
                if (!this.isCoinProject) {
                    return {
                        ...this.getDefaultParams(),
                        ...this.getDurationParams()
                    };
                }

                return {
                    ...this.getDefaultParams(),
                    ...this.getCoinParams(),
                    ...this.getWalletParams(),
                    ...this.getDurationParams()
                };
            },

            getDefaultParams() {
                return {
                    name: this.input.name,
                    handle: this.input.handle,
                    is_coin_project: this.input.isCoinProject,
                    description: this.input.description
                };
            },

            getCoinParams() {
                return {
                    // remove dollar from start of string
                    coin_ticker: this.input.coinTicker.replace(/^\$/, ""),
                    allocation_type: this.input.allocationType,
                    total_allocated_quantity: this.input.totalAllocatedQuantity
                };
            },

            getWalletParams() {
                return {
                    wallet_address: this.input.walletAddress
                };
            },

            getDurationParams() {
                const duration = parseInt(this.input.duration);
                const startDate = new Date();
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + duration * 7);

                return {
                    start_date: startDate,
                    end_date: endDate
                };
            }
        }
    });
</script>

<style scoped></style>
