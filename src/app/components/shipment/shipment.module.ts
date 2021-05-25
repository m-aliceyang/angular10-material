import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShipmentListComponent } from './shipment-list/shipment-list.component';
import { ShipmentPostComponent } from './shipment-post/shipment-post.component';
import { SharedModule } from '../../shared/shared.module';
import { ShipmentCardComponent } from './shipment-list/shipment-card/shipment-card.component';
import { ShipmentTableComponent } from './shipment-list/shipment-table/shipment-table.component';
import { ShipmentDnDialogComponent } from './shipment-dn.dialog/shipment-dn.dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
const SHIPMENT_ROUTES: Routes = [
    {
        path: '', children: [
            { path: 'list', component: ShipmentListComponent },
            { path: 'post', component: ShipmentPostComponent },
            { path: 'edit/:id', component: ShipmentPostComponent },
            { path: '', pathMatch: 'full', component: ShipmentListComponent }
        ]
    }

];
@NgModule({
    declarations: [ShipmentListComponent, ShipmentPostComponent, ShipmentCardComponent, ShipmentTableComponent, ShipmentDnDialogComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(SHIPMENT_ROUTES)
    ],
    exports: [],
    providers: [],
})
export class ShipmentModule { }
