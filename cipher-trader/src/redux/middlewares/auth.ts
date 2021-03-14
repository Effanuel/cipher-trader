import crypto from 'crypto';

export const authKeyExpires = (path: string, method: string) => {
  const api = 'PgQVxGkPXJhZeA2r6cR_sIWf'; //process.env.REACT_APP___API_KEY || '';
  const secret = 'RYrBffjB0VgCJOko1UMAlpe6ZZSEXeaWWKtZiMJk4LP1_2zE'; //process.env.REACT_APP___API_SECRET || '';
  console.log('API: ', api);

  const expires = Math.round(new Date().getTime() / 1000) + 60; // 1 min in the future
  const signature = crypto
    .createHmac('sha256', secret)
    .update(method + path + expires)
    .digest('hex');

  return {op: 'authKeyExpires', args: [api, expires, signature]};
};
