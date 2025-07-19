<template>
    <div>
        <!-- Form -->
        <VeeForm
            ref="form"
            :validation-schema="validationSchema"
            :validate-on-mount="false"
            @submit="handleSubmit"
            @invalid-submit="handleInvalidSubmit">
            <div class="z-10 flex w-full flex-col gap-1">
                <label class="form-control h-32 w-full">
                    <span class="label">
                        <span class="label-text font-bold">Name your project</span>
                    </span>
                    <VeeField
                        v-model.trim="input.name"
                        as="input"
                        name="name"
                        placeholder="ie. SendSol AI"
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
                        type="text"
                        class="input input-bordered w-full"
                        placeholder="project-handle"
                        @input="handleHandleInput" />
                    <VeeErrorMessage name="handle" class="m-2 text-xs text-error/75" />
                    <div v-if="handleFieldError" class="m-2 text-xs text-error/75">{{ handleFieldError }}</div>

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
                        <span class="label-text font-bold">Pitch Deck Link</span>
                        <span class="label-text-alt">(Optional)</span>
                    </span>
                    <VeeField
                        v-model.trim="input.pitchDeckUrl"
                        as="input"
                        name="pitchDeckUrl"
                        placeholder="https://example.com/pitch"
                        class="input input-bordered" />
                    <VeeErrorMessage name="pitchDeckUrl" class="m-2 text-xs text-error/75" />
                </label>

                <label class="form-control h-32 w-full">
                    <span class="label">
                        <span class="label-text font-bold">Goal Amount (SOL)</span>
                        <span class="label-text-alt">(Optional)</span>
                    </span>
                    <VeeField
                        v-model.trim="input.goalAmount"
                        as="input"
                        type="number"
                        step="0.0001"
                        min="0"
                        name="goalAmount"
                        placeholder="Enter goal amount in SOL"
                        class="input input-bordered" />
                    <VeeErrorMessage name="goalAmount" class="m-2 text-xs text-error/75" />
                </label>

                <label class="form-control h-32 w-full">
                    <span class="label">
                        <span class="label-text font-bold">X Profile Link</span>
                        <span class="label-text-alt">(Optional)</span>
                    </span>
                    <VeeField
                        v-model.trim="input.xProfileUrl"
                        as="input"
                        name="xProfileUrl"
                        placeholder="https://x.com/elon"
                        class="input input-bordered" />
                    <VeeErrorMessage name="xProfileUrl" class="m-2 text-xs text-error/75" />
                </label>

                <label class="form-control h-32 w-full">
                    <span class="label">
                        <span class="label-text font-bold">Project Website</span>
                        <span class="label-text-alt">(Optional)</span>
                    </span>
                    <VeeField
                        v-model.trim="input.websiteUrl"
                        as="input"
                        name="websiteUrl"
                        placeholder="https://example.com"
                        class="input input-bordered" />
                    <VeeErrorMessage name="websiteUrl" class="m-2 text-xs text-error/75" />
                </label>

                <div>
                    <label class="form-control w-full">
                        <span class="label">
                            <span class="label-text font-bold">Duration</span>
                        </span>
                        <VeeField v-model="input.duration" as="select" class="select select-bordered" name="duration">
                            <option disabled value="">Select project duration</option>
                            <option value="1">1 Week</option>
                            <option value="2">2 Weeks</option>
                            <option value="3">3 Weeks</option>
                            <option value="4">1 Month</option>
                        </VeeField>
                        <VeeErrorMessage name="duration" class="m-2 text-xs text-error/75" />
                    </label>

                    <!-- Hidden duration field to maintain form validation -->
                    <VeeField v-model="input.duration" name="duration" type="hidden" />
                </div>

                <label class="form-control w-full pt-4">
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
                        class="textarea textarea-bordered max-h-36 min-h-24" />
                    <VeeErrorMessage name="description" class="m-2 text-xs text-error/75" />
                    <span class="label flex justify-end">
                        <span class="label-text-alt" :class="{ 'text-error': input.description.length > 250 }">
                            {{ input.description.length }}
                        </span>
                        <span class="label-text-alt">/ 250</span>
                    </span>
                </label>

                <label class="form-control h-32 w-full">
                    <span class="label">
                        <span class="label-text font-bold">Wallet to receive SOL</span>
                    </span>

                    <span class="flex w-full justify-center">
                        <WalletConnect class="mt-2 rounded-xl border border-primary/25" />
                    </span>

                    <VeeField v-model.trim="input.walletAddress" as="input" type="hidden" name="walletAddress" />
                    <VeeErrorMessage name="walletAddress" class="m-2 text-xs text-error/75" />
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

