import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserPostComponent } from './user-post/user-post.component';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../../shared/shared.module';
import { UserTableComponent } from './user-list/user-table/user-table.component';
import { UserCardComponent } from './user-list/user-card/user-card.component';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';
const USER_ROUTES: Routes = [
    {
        path: '', children: [
            { path: 'list', component: UserListComponent },
            { path: 'post', component: UserPostComponent },
            { path: 'edit/:id', component: UserPostComponent },
            { path: '', pathMatch: 'full', component: UserListComponent }
        ]
    }

];

@NgModule({
    declarations: [
        UserPostComponent,
        UserListComponent,
        UserTableComponent,
        UserCardComponent,
        ResetPasswordDialogComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(USER_ROUTES),
    ],
    exports: [],
    providers: [],
})
export class UserModule { }
