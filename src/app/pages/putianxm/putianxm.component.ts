import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-putianxm",
  templateUrl: "./putianxm.component.html",
  styleUrls: ["./putianxm.component.scss"],
})
export class PutianxmComponent implements OnInit {
  public loading10 = false;
  public loading11 = false;
  public loading16 = false;
  public loading17 = false;
  public loading18 = false;
  public camp_id = 10;
  public date = "1";
  public timezone = "+0:00";
  public group1 = "23";
  public order_name = "leads";
  public dataRanger = [this.getTome(0), this.getTome(0)];
  public listOfColumn = [
    {
      title: "Name",
    },
    {
      title: "clicks",
      compare: (a, b) => a.clicks - b.clicks,
      priority: 6,
    },
    {
      title: "lp_clicks",
      compare: (a, b) => a.lp_clicks - b.lp_clicks,
      priority: 5,
    },
    {
      title: "lp_ctr",
      compare: (a, b) => a.lp_ctr - b.lp_ctr,
      priority: 4,
    },
    {
      title: "leads",
      compare: (a, b) => a.leads - b.leads,
      priority: 3,
    },
    {
      title: "cr",
      compare: (a, b) => a.english - b.english,
      priority: 2,
    },
    {
      title: "epc",
      compare: (a, b) => a.english - b.english,
      priority: 2,
    },
    {
      title: "revenue",
      compare: (a, b) => a.revenue - b.revenue,
      priority: 1,
    },
  ];
  public filterList = [
    "clicks",
    "lp_clicks",
    "lp_ctr",
    "leads",
    "cr",
    "epc",
    "revenue",
  ];
  public listData10: any = [];
  public listData11: any = [];
  public listData16: any = [];
  public listData17: any = [];
  public listData18: any = [];
  constructor(private message: NzMessageService, private http: HttpClient) {}

  ngOnInit() {
    this.getData();
  }
  public getTome(num) {
    const t = new Date(new Date().getTime() - 0 + num * 24 * 60 * 60 * 1000);
    const y = t.getFullYear();
    const m = t.getMonth() + 1;
    const d = t.getDate();
    return y + "-" + this.addZero(m) + "-" + this.addZero(d);
  }
  public getTimeFix(time) {
    const t = new Date(time);
    const y = t.getFullYear();
    const m = t.getMonth() + 1;
    const d = t.getDate();
    return y + "-" + this.addZero(m) + "-" + this.addZero(d);
  }
  public addZero(num) {
    if (num < 10) {
      num = "0" + num;
    }
    return num;
  }
  public changeId(id) {
    this.camp_id = id;
    this.getData();
  }
  public getData() {
    console.log(this.dataRanger);
    const camp_id = this.camp_id;
    this["loading" + camp_id] = true;
    this.http
      .post("putianxm.php", {
        page: "Stats",
        camp_id,
        date: this.date,
        timezone: this.timezone,
        date_s: this.getTimeFix(this.dataRanger[0]),
        date_e: this.getTimeFix(this.dataRanger[1]),
        group1: this.group1,
        order_name: this.order_name,
        // num_page: 1,
        // val_page: 100,
      })
      .subscribe((data: any) => {
        // console.log(data);
        this["loading" + camp_id] = false;
        this["listData" + camp_id] = data;
      });
  }
}
