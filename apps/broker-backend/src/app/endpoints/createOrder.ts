import { Express } from 'express';
import { BrokerCreateOrder } from '../broker/createOrder';

export function defineCreateOrder(app: Express) {
    app.post('/createOrder', async (req, res) => {
        if (!app.locals.userId || !app.locals.accessToken) {
            res.send({ error: 'Login first.' });
        }

        if (validateBody(req.body)) {
            const input: any = req.body;
            const orderResponse: any = await BrokerCreateOrder.createOrder(input, app.locals.portfolioId, app.locals.accessToken);
            if (orderResponse.error) {
                res.send(orderResponse);
                return;
            }
            res.send({ message: `Order created successfully`, res: orderResponse });
        } else {
            res.send({ error: 'No valid order information provided' });
        }
    })
}

function validateBody(body) {
    return body && body.isin && body.side && body.numberOfShares && body.currency && body.venue;
}