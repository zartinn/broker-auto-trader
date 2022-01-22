import got from 'got';
import cheerio from 'cheerio';
import { brokerPortfoliosQuery } from './broker-queries/brokerportfolios';
import { brokerDashboardUrl, brokerLoginUrl, brokerLoginEndpointUrl } from './broker.constants';

export class BrokerLogin {
    private static readonly loginUrl = brokerLoginUrl;
    private static readonly dashboardUrl = brokerDashboardUrl;
    private static readonly loginEndpointUrl = brokerLoginEndpointUrl;
    public static accessToken;
    public static userId;
    public static headers: any = {
        'Content-Type': 'application/json'
    }

    constructor() {}

    static async login(body) {
        try {
            const res = await got.post(BrokerLogin.loginUrl, { body: JSON.stringify(body), headers: BrokerLogin.headers });
            if (res.body && typeof res.body === 'string') {
                BrokerLogin.accessToken = JSON.parse(res.body)[0].accessToken;
                BrokerLogin.headers.cookie = `access_token=${BrokerLogin.accessToken}`;
                BrokerLogin.userId = await BrokerLogin.getUserId();
                if (BrokerLogin.userId) {
                    const query = brokerPortfoliosQuery(BrokerLogin.userId);
                    BrokerLogin.headers.authorization = `Bearer ${BrokerLogin.accessToken}`;
                    BrokerLogin.headers['Content-Length'] = Buffer.byteLength(query, 'utf-8');
                    const res2 = await got.post(BrokerLogin.loginEndpointUrl, { headers: BrokerLogin.headers, body: query });
                    const portfolioId = JSON.parse(res2.body)[0].data.account.brokerPortfolios[0].id;
                    return { userId: BrokerLogin.userId, accessToken: BrokerLogin.accessToken, portfolioId };
                } else {
                    return { error: 'Parsed userId is undefined' };
                }
            } else {
                return { error: 'Could not retrieve access token from body' }
            }
        } catch (e) {
            return { error: e};
        }
    }

    static async getUserId() {
        const res = await got(BrokerLogin.dashboardUrl, { headers: BrokerLogin.headers });
        if (res.body && typeof res.body === 'string') {
            const $ = cheerio.load(res.body);
            const scriptTag = $('#__NEXT_DATA__').toString();
            const extractedJson = scriptTag.match(/{.*}/gm);
            if (extractedJson.length > 0) {
                const json = JSON.parse(extractedJson[0]);
                const userId = json.props?.pageProps?.middlewareProps?.m3?.session?.user?.userId;
                return userId;
            } else {
                return { error: "Could not extract json from __DATA__ script tag" }
            }
        } else {
            return { error: `Could not read HTML body from ${BrokerLogin.dashboardUrl}`}
        }
    }
}