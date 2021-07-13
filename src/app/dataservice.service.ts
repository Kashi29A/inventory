import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  constructor(private http: HttpClient) { }

  getData(emrType) {
    return this.http.get<any>("http://localhost:8090/api/" + emrType)
  }

  createRecord(record) {
    return this.http.post<any>("http://localhost:8090/api/orders", record)
  }

  deleteRecord(record) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: record
    };
    return this.http.delete<any>("http://localhost:8090/api/delete", httpOptions)
  }
}
