<template>
    <div class="carousel-item relative">
        <NuxtLink :to="`/${project.handle}`">
            <div class="stats min-w-[250px] shadow-lg">
                <div class="stat">
                    <div class="stat-figure text-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            class="inline-block h-8 w-8 stroke-current">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div class="stat-title text-xs font-bold">{{ project.name }}</div>
                    <div class="stat-value text-secondary">2.6M</div>
                    <div class="stat-desc">Total raised</div>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>
<script lang="ts">
    export default {
        name: "FeaturedProjectsItem",
        props: {
            project: {
                type: Object,
                required: true
            }
        }
    };
</script>
