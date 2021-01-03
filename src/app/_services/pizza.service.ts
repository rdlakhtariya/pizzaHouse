import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Pizza } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class PizzaService {
    
    constructor(
        private router: Router,
        private http: HttpClient
    ) {}

    add(pizza: Pizza) {
        return this.http.post(`${environment.apiUrl}/pizzas/add`, pizza);
    }
    getAll() {
        return this.http.get<Pizza[]>(`${environment.apiUrl}/pizzas`);
    }

    getById(id: string) {
        return this.http.get<Pizza>(`${environment.apiUrl}/pizzas/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/pizzas/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/pizzas/${id}`);
    }
    getSize(){
        return [
            { id: '1', name: 'Small' },
            { id: '2', name: 'Medium' },
            { id: '3', name: 'Large' },
            { id: '4', name: 'Ex. Large' }
          ];
    }
}
