import classes from './app.module.scss';

import { ReactComponent as Logo } from './logo.svg';
import star from './star.svg';
import { Observable } from 'rxjs';
import { useRef } from 'react';

const headers = new Headers();

export function App() {
  const mailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const isinRef = useRef<HTMLInputElement>();
  let accessToken;
  let userId;


  async function login() {
    const loginData = { username: mailRef.current.value, password: passwordRef.current.value };
    const res = await fetch('http://localhost:3333/login', { method: 'POST', body: JSON.stringify(loginData), headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    const data = await res.json();
    console.log('LOGIN: ', data);
    accessToken = data.accessToken;
    userId = data.userId;
  }

  async function logout() {
    const res = await fetch('http://localhost:3333/logout', { method: 'POST' });
    console.log('LOGOUT: ', await res.json());
  }

  async function stock() {

    // const ws = new WebSocket('wss://de.scalable.capital/broker/subscriptions/', 'graphql-ws');
    // ws.binaryType = 'blob';
    // const stock$ = new Observable(observer => {
    //   ws.onmessage = data => observer.next(`message: ${data}`);
    //   ws.onopen = evt => {
    //       observer.next(`open ${evt}`);
    //       const initData = {
    //           type: "connection_init",
    //           payload: {
    //               authToken: accessToken
    //           }
    //       };
    //       setTimeout(() => {
    //           ws.send(JSON.stringify(initData));
    //       }, 1000);
    //   };
    //   ws.onclose = data => observer.next(`close ${data}`);
    //   ws.onerror = err => observer.next(`error: ${err}`);
    // });

    // stock$.subscribe(data => console.log(data));

    const res = await fetch('http://localhost:3333/stock', { method: 'POST', body: JSON.stringify({isin: isinRef.current.value}) });
    console.log('STOCK: ', await res.json());
  }

  async function createOrder() {
    const input = {
      isin: isinRef.current.value,
      side: "SELL",
      numberOfShares: 15,
      currency: "EUR",
      venue: "MUNC"
  }
    const res = await fetch('http://localhost:3333/createOrder', { method: 'POST', body: JSON.stringify(input), headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    console.log('SELL: ', await res.json());
  }

  return (
    <div className={classes.app}>
      <div className="login">
        <span>Login:</span>
        <input ref={mailRef} placeholder="example@email.com" type="email"></input>
        <input ref={passwordRef} placeholder="password" type="password"></input>
        <input ref={isinRef} placeholder="isin" type="text"></input>
        <button onClick={login}>login</button>
        <button onClick={logout}>logout</button>
        <button onClick={stock}>stock subscribe</button>
        <button onClick={createOrder}>create order</button>
      </div>  
    </div>
  );
}

export default App;