<script>
    import { useWallet } from "solana-wallets-vue";
    import { defineComponent } from "vue";
    import debounce from "lodash/debounce";
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
                    pitchDeckUrl: "",
                    goalAmount: "",
                    xProfileUrl: "",
                    websiteUrl: "",
                    duration: "",
                    walletAddress: "",
                    description: ""
                },
                wallet: {
                    connected: false,
                    instance: null
                },
                state: {
                    loading: false,
                    error: false
                },
                handleFieldError: null
            };
        },

        computed: {
            projectUrl() {
                const currentDomain = window.location.hostname;
                const handle = this.input.handle || "";
                return `https://${currentDomain}/${handle}`;
            },
            validationSchema() {
                return createSchema(this.supabase).omit([
                    "coinTicker",
                    "allocationType",
                    "totalAllocatedQuantity",
                    "isCoinProject"
                ]);
            }
        },

        watch: {
            "wallet.connected": {
                handler() {
                    if (this.wallet.connected) {
                        this.input.walletAddress = this.wallet.instance?.toString() || "";
                    } else {
                        this.input.walletAddress = "";
                    }
                }
            },

            "input.handle": {
                handler() {
                    this.input.handle = this.input.handle.toLowerCase();
                }
            }
        },

        mounted() {
            const { connected, publicKey } = useWallet();
            this.wallet.connected = connected;
            this.wallet.instance = publicKey;
        },

        methods: {
            handleHandleInput: debounce(async function handleHandleInputFn() {
                const handle = this.input.handle;

                // Reset error
                this.handleFieldError = null;

                // Skip empty handles
                if (!handle) return;

                // Basic validations
                if (handle.length < 3) {
                    this.handleFieldError = "Project handle must be at least 3 characters";
                    return;
                }

                if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
                    this.handleFieldError = "Only letters, numbers and underscore allowed";
                    return;
                }

                // Check uniqueness
                const { data } = await this.supabase.from("projects").select("handle").eq("handle", handle).single();

                if (data) {
                    this.handleFieldError = "Handle is already in use";
                }
            }, 300),

            scrollToError() {
                // Try to find either custom handle error or VeeValidate error
                const errorElement = document.querySelector('[class*="text-error"]');

                if (errorElement) {
                    // Find the closest input field to highlight
                    const inputField = errorElement.closest("label")?.querySelector("input, select, textarea");
                    if (inputField) {
                        inputField.focus();
                    }

                    // Smooth scroll with offset for better visibility
                    errorElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            },

            handleInvalidSubmit() {
                this.scrollToError();
            },

            async handleSubmit() {
                try {
                    // Run handle validation one last time
                    await this.handleHandleInput();

                    if (this.handleFieldError) {
                        this.scrollToError();
                        return;
                    }

                    // Validate other fields
                    const result = await this.$refs.form?.validate();
                    if (!result?.valid) {
                        this.scrollToError();
                        return;
                    }

                    this.state.loading = true;
                    await this.projectStore.createProject(this.getParams());

                    if (this.projectStore.project?.handle) {
                        window.location.href = `/${this.projectStore.project.handle}`;
                    }
                } catch (error) {
                    this.state.error = true;
                    this.state.loading = false;
                }
            },

            getParams() {
                return {
                    ...this.getDefaultParams(),
                    ...this.getDurationParams()
                };
            },

            getDefaultParams() {
                return {
                    name: this.input.name,
                    handle: this.input.handle,
                    pitch_deck_url: this.input.pitchDeckUrl || null,
                    goal_amount: this.input.goalAmount ? parseFloat(this.input.goalAmount) : null,
                    x_profile_url: this.input.xProfileUrl || null,
                    website_url: this.input.websiteUrl || null,
                    description: this.input.description,
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
