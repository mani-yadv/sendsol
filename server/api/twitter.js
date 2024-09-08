export default defineEventHandler(async (event) => {
    const { token, userId } = await getQuery(event);

    try {
        const response = await $fetch(`https://api.twitter.com/2/users/${userId}?user.fields=public_metrics`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;
    } catch (error) {
        return error;
    }
});
