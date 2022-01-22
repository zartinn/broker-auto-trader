import { Express } from 'express';
import { BrokerLogout } from '../broker/logout';

export function defineLogout(app: Express) {
    app.post('/logout', async (req, res) => {
        if (!app.locals.accessToken) {
            res.send({ error: 'already logged out. No access Token saved'});
            return;
        }
        const logoutResponse: any = await BrokerLogout.logout(app.locals.accessToken);
        const data = JSON.parse(logoutResponse);
        if (Array.isArray(data) && data[0]?.data?.revokeAccessToken === null) {
            const userId = app.locals.userId;
            app.locals.userId = null;
            app.locals.accessToken = null;
            res.send({ message: `successfully logged out for ${userId}`});

        } else {
            res.send({ message: 'logout not successful', error: logoutResponse})
        }
    })
}