import * as yup from "yup";
const createSchema = (supabase) => {
    return yup.object({
        name: yup.string().min(3, "Project name must be at least 3 characters").required("Project name is required"),
        handle: yup
            .string()
            .min(3, "Project handle must be at least 3 characters")
            .required("Project handle is required")
            .test("is-unique", "Handle is already in use", async (handle) => {
                if (!handle) return true; // skip validation if handle is empty
                const { data } = await supabase.from("projects").select("handle").eq("handle", handle).single();
                return !data; // return true if handle does not exist (is unique)
            }),

        isCoinProject: yup.string().required("Please specify if this is a coin project"),
        coinTicker: yup.string().required("Coin ticker is required for coin projects"),

        allocationType: yup.string().required("Allocation type is required for coin projects"),
        totalAllocatedQuantity: yup
            .number()
            .typeError("Total Allocated Quantity must be a number")
            .positive("Total Allocated Quantity must be positive")
            .required("Total Allocated Quantity is required"),
        duration: yup.string().required("Duration is required"),
        walletAddress: yup.string().required("Wallet address is required"),
        description: yup.string().max(250).required("Description is required")
    });
};

export default createSchema;
