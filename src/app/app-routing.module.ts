import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { MsalGuard } from './msal';
import { RoleGuard } from './shared/roles.guard';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home',  component: HomeComponent },
  { path: 'user',
    canActivate: [MsalGuard, RoleGuard],
    data: { role: 'Admin' },
    loadChildren: () => import('./components/user/user.module').then(m => m.UserModule) },
  { path: 'consignee',
    canActivate: [MsalGuard, RoleGuard],
    data: { role: 'Super' },
    loadChildren: () => import('./components/consignee/consignee.module').then(m => m.ConsigneeModule)  },
  { path: 'shipment',
    canActivate: [MsalGuard],
    loadChildren: () => import('./components/shipment/shipment.module').then(m => m.ShipmentModule)  },
  { path: 'co2',
    canActivate: [MsalGuard],
    loadChildren: () => import('./components/co2/co2.module').then(m => m.Co2Module)  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
