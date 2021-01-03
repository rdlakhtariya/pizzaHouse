import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const pizzasModule = () => import('./pizzas/pizzas.module').then(x => x.PizzasModule);
const shopModule = () => import('./shop/shop.module').then(x => x.ShopModule);
const cartModule = () => import('./cart/cart.module').then(x => x.CartModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'pizzas', loadChildren: pizzasModule, canActivate: [AuthGuard] },
    { path: 'shop', loadChildren: shopModule, canActivate: [AuthGuard] },
    { path: 'cart', loadChildren: cartModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }