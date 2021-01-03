import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { PizzaService, ShopService, AlertService,AccountService } from '@app/_services';

@Component({ 
    templateUrl: 'list.component.html',
    styleUrls: ['./list.component.css']
 })
export class ListComponent implements OnInit {
    
    pizzas      = null;
    loading     = false;
    submitted   = false;
    
    constructor(
        private pizzaService: PizzaService,
        private route: ActivatedRoute,
        private router: Router,
        private shopService: ShopService,
        private alertService: AlertService,
        private accountService: AccountService
    ){
    }

    ngOnInit() {
        this.pizzaService.getAll()
            .pipe(first())
            .subscribe(pizzas => this.pizzas = pizzas);
    }

    getSizeLabel(id: string){
        var sizeObj = this.pizzaService.getSize().find(x => x.id == id);
        return sizeObj.name;
    }
    addTocart(id:string,qty:number){
        var data = {"pizzaId" : id,"qty":qty};
        this.shopService.addTocart(data)
            .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('Pizza added successfully', { keepAfterRouteChange: false });
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                });            
    }

}