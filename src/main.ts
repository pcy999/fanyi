/*
 * @Description:
 * @Autor: pcy
 * @Date: 2022-04-28 15:52:20
 * @LastEditTime: 2022-05-06 15:01:44
 */
import { IncomingMessage } from "http";
import * as querystring from "querystring";
import { appId, appSecret } from "./private";
const md5 = require("md5");

type BaiduResult = {
  error_code?: string;
  error_msg?: string;
  from: string;
  to: string;
  trans_result: {
    src: string;
    dst: string;
  }[];
};

export const translate = (word: string) => {
  const salt = Math.random();
  const sign = md5(appId + word + salt + appSecret);
  let from: string, to: string;

  if (/[a-zA-Z]/.test(word[0])) {
    //英-中
    from = "en";
    to = "zh";
  } else {
    //中-英
    from = "zh";
    to = "en";
  }

  const query: string = querystring.stringify({
    q: word,
    from,
    to,
    appid: appId,
    salt,
    sign,
  });
  const https = require("https");
  const options = {
    hostname: "api.fanyi.baidu.com",
    port: 443,
    path: "/api/trans/vip/translate?" + query,
    method: "GET",
  };
  const req = https.request(options, (res: IncomingMessage) => {
    let chunks: Buffer[] = [];
    res.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    res.on("end", () => {
      const str = Buffer.concat(chunks).toString();
      const obj: BaiduResult = JSON.parse(str);
      if (obj.error_code) {
        console.log(obj.error_msg);
        process.exit(2);
      } else {
        console.log(obj.trans_result[0].dst);
        process.exit(0);
      }
    });
  });

  req.on("error", (e: any) => {
    console.error(e);
  });
  req.end();
};
