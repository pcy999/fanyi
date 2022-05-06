#!/usr/bin/env-node
/*
 * @Description:命令行程序
 * @Autor: pcy
 * @Date: 2022-04-28 16:12:57
 * @LastEditTime: 2022-05-06 15:09:17
 */
import * as commander from "commander";
import { translate } from "./main";
const program = new commander.Command();
program
  .version("0.0.1")
  .name("fy")
  .usage("<English>")
  .arguments("<English>")
  .action(function (english) {
    translate(english);
  });
//解析参数
program.parse(process.argv);
