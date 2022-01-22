import { Express } from 'express';
import { BrokerLogin } from '../broker/login';

export function defineLogin(app: Express) {
    app.post('/login', async (req, res) => {
        if (req.body && req.body.username && req.body.password) {
            const loginResponse: any = await BrokerLogin.login(req.body);
            if (loginResponse.error) {
                res.send(loginResponse);
                return;
            }
            app.locals.userId = loginResponse.userId;
            app.locals.accessToken = loginResponse.accessToken;
            app.locals.portfolioId = loginResponse.portfolioId;

            res.send({ message: `Login successful for ${req.body.username}`, accessToken: app.locals.accessToken, portfolioId: app.locals.portfolioId });
        } else {
            res.send({ error: 'body needs to have username and password as property'});
        }
    })
}