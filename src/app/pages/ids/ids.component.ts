import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import * as copy from 'copy-to-clipboard';
import * as Mock from 'mockjs';
// const copy = require("copy-to-clipboard");

// const Mock = require("mockjs");

@Component({
  selector: 'app-ids',
  templateUrl: './ids.component.html',
  styleUrls: ['./ids.component.scss'],
})
export class IdsComponent implements OnInit {
  public list0 = [];
  public item0 = '';
  public index0: any;
  public list1 = [];
  public item1 = '';
  public index1: any;
  public name = '';
  constructor(private message: NzMessageService, private http: HttpClient) {}

  ngOnInit() {}
  /** 获取随机英文名 */
  public getName() {
    this.name = Mock.mock('@name');
    copy(this.name);
    this.message.create('success', '生成复制英文名成功');
  }
  public addItem(type: string) {
    if (!this['item' + type]) {
      this.message.create('warning', '添加内容不为空');
    } else {
      this['list' + type].push(this['item' + type]);
      this['item' + type] = '';
      this.message.create('success', '添加成功');
    }
  }
  public getItem(type: string) {
    const len = this['list' + type].length;
    if (len === 0) {
      this.message.create('warning', '没有可选内容');
      return;
    }
    // tslint:disable-next-line:radix
    this['index' + type] = Math.floor(Math.random() * len);
    copy(this['list' + type][this['index' + type]]);
    this.message.create('success', '随机复制成功');
  }
}
