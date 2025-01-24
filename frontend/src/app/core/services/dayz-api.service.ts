import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DayZTimeResponse } from "forge-shared/dto/response/dayztimeresponse.dto";

@Injectable({
	providedIn: "root",
})
export class DayZApiService {
	constructor(private apiService: ApiService) {}

	public getTime(): Observable<DayZTimeResponse> {
		return this.apiService.call<DayZTimeResponse>("GET", `dayz/time`);
	}
}
