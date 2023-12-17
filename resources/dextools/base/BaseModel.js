/* global  */
import axios from "axios";

export default class BaseModel {
    constructor() {
        const runtimeConfig = useRuntimeConfig();

        this.axios = axios.create({
            baseURL: "https://open-api.dextools.io/free/v2",
            headers: {
                "X-BLOBR-KEY": runtimeConfig.app.dextoolApiKey
            }
        });
    }
}
