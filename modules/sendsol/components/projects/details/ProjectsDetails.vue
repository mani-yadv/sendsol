<template>
    <div>
        <div v-if="projectStore.isLoading">
            <div class="flex w-full flex-col gap-4">
                <div class="skeleton h-32 w-full" />
                <div class="skeleton h-32 w-full" />
                <div class="skeleton h-4 w-28" />
                <div class="skeleton h-4 w-full" />
                <div class="skeleton h-4 w-full" />
            </div>
        </div>
        <div v-else-if="projectStore.isError || projectStore.noDetails" class="my-10">
            <div role="alert" class="alert alert-error flex gap-1">
                <PhosphorIconWarningCircle class="animate-bounce" size="24" />
                <span class="text-sm">No project details found. Please check the url and try again.</span>
            </div>
        </div>

        <div v-else-if="projectStore.project" class="flex flex-col space-y-6">
            <div class="flex items-center justify-between space-x-2">
                <NuxtLink to="/">
                    <PhosphorIconArrowLeft class="text-primary" size="24" />
                </NuxtLink>
                <div class="flex items-center space-x-4 px-2">
                    <span class="text-lg font-bold">
                        {{ projectStore.project.name }}
                    </span>
                    <div class="flex items-center space-x-2">
                        <span 
                            @click="shareProject" 
                            class="cursor-pointer"
                        >
                            <PhosphorIconShareNetwork v-if="!isSharing" class="text-base-content/70" size="20" />
                            <span v-else class="loading loading-spinner loading-xs"></span>
                        </span>
                        <span 
                            @click="shareOnX" 
                            class="cursor-pointer"
                        >
                            <PhosphorIconXLogo class="text-base-content/70" size="20" />
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <ProjectsDetailsStats :project="projectStore.project" />
            </div>
            <div>
                <ProjectsSenders :project="projectStore.project" />
            </div>
        </div>
    </div>
</template>
<script>
    import { defineComponent } from "vue";
    import { useProjectStore } from "~/stores/project/projectStore";
    export default defineComponent({
        name: "ProjectsDetails",

        setup() {
            return {
                projectStore: useProjectStore()
            };
        },
        data() {
            return {
                projectHandle: this.projectId || this.$route.params.slug,
                isSharing: false
            };
        },

        created() {
            this.fetchProject();
        },

        methods: {
            fetchProject() {
                this.projectStore.fetchProject(this.projectHandle);
            },
            async shareProject() {
                this.isSharing = true;
                const projectUrl = `${window.location.origin}/p/${this.projectStore.project.handle}`;
                const shareData = {
                    title: `${this.projectStore.project.name} - SendSol`,
                    text: `Check out this project on SendSol: ${this.projectStore.project.name}`,
                    url: projectUrl
                };

                try {
                    // Check if Web Share API is supported (mobile devices)
                    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                        await navigator.share(shareData);
                    } else {
                        // Fallback to clipboard copy
                        await navigator.clipboard.writeText(projectUrl);
                        // Show success toast
                        this.$toast.success('Project link copied to clipboard!', {
                            position: 'bottom-center',
                            duration: 2000
                        });
                    }
                } catch (error) {
                    // If share was cancelled or clipboard failed, try clipboard as fallback
                    if (error.name !== 'AbortError') {
                        try {
                            await navigator.clipboard.writeText(projectUrl);
                            this.$toast.success('Project link copied to clipboard!', {
                                position: 'bottom-center',
                                duration: 2000
                            });
                        } catch (clipboardError) {
                            this.$toast.error('Unable to share or copy link', {
                                position: 'bottom-center',
                                duration: 2000
                            });
                        }
                    }
                } finally {
                    this.isSharing = false;
                }
            },
            shareOnX() {
                const projectUrl = `${window.location.origin}/p/${this.projectStore.project.handle}`;
                const tweetText = `🚀 Check out this amazing project: "${this.projectStore.project.name}" on @SendSol!

Support innovation on Solana 💜

${projectUrl}

#Solana #Crowdfunding #SendSol #Innovation`;

                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
                window.open(twitterUrl, '_blank', 'noopener,noreferrer');
            }
        }
    });
</script>
