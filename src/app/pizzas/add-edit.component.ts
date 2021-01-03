import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, PizzaService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    pizzaSizes = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private pizzaService: PizzaService,
        private alertService: AlertService, 
    ) {

    }

    ngOnInit() {
        const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

        this.pizzaSizes = this.pizzaService.getSize();

        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        this.form = this.formBuilder.group({
            id:'',
            name: ['', Validators.required],
            image: ['',[ Validators.required, Validators.pattern(reg)]],
            size: ['', Validators.required],
            price:['', Validators.required],
            description:['', Validators.required],
        });

        if (!this.isAddMode) {
            this.pizzaService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.setValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.addPizza();
        } else {
            this.updatePizza();
        }
    }

    private addPizza() {
        this.pizzaService.add(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Pizza added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updatePizza() {
        this.pizzaService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}