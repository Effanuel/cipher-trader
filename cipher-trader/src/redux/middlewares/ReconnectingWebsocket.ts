/* eslint-disable @typescript-eslint/no-empty-function */
//@ts-nocheck
import chalk from 'chalk';
// import WebSocket from 'ws';

function logg(arg1: any = '', arg2: any = '') {
  const prefix = `[${new Date().toLocaleTimeString()}]`;
  console.log(`${prefix} ${chalk.blueBright('Websocket')} ${chalk.grey(arg1)} ${chalk.greenBright(arg2)}`);
}

/**
 * Forked from https://github.com/daviddoran/typescript-reconnecting-websocket
 */
export class ReconnectingWebSocket {
  //These can be altered by calling code
  public debug = false;
  //Time to wait before attempting reconnect (after close)
  public reconnectInterval = 1000;
  //Time to wait for WebSocket to open (before aborting and retrying)
  public timeoutInterval = 2000;
  //Should only be used to read WebSocket readyState
  public readyState: number;
  //Whether WebSocket was forced to close by this client
  private forcedClose = false;
  //Whether WebSocket opening timed out
  private timedOut = false;
  //List of WebSocket sub-protocols
  private protocols: string[] = [];
  //The underlying WebSocket
  private ws?: WebSocket;
  private url: string;
  public opened = false;
  // Has been opened atleast once
  private hasOpened = false;
  /**
   * Setting this to true is the equivalent of setting all instances of ReconnectingWebSocket.debug to true.
   */
  public static debugAll = false;
  //Set up the default 'noop' event handlers
  public onopen = (_event: WebSocket.OpenEvent) => {};
  public onclose = (_event: WebSocket.CloseEvent) => {};
  public onconnecting = () => {};
  public onmessage = (_event: WebSocket.MessageEvent) => {};
  public onerror = (_event: WebSocket.ErrorEvent) => {};

  constructor(url: string, protocols: string[] = []) {
    this.url = url;
    this.protocols = protocols;
    this.readyState = WebSocket.CONNECTING;
    this.connect(false);
  }

  public connect = (reconnectAttempt: boolean) => {
    console.log(this.url, 'URL');
    this.ws = new WebSocket(this.url, this.protocols);
    this.onconnecting();
    console.log('Attempting to connect...');
    // eslint-disable-next-line no-var
    var localWs = this.ws;
    // eslint-disable-next-line no-var
    var timeout = setTimeout(() => {
      console.log('Connection timeout');
      this.timedOut = true;
      localWs.close();
      this.timedOut = false;
    }, this.timeoutInterval);

    this.ws.onopen = (event: WebSocket.OpenEvent) => {
      console.log('onopen');
      this.opened = true;
      this.hasOpened = true;
      clearTimeout(timeout);
      logg('ON OPEN');
      this.readyState = WebSocket.OPEN;
      reconnectAttempt = false;
      this.onopen(event);
    };

    this.ws.onclose = (event: WebSocket.CloseEvent) => {
      console.log('ON CLOSE', event, reconnectAttempt);
      if (event.code === 1006) {
        this.online = false; // ??? is this code correct to determine when offline/online
      }
      clearTimeout(timeout);
      this.opened = false;
      this.ws = undefined;
      if (this.forcedClose) {
        this.readyState = WebSocket.CLOSED;
        this.onclose(event);
      } else {
        this.readyState = WebSocket.CONNECTING;
        this.onconnecting();
        if (!reconnectAttempt && !this.timedOut) {
          logg('ON CLOSE');
          this.onclose(event);
        }
        if (this.hasOpened) {
          setTimeout(() => {
            this.reconnectInterval *= 2;
            this.connect(true);
          }, this.reconnectInterval);
        }
      }
    };

    this.ws.onmessage = (event) => this.onmessage(event);

    this.ws.onerror = (event: WebSocket.ErrorEvent): any => {
      console.log('onerrrrr', event, '22');
      this.onerror(event);
      return;
    };
  };

  public once: (ev: string | symbol, listener: (...args: any[]) => void) => void = (
    event: string | symbol,
    listener: (...args: any[]) => void,
  ) => {
    return this.ws?.once(event, listener);
  };

  public send(data: any) {
    console.log('sendddd');

    if (this.ws) {
      logg('SEND', data);
      return this.ws.send(data);
    } else {
      throw 'INVALID_STATE_ERR : Pausing to reconnect websocket';
    }
  }

  public close(): boolean {
    console.log('CLOSE');
    if (this.ws) {
      this.forcedClose = true;
      this.ws.close();
      return true;
    }
    return false;
  }
  /**
   * Additional public API method to refresh the connection if still open (close, re-open).
   * For example, if the app suspects bad data / missed heart beats, it can try to refresh.
   *
   * Returns boolean, whether websocket was closed.
   */
  public refresh(): boolean {
    if (this.ws) {
      console.log('refresh ---- DISCONNECTING');
      this.ws.close();
      return true;
    }
    return false;
  }
}
