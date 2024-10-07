import { ApiService } from "./api.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TestcaseResponse } from "forge-shared/dto/response/testcaseresponse.dto";
import { TestcaseSuggestionResponse } from "forge-shared/dto/response/testcasesuggestionresponse.dto";
import { TestcaseSelfResponse } from "forge-shared/dto/response/testcaseselfresponse.dto";
import { TestcaseSuggestionRequest } from "forge-shared/dto/request/testcasesuggestionrequest.dto";
import { TestcaseNewRequest } from "forge-shared/dto/request/testcasenewrequest.dto";
import { TestcaseUpdateRequest } from "forge-shared/dto/request/testcaseupdaterequest.dto";

@Injectable({
	providedIn: "root",
})
export class TestCaseService {
	constructor(private apiService: ApiService) {}

	public getSuggestion(
		suggestionRequest: TestcaseSuggestionRequest,
		projectEid: string,
	): Observable<TestcaseSuggestionResponse> {
		return this.apiService.call<TestcaseSuggestionResponse, TestcaseSuggestionRequest>(
			"POST",
			`testcase/${projectEid}/suggestion`,
			undefined,
			suggestionRequest,
		);
	}

	public createTestCase(testCaseRequest: TestcaseNewRequest, projectEid: string): Observable<TestcaseResponse> {
		return this.apiService.call<TestcaseResponse, TestcaseNewRequest>(
			"POST",
			`testcase/${projectEid}/new`,
			undefined,
			testCaseRequest,
		);
	}

	public updateTestCase(
		testCaseRequest: TestcaseUpdateRequest,
		projectEid: string,
		testcaseEid: string,
	): Observable<TestcaseResponse> {
		return this.apiService.call<TestcaseResponse, TestcaseUpdateRequest>(
			"PATCH",
			`testcase/${projectEid}/${testcaseEid}/update`,
			undefined,
			testCaseRequest,
		);
	}

	public getAllTestCases(projectEid: string, acceptancecriteriaEid: string): Observable<TestcaseSelfResponse> {
		return this.apiService.call<TestcaseSelfResponse>("GET", `testcase/${projectEid}/${acceptancecriteriaEid}/self`);
	}

	public getEspecificTestCase(projectEid: string, testcaseEid: string): Observable<TestcaseResponse> {
		return this.apiService.call<TestcaseResponse>("GET", `testcase/${projectEid}/${testcaseEid}/get`);
	}

	public deleteTestCase(projectEid: string, testcaseEid: string): Observable<void> {
		return this.apiService.call<void>("DELETE", `testcase/${projectEid}/${testcaseEid}/delete`);
	}
}
