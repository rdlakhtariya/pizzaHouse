import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class ShopService {
    
    constructor(
        private router: Router,
        private http: HttpClient
    ) {}

    addTocart(params:any){
        return this.http.post(`${environment.apiUrl}/cart/add`, params);
    }

    getAll() {
        return this.http.get(`${environment.apiUrl}/cart`);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/cart/${id}`);
    }
       

}
