import axios from "axios";

export default class BaseModel {
    constructor() {
        this.axios = axios;
    }
}
