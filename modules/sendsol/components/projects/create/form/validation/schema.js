import * as yup from "yup";

// Debounce function to limit API calls
const debounce = (func, wait) => {
    let timeout;
    return async (...args) => {
        clearTimeout(timeout);
        return new Promise((resolve) => {
            timeout = setTimeout(async () => {
                resolve(await func(...args));
            }, wait);
        });
    };
};

// Debounced handle check
const checkHandle = debounce(async (handle, supabase) => {
    // Skip empty handles
    if (!handle) return true;

    const { data } = await supabase.from("projects").select("handle").eq("handle", handle).single();
    return !data;
}, 100); // 100ms delay

const createSchema = (supabase) => {
    return yup.object({
        name: yup.string().min(3, "Project name must be at least 3 characters").required("Project name is required"),

        handle: yup.string().required("Project handle is required"),

        // Optional URL fields
        pitchDeckUrl: yup.string().url("Must be a valid URL").nullable(),

        goalAmount: yup
            .number()
            .transform((value) => (isNaN(value) ? undefined : value))
            .positive("Must be a positive number")
            .nullable(),

        xProfileUrl: yup
            .string()
            .test("x-domain", "Must be a valid X profile URL", (value) => {
                if (!value) return true;
                return value.startsWith("https://x.com/") || value.startsWith("https://twitter.com/");
            })
            .nullable(),

        websiteUrl: yup.string().url("Must be a valid URL").nullable(),

        description: yup
            .string()
            .max(500, "Description must be less than 500 characters")
            .required("Description is required"),

        // Commented out duration validation as it's hidden in UI
        duration: yup.string().required("Duration is required"),

        walletAddress: yup.string().required("Wallet address is required")
    });
};

export default createSchema;
