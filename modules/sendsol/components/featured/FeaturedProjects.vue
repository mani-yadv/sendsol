<template>
    <div class="flex w-full flex-col space-y-5">
        <div class="text-xl font-bold">Featured projects</div>

        <div class="carousel carousel-center glass rounded-box w-full space-x-4 bg-primary p-4">
            <div class="carousel-item">
                <div class="stats shadow">
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
                        <div class="stat-title text-xs font-bold">SEND Token</div>
                        <div class="stat-value text-secondary">2.6M</div>
                        <div class="stat-desc">Total raised</div>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <div class="stats shadow">
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
                        <div class="stat-title text-xs font-bold">Dog wif hat</div>
                        <div class="stat-value text-secondary">2.6M</div>
                        <div class="stat-desc">Total raised</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    export default {
        name: "FeaturedProjects"
    };
</script>
