import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Co2Component } from './co2.component';
import { SharedModule } from '../../shared/shared.module';
import { Co2CardComponent} from './co2-card/co2-card.compoment';
import {Co2TableComponent} from './co2-table/co2-table.component';
const CO2_ROUTES: Routes = [
    {
        path: '', children: [
            { path: 'list', component: Co2Component },
            { path: '', pathMatch: 'full', component: Co2Component }
        ]
    }
];

@NgModule({
    declarations: [
        Co2Component,
        Co2CardComponent,
        Co2TableComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild(CO2_ROUTES)
    ],
    exports: [],
    providers: [],
})
export class Co2Module { }
