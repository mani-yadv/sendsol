import BaseModel from "~/resources/dextools/base/BaseModel.js";

export default class GainersRanking extends BaseModel {
    resourceUrl() {
        return "/ranking/solana/gainers";
    }

    get(params) {
        return this.axios.get(this.resourceUrl(), { params });
    }
}
