import { Express } from 'express';
import { BrokerStock } from '../broker/stock';

export function defineStock(app: Express) {
    app.post('/stock', async (req, res) => {
        if (!app.locals.accessToken || !app.locals.userId) {
            res.send({ error: 'AccessToken or UserId is not saved. Cannot subscribe to stock'});
            return;
        }
        const stock = new BrokerStock(req.body.isin, app.locals.accessToken, app.locals.portfolioId);
        stock.init();
        res.send({ message: `Successfully subscribed to stock`});
    })
}