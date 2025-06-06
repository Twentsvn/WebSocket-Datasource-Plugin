import { GSContext, PlainObject } from "@godspeedsystems/core";

export default async function(ctx: GSContext, args: PlainObject) {
    const pulkitDS = ctx.datasources['pulkit-plugin']; // Access by CONFIG_FILE_NAME

    if (!pulkitDS) {
        ctx.logger.error("Datasource 'pulkit-plugin' not found.");
        return { success: false, error: "Datasource 'pulkit-plugin' not found." };
    }

    try {
        ctx.logger.info("Initializing WebSocket datasource...");
        const initResult = await pulkitDS.initClient();
        ctx.logger.info("Init result:", initResult);
       
        // Ensure client is initialized before calling execute
        if (initResult.status !== "Client Initialised") {
            return { success: false, error: "Client failed to initialise." };
        }

        // Example payload to subscribe to BTC index price
        const payload = {
            jsonrpc: "2.0",
            id: 1,
            method: "public/subscribe",
            params: {
                channels: ["deribit_price_index.btc_usd"]
            }
        };

        ctx.logger.info("Executing WebSocket data logging...");
        const result = await pulkitDS.execute(ctx, { payload });

        return {
            success: true,
            result
        };

    } catch (error: any) {
        ctx.logger.error("Error during WebSocket data capture:", error);
        return { success: false, error: error.message, stack: error.stack };
    }
}
