import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  constructor(private http: HttpClient) { }

  getAllData() {
    return this.http.get<any>("http://localhost:8090/api/data")
  }

  getData(emrType) {
    return this.http.post<any>("http://localhost:8090/api/region", emrType)
  }

  getDataHospital(emr, hospitalName) {
    return this.http.post<any>("http://localhost:8090/api/hospital", {emr, hospitalName})
  }

  
  getDataDept(emr, hospital, department) {
    return this.http.post<any>("http://localhost:8090/api/department", {emr, hospital, department})
  }

  createRecord(record) {
    return this.http.post<any>("http://localhost:8090/api/create", record).pipe(

      retry(1),
 
      catchError(this.handleError)
 
    );
  }
  updateRecord(record, selectedRegion, selectedHospital, selectedDept) {
    return this.http.put<any>("http://localhost:8090/api/update", {record, selectedRegion, selectedHospital, selectedDept})
  }

  deleteRecord(record) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: record
    };
    return this.http.delete<any>("http://localhost:8090/api/delete", httpOptions)
  }
  isLoggedIn(fname?, lname?, currentRole?, username?, password?) {
    return this.http.post<any>("http://localhost:8090/api/login", {fname,lname, currentRole,username, password})
   // return true;
  }
  
 handleError(error) {

  let errorMessage = '';

  if (error.error instanceof ErrorEvent) {

    // client-side error

    errorMessage = `Error: ${error.error.message}`;

  } else {

    // server-side error

    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

  }

  //window.alert(errorMessage);

  return throwError(errorMessage);

}
}
