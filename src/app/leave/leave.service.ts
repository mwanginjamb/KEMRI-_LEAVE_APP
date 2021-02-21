import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Leave } from '../models/leave.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  url = environment.url;

  constructor(private http: HttpClient) { }

  Leaves(No:string) {
    return this.http.get<Leave[]>(`${this.url}site/list?EmpNo=${No}`).pipe(take(1));
  }

  get Employees() {
    return this.http.get(`${this.url}site/employees`).pipe(take(1));
  }

  LeaveTypes(Gender: string) {
    return this.http.get(`${this.url}site/leave-types?gender=${Gender}`).pipe(take(1));
  }

  Leave(EmpNo: string) {
    return this.http.get(`${this.url}site/leave?Employee_No=${EmpNo}`).pipe(take(1));
  }

  LeaveCard(No: string) {
    return this.http.get(`${this.url}/site/leave-card?No=${No}`).pipe(take(1))
  }

  postLeave(leave: Leave) {
    return this.http.post<Leave>(`${this.url}site/leave`, JSON.stringify(leave));
  }

  apply(No: string) {
    return this.http.get(`${this.url}/site/send-for-approval?No=${No}`).pipe(take(1));
  }

  // Format date utility
  formatDate(datestring: string) {
    // Format Date to YYYY-MM-DD
    const recDate = new Date(datestring);
    const month = (recDate.getMonth() + 1) > 9 ? recDate.getMonth() + 1 : `0` + (recDate.getMonth() + 1);
    const day = ( recDate.getDate() ) > 9 ? recDate.getDate() : `0` + recDate.getDate();
    return  `${recDate.getFullYear()}-${month}-${day}`;
  }


}
