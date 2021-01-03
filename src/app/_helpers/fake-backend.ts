import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
const usersKey  = 'users-key';
const pizzasKey = 'pizzas-key';
const cartKey   = 'cart-key';

let users       = JSON.parse(localStorage.getItem(usersKey)) || [];
let pizzas      = JSON.parse(localStorage.getItem(pizzasKey)) || [];
let cartData    = JSON.parse(localStorage.getItem(cartKey)) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.endsWith('/pizzas/add') && method === 'POST':
                    return add();    
                case url.endsWith('/pizzas') && method === 'GET':
                    return getPizzas();
                case url.match(/\/pizzas\/\d+$/) && method === 'GET':
                    return getPizzaById();
                case url.match(/\/pizzas\/\d+$/) && method === 'PUT':
                    return updatePizza();
                case url.match(/\/pizzas\/\d+$/) && method === 'DELETE':
                    return deletePizza(); 
                case url.endsWith('/cart/add') && method === 'POST':
                    return addTocart();
                case url.endsWith('/cart') && method === 'GET':
                    return getCart();
                case url.match(/\/cart\/\d+$/) && method === 'DELETE':
                    return deleteCartItem();           
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                ...basicDetails(user),
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users.map(x => basicDetails(x)));
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(basicDetails(user));
        }

        function updateUser() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let user = users.find(x => x.id === idFromUrl());

            // only update password if entered
            if (!params.password) {
                delete params.password;
            }

            // update and save user
            Object.assign(user, params);
            localStorage.setItem(usersKey, JSON.stringify(users));

            return ok();
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem(usersKey, JSON.stringify(users));
            return ok();
        }
        
        // pizza functions

        function add() {
            const pizza = body

            pizza.id = pizzas.length ? Math.max(...pizzas.map(x => x.id)) + 1 : 1;
            pizzas.push(pizza);
            localStorage.setItem(pizzasKey, JSON.stringify(pizzas));
            return ok();
        }

        function getPizzas() {
            if (!isLoggedIn()) return unauthorized();
            return ok(pizzas);
        }

        function getPizzaById() {
            if (!isLoggedIn()) return unauthorized();

            const pizza = pizzas.find(x => x.id === idFromUrl());
            return ok(pizza);
        }

        function updatePizza() {
            if (!isLoggedIn()) return unauthorized();

            let params = body;
            let pizza  = pizzas.find(x => x.id === idFromUrl());

            // update and save pizza
            Object.assign(pizza, params);
            localStorage.setItem(pizzasKey, JSON.stringify(pizzas));

            return ok();
        }

        function deletePizza() {
            if (!isLoggedIn()) return unauthorized();

            pizzas = pizzas.filter(x => x.id !== idFromUrl());
            localStorage.setItem(pizzasKey, JSON.stringify(pizzas));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorized' } })
                .pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(user) {
            const { id, username, firstName, lastName,role } = user;
            return { id, username, firstName, lastName,role };
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        //shop apis
        function addTocart() {
            const cart = body
            let userCart    = cartData.find(x => x.pizzaId == cart.pizzaId);
            if(userCart){
                Object.assign(userCart, cart);
                localStorage.setItem(cartKey, JSON.stringify(cartData));
            }else{
                cart.id         = cartData.length ? Math.max(...cartData.map(x => x.id)) + 1 : 1;
                cartData.push(cart);
                localStorage.setItem(cartKey, JSON.stringify(cartData));
            }
            return ok(cartData);
        }
        function getCart() {
            if (!isLoggedIn()) return unauthorized();
            return ok(cartData);
        }

        function deleteCartItem() {
            if (!isLoggedIn()) return unauthorized();

            cartData = cartData.filter(x => x.id !== idFromUrl());
            localStorage.setItem(cartKey, JSON.stringify(cartData));
            return ok();
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};