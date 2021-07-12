import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit {
  public list = [];
  public userList = [];
  public loading = false;
  constructor(private message: NzMessageService, private http: HttpClient) {}
  ngOnInit() {
    this.getCharge();
  }
  public getCharge() {
    this.loading = true;
    this.http
      .post("./assets/api/sql.php", {
        type: "getAllCharts",
      })
      .subscribe((data: any) => {
        this.loading = false;
        if (data.success) {
          this.list = data.list;
        } else {
          this.message.create("error", data.message);
        }
      });
  }
  time2local(unixTimestamp){
    if(unixTimestamp){
      return new Date(unixTimestamp-0).toLocaleString();
    }else{
      return '-'
    }
  }
  public export() {
    window.open(window.location.host+'/assets/api/export.php');
  }
}
