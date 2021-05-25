import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
// import {DataSourceComponent} from './data-source/data-source.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../shared/breadcrumb.component';
import {ChooseTypeComponent} from './choose-type.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import {AutofocusDirective} from './auto-focus.directive';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
    declarations: [
        // DataSourceComponent,
        BreadcrumbComponent,
        ChooseTypeComponent,
        ConfirmationDialogComponent,
        AutofocusDirective
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    exports: [
        MaterialModule,
        FlexLayoutModule,
        // DataSourceComponent,
        BreadcrumbComponent,
        FormsModule,
        ReactiveFormsModule,
        ChooseTypeComponent,
        ConfirmationDialogComponent,
        AutofocusDirective,
        TranslateModule
    ],
    providers: [],
})
export class SharedModule { }
