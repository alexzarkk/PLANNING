/* md5: ea9b6c723205195c9d95259da4632f51 */
/* eslint-disable */
/* tslint:disable */
// @ts-nocheck

/**
 * 本文件由 mgop-generator 自动生成， 建议请勿修改
 */

import { mgop } from '@aligov/jssdk-mgop';
import createFetch from './systems';

const defaultFetch = ({ api, data, header = {} }) => {
  return new Promise((resolve, reject) => {
    mgop({
      api,
      appKey: '4kzz5t3t+2002281722+mzaaot',
      host: 'https://gov-bus.zjzwfw.gov.cn',
      header,
      data,
      onFail: (error) => {
        const message = (error && error.ret && error.ret.join(',')) || '服务调用异常，请稍后再试';
        reject({ message });
      },
      onSuccess: (res) => {
        resolve(res.data);
      },
    });
  });
};

let fetch = createFetch(defaultFetch);

const overrideFetch = (baseFetch) => {
  fetch = createFetch(baseFetch);
};

export { overrideFetch, fetch as default };
