import got from 'got';
import { createOrder } from './broker-queries/createOrder';
import { brokerCreateOrderUrl } from './broker.constants';

export class BrokerCreateOrder {
    private static readonly createOrderUrl = brokerCreateOrderUrl;
    public static headers: any = {
        'Content-Type': 'application/json'
    }

    constructor() {}

    static async createOrder(input, portfolioId, accessToken) {
        try {
            const query = createOrder(portfolioId, input);
            console.log('QUERY: ', query);
            BrokerCreateOrder.headers.authorization = `Bearer ${accessToken}`;
            BrokerCreateOrder.headers['Content-Length'] = Buffer.byteLength(query, 'utf-8');
            const res = await got.post(BrokerCreateOrder.createOrderUrl, { headers: BrokerCreateOrder.headers, body: query });
            return res.body;
        } catch (e) {
            return { error: JSON.stringify(e)};
        }
    }
}