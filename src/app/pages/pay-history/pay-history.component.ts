import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-calendar",
  templateUrl: "./pay-history.component.html",
  styleUrls: ["./pay-history.component.scss"],
})
export class PayHistoryComponent implements OnInit {
  public list = [];
  public userList = [];
  public loading = false;
  constructor(private message: NzMessageService, private http: HttpClient) {}
  ngOnInit() {
    this.getPayHistory();
  }
  public getPayHistory() {
    this.loading = true;
    this.http
      .post("./assets/api/sql.php", {
        type: "getPayHistory",
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

}
