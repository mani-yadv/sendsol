import * as solanaWeb3 from "@solana/web3.js";
import BaseModel from "~/resources/solana/base/BaseModel.js";

export default class AddressSignatures extends BaseModel {
    resourceUrl() {
        const runtimeConfig = useRuntimeConfig();
        return runtimeConfig.app.solanaRpcUrl;
    }

    get(tokenAddress) {
        const connection = new solanaWeb3.Connection(this.resourceUrl());
        const publicKey = new solanaWeb3.PublicKey(tokenAddress);

        // Get transaction signatures for the address
        return connection.getSignaturesForAddress(publicKey);
    }
}
