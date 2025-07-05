<template>
    <div>
        <div class="stat-figure">
            <div class="flex items-center space-x-2">
                <SVGSolanaOutline class="text-primary" width="14" />
                <div class="stat-value text-base text-primary">{{ totalRaised }}</div>
            </div>
            <div class="stat-desc flex items-center justify-end space-x-1">
                <PhosphorIconUsers size="12" />
                <span>{{ project.unique_senders || 0 }}</span>
            </div>
        </div>
        <NuxtLink :to="`/${project.handle}`">
            <div class="flex items-center gap-2">
                <div class="size-6">
                    <UserAvatar
                        :user="{
                            avatar: project.creator_image,
                            name: project.creator_name
                        }"
                        :external-profile-link="project.creator_x_url"
                        show-online-status />
                </div>
                <div class="stat-title text-sm font-bold underline">
                    {{ project.name }}
                </div>
            </div>
        </NuxtLink>
        <div v-if="false && project.is_coin_project" class="stat-desc mt-1 flex items-center space-x-1.5">
            <PhosphorIconCoins size="12" />
            <span>
                {{ totalAllocatedQuantity }}
            </span>

            <!--Link opens separately-->
            <span v-if="project.coin_ticker" class="text-secondary">
                {{ project.coin_ticker }}
            </span>
        </div>
        <div class="stat-desc m-1 flex items-center space-x-1">
            <PhosphorIconXLogo size="12" />
            <NuxtLink :to="`${project.creator_x_url}`" class="pb-0.5" target="_blank">
                <span>{{ project.creator_handle }}</span>
            </NuxtLink>
        </div>
    </div>
</template>
<script>
    import NumberHelper from "~/helpers/NumberHelper";

    export default {
        name: "ProjectsListItem",
        props: {
            project: {
                type: Object,
                required: true
            }
        },

        computed: {
            totalAllocatedQuantity() {
                return NumberHelper.formatKMB(this.project.total_allocated_quantity);
            },

            totalRaised() {
                return NumberHelper.formatSol(this.project.total_raised);
            }
        }
    };
</script>
