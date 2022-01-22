import got from 'got';
import { logoutQuery } from './broker-queries/logout';
import { brokerLoginEndpointUrl } from './broker.constants';

export class BrokerLogout {
    private static readonly logoutUrl = brokerLoginEndpointUrl;
    public static headers: any = {
        'Content-Type': 'application/json'
    }

    constructor() {}

    static async logout(accessToken) {
        try {
            const query = logoutQuery(accessToken);
            BrokerLogout.headers.authorization = `Bearer ${accessToken}`;
            BrokerLogout.headers['Content-Length'] = Buffer.byteLength(query, 'utf-8');
            const res = await got.post(BrokerLogout.logoutUrl, { headers: BrokerLogout.headers, body: query });
            return res.body;
        } catch (e) {
            return { error: JSON.stringify(e)};
        }
    }
}