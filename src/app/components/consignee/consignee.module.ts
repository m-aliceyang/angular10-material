import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsigneeListComponent } from './consignee-list/consignee-list.component';
import { ConsigneePostComponent } from './consignee-post/consignee-post.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ConsigneeListCardComponent } from './consignee-list/consignee-card/consignee-card.component';
import { ConsigneeListTableComponent } from './consignee-list/consignee-table/consignee-table.component';
const CONSIGNEE_ROUTES: Routes = [
    {
        path: '', children: [
            { path: 'list', component: ConsigneeListComponent },
            { path: 'post', component: ConsigneePostComponent },
            { path: 'edit/:id', component: ConsigneePostComponent },
            { path: '', pathMatch: 'full', component: ConsigneeListComponent }
        ]
    }
];

@NgModule({
    declarations: [ConsigneeListComponent, ConsigneePostComponent,
      ConsigneeListCardComponent, ConsigneeListTableComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(CONSIGNEE_ROUTES)
    ],
    exports: [],
    providers: [],

})
export class ConsigneeModule { }
