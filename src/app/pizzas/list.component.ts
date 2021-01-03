import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { PizzaService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    pizzas = null;
    constructor(private pizzaService: PizzaService) {}

    ngOnInit() {
        this.pizzaService.getAll()
            .pipe(first())
            .subscribe(pizzas => this.pizzas = pizzas);
    }

    deletePizza(id: string) {
        const pizza = this.pizzas.find(x => x.id === id);
        pizza.isDeleting = true;
        this.pizzaService.delete(id)
            .pipe(first())
            .subscribe(() => this.pizzas = this.pizzas.filter(x => x.id !== id));
    }
   
    getSizeLabel(id: string){
        var sizeObj = this.pizzaService.getSize().find(x => x.id == id);
        return sizeObj.name;
    }
}