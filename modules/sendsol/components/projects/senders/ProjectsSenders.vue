<template>
    <div class="flex flex-col space-y-10">
        <ProjectsSendersUserStat :project="project" @refresh:senders="handleUpdateSenders" />
        <ProjectsSendersList ref="sendersList" :project="project" />
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
