import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		ShopRoutingModule
	],
	declarations: [
        LayoutComponent,
        ListComponent
    ]
})
export class ShopModule { }
