import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		CartRoutingModule
	],
	declarations: [
        LayoutComponent,
        ListComponent
    ]
})
export class CartModule { }
