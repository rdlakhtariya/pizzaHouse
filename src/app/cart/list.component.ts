import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ShopService,AlertService,PizzaService } from '@app/_services';

@Component({ 
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
 })
export class ListComponent implements OnInit {
    
    cart        = null;
    coreCart    = null;
    pizzaObj    = null;
    loading     = false;
    submitted   = false;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private shopService: ShopService,
        private pizzaService: PizzaService,
        private alertService: AlertService
    ){
    }

    ngOnInit() {
        this.pizzaService.getAll()
            .pipe(first())
            .subscribe(pizzas => this.pizzaObj = pizzas);

        this.shopService.getAll()
            .pipe(first())
            .subscribe(cartData => {
                this.getCartData(cartData);
            });
    }

    getSizeLabel(id: string){
        var sizeObj = this.pizzaService.getSize().find(x => x.id == id);
        return sizeObj.name;
    }

    updateCart(id:string,qty:number){
        var data = {"pizzaId" : id,"qty":qty};
        this.shopService.addTocart(data)
            .pipe(first())
                .subscribe({
                    next: (x) => {
                        this.getCartData(x);
                        this.alertService.success('Cart successfully', { keepAfterRouteChange: false });
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                });            
    }

    removeCartItem(id){
        const cart = this.coreCart.find(x => x.id === id);
        cart.isDeleting = true;
        this.shopService.delete(id)
            .pipe(first())
            .subscribe(() =>{
                    this.getCartData(this.coreCart.filter(x => x.id !== id));
                }
            );
    }

    Updatecart(id:string,qty:number){
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

    getCartData(data:object){
        
        this.coreCart   = data;
        var totalAmount = 0;
        
        for (var i in data) {
            var pizza = this.pizzaObj.find(x => x.id == data[i].pizzaId);
            data[i].size    = this.getSizeLabel(pizza.id);
            data[i].price   = pizza.price;
            data[i].name    = pizza.name;
            data[i].image   = pizza.image;
            data[i].desc    = pizza.description;
            totalAmount     = totalAmount +  (pizza.price * data[i].qty);
        }
        var totalItem = parseInt(i)+1;

        this.cart =  {   
                        "totalAmount"  : totalAmount,
                        "totalItem" : totalItem,
                        "cartItem"  :data 
                    };
    }
    

}