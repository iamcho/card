import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-url",
  templateUrl: "./url.component.html",
  styleUrls: ["./url.component.scss"],
})
export class UrlComponent implements OnInit {
  public url = "";
  public dns = "";
  public radioValue = "run.php";
  public data: any = {
    domain: [],
    dns: [],
  };
  public isLoading = false;
  constructor(private message: NzMessageService, private http: HttpClient) {}

  ngOnInit() {}
  public addUrl() {
    if (this.url && this.dns) {
      const urlArry = this.url.split("\n");
      let dnsArry;
      if (this.radioValue === "run.php") {
        dnsArry = this.dns.split("\n");
      } else {
        dnsArry = this.dns.split("\n")[0];
      }
      const obj = { url: urlArry, dns: dnsArry };

      this.isLoading = true;

      this.http.post(this.radioValue, obj).subscribe((data: any) => {
        console.log(data);
        this.data = data;

        this.isLoading = false;
      });
    } else {
      this.message.create("warning", `域名不为空`);
    }
  }
}
