const ApiService = Shopware.Classes.ApiService;

export default class CoinchargeBtcpayApiService extends ApiService {
    constructor(httpClient, loginService, apiEndpoint = 'btcpay') {
        super(httpClient, loginService, apiEndpoint);
    }
    verifyApiKey() {
        const apiRoute = `/_action/${this.getApiBasePath()}/verify`;
        const headers = this.getBasicHeaders()

        return this.httpClient.get(
            apiRoute, { headers }
        ).then((response) => {
            return ApiService.handleResponse(response);
        });
    }
    generateWebhook() {
        const apiRoute = `/_action/${this.getApiBasePath()}/webhook`;

        return this.httpClient.post(apiRoute, {}, { headers: this.getBasicHeaders() }
        ).then((response) => {
            return ApiService.handleResponse(response);
        }).catch((error) => {
            console.error("Webhook couldn't be created: " + error.message);
            throw error;
        });
    }
}
