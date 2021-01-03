import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PizzasRoutingModule } from './pizzas-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		PizzasRoutingModule
	],
	declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent
    ]
})
export class PizzasModule { }
