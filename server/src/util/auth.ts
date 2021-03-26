import crypto from 'crypto';
import rq from 'request-promise';
import {logger} from './logger';
import {ErrorHandler} from './error';

type Method = 'GET' | 'POST';

interface RequestOptions {
  headers: Record<string, string | number>;
  url: string;
  method: Method;
  body: any;
}

export const generate_requestOptions = (data: any, path: string, method: Method, url: string): RequestOptions => {
  const api = 'PgQVxGkPXJhZeA2r6cR_sIWf'; //process.env.REACT_APP___API_KEY || '';
  const secret = 'RYrBffjB0VgCJOko1UMAlpe6ZZSEXeaWWKtZiMJk4LP1_2zE'; //process.env.REACT_APP___API_SECRET || '';

  const expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
  const body = data ? JSON.stringify(data) : '';
  const signature = crypto
    .createHmac('sha256', secret)
    .update(method + `/api/v1/${path}` + expires + body)
    .digest('hex');

  const headers = {
    'content-type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'api-expires': expires,
    'api-key': api,
    'api-signature': signature,
  };
  return {headers, url, method, body};
};

const isTestnet = true;

export const fetchBitmexExchange = async (path: string, method?: Method, postdict?: Record<string, unknown>) => {
  const url = `https://${isTestnet ? 'testnet' : 'www'}.bitmex.com/api/v1/${path}`;
  const requestOptions = generate_requestOptions(postdict, path, method || (postdict ? 'POST' : 'GET'), url);
  console.log(requestOptions, 'REQ');
  try {
    logger.log('debug', `Sending request from _curl_bitmex(${path})...`);
    const response = await rq(requestOptions);
    return response;
  } catch (error) {
    throw ErrorHandler(error);
  }
};
