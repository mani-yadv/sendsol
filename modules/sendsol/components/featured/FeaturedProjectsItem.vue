<template>
    <div class="carousel-item relative">
        <NuxtLink :to="`/${project.handle}`">
            <div class="stats min-w-[250px] shadow-lg">
                <div class="stat">
                    <div class="stat-figure text-secondary">
                        <div class="size-12">
                            <UserAvatar
                                :user="{
                                    avatar: project.creator_image,
                                    name: project.creator_name
                                }"
                                :external-profile-link="project.creator_x_url"
                                show-online-status />
                        </div>
                    </div>
                    <div class="stat-title flex items-center gap-1 text-xs font-bold">
                        <span>{{ project.name }}</span>
                        <PhosphorIconCheckCircle class="text-primary" size="12" />
                    </div>
                    <div class="stat-value text-secondary">{{ numberHelper.formatSol(project.total_raised) }}</div>
                    <div class="stat-desc">Total raised</div>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>

<script>
    import NumberHelper from "~/helpers/NumberHelper";

    export default {
        name: "FeaturedProjectsItem",
        props: {
            project: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                numberHelper: NumberHelper
            };
        }
    };
</script>
