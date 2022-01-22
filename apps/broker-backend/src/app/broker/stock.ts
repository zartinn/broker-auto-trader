import { Observable } from 'rxjs';
import WebSocket from 'websocket';
import { subscriptionQuery } from './broker-queries/subscription';
import { brokerSubscriptionUrl, brokerWsType } from './broker.constants';


export class BrokerStock {
    private ws: WebSocket.w3cwebsocket;
    private state: 'disconnected' | 'connected' = 'disconnected';
    public stock$: Observable<any>;
    
    constructor(private isin: string, private authToken: string, private portfolioId: string) {}

    init() {
        // const options: WebSocket.ClientOptions = {
        //     protocol: 'graphql-ws'
        // }
        const ws = new WebSocket.w3cwebsocket(brokerSubscriptionUrl, brokerWsType);
        const stock$ = new Observable(observer => {
          ws.onmessage = data => {
              const res = JSON.parse(data.data.toString());
              console.log('TYPE: ', res.type);
              if (res.type === 'connection_ack') {
                  console.log('SEND WATCH DATA', this.getWatchData());
                  ws.send(JSON.stringify(this.getWatchData()));
              }
              observer.next(`message: ${data.data}`)
            };
          ws.onopen = () => {
              observer.next(`open`);
              const initData = {
                  type: "connection_init",
                  payload: {
                      authToken: this.authToken
                  }
              };
              setTimeout(() => {
                  ws.send(JSON.stringify(initData));
              }, 1000);
          };
          ws.onclose = data => observer.next(`close ${data}`);
          ws.onerror = err => observer.next(`error: ${err}`);
        });
        stock$.subscribe((data: any) => {
            console.log(data)
        });
    }

    getWatchData() {
        return {
            id: 1,
            type: 'start',
            payload: {
                extensions: {},
                operationName: 'realTimeQuoteTicks',
                query: subscriptionQuery,
                variables: {
                    isins: [this.isin],
                    portfolioId: this.portfolioId
                }

            }
        }
    }
}