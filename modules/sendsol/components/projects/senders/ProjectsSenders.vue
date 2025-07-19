<template>
    <div class="flex flex-col space-y-10">
        <ProjectsSendersUserStat :project="project" @refresh:senders="handleUpdateSenders" />
        <ProjectsSendersList ref="sendersList" :project="project" />

        <div class="my-2">
            <!-- Project Info -->
            <div class="card bg-base-200">
                <div class="card-body">
                    <h3 class="card-title text-sm">Project Details</h3>
                    <p class="text-xs" v-text="formatDescription" />

                    <!-- Project Links -->
                    <div class="mt-4 flex gap-4">
                        <a v-if="project.website_url" :href="project.website_url" target="_blank">
                            <div class="flex items-center space-x-0.5">
                                <PhosphorIconGlobe size="12" />
                                <span class="text-xs">Website</span>
                            </div>
                        </a>
                        <a v-if="project.pitch_deck_url" :href="project.pitch_deck_url" target="_blank">
                            <div class="flex items-center space-x-0.5">
                                <PhosphorIconPresentation size="12" />
                                <span class="text-xs">Pitch Deck</span>
                            </div>
                        </a>
                        <a v-if="project.x_profile_url" :href="project.x_profile_url" target="_blank">
                            <div class="flex items-center space-x-0.5">
                                <PhosphorIconXLogo size="12" />
                                <span class="text-xs">Profile</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { defineComponent } from "vue";

    export default defineComponent({
        name: "ProjectsSenders",
        props: {
            project: {
                type: Object,
                required: true
            }
        },
        computed: {
            formatDescription() {
                // Respect line breaks
                // TODO: replace it with markdown
                const sanitizedDescription = this.project.description
                    .replace(/<script>/g, "&lt;script&gt;")
                    .replace(/<script>/g, "&lt;script&gt;");
                return sanitizedDescription.replace(/\n/g, "<br>");
            }
        },

        methods: {
            handleUpdateSenders() {
                if (this.$refs.sendersList) {
                    this.$refs.sendersList.fetchTotalSenders();
                    this.$refs.sendersList.fetchTransactions();
                }
            }
        }
    });
</script>

<style scoped></style>
