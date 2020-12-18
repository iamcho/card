import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-card-authorization',
  templateUrl: './card-authorization.component.html',
  styleUrls: ['./card-authorization.component.scss'],
})
// tslint:disable-next-line:class-name
export class cardAuthorizationComponent implements OnInit {
  public authListLoading = false;
  public authList: any = [];
  public authTotalCount = 0;
  public pageIndex = 1;
  public pageSize = 100;
  constructor(private message: NzMessageService, private http: HttpClient) {}

  ngOnInit() {
    this.getAuthList(0, 'init');
  }
/** 获取所有用户 */
public getAuthList(num, type) {
  this.authListLoading = true;
  const quarms = [];
  if (type === 'init') {
    this.pageIndex = 1;
  }
  if (type === 'index') {
    this.pageIndex = num;
  }
  const pageIndex =   this.pageIndex - 1; // mesh 翻页码
  quarms.push('pageIndex=' + pageIndex);
  quarms.push('pageSize=' + this.pageSize);
  this.http
  .post('./assets/api/api.php', {
    type: 'authorizations?' + quarms.join('&'),
    http: 'get'
  })
  .subscribe((data: any) => {
    this.authListLoading = false;
    this.authTotalCount = data.totalCount;
    const result = data.items;
    result.forEach(v => {
      v.timestamp = this.timeFix(v.timestamp - 0);
    });
    this.authList = result;
  });
}
public timeFix(time: any) {
  const t = new Date(time);
  const tt =  `${t.getFullYear()}-${this.zero(t.getMonth() + 1)}-${this.zero(t.getDate())}
  ${this.zero(t.getHours())}:${this.zero(t.getMinutes())}:${this.zero(t.getSeconds())}`;
  return tt;
}
public zero(num: number) {
  if (num < 10) {
    return '0' + num;
  }
  return num;
}
}
