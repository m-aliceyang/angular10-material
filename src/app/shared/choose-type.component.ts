import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-choose-type',
    template: `
    <div class="btn-group choose-type" role="group" aria-label="" fxLayoutAlign="end stretch">
        <button mat-button (click)="changeType('table')"  [ngClass]="{'active': type=='table'}">{{'list' | translate}}</button>
        <button mat-button (click)="changeType('card')"  [ngClass]="{'active': type=='card'}">{{'card' | translate}}</button>
    </div>
    `,
    styles: [``]
})

export class ChooseTypeComponent implements OnInit {

    @Input()
    set defaultType(type: 'card' | 'table') {
        if (type) { this.type = type; }
    }
    @Output() typeChanged: EventEmitter<any> = new EventEmitter();
    type;
    constructor() {
        if (!this.type) { this.type = 'table'; }
    }
    ngOnInit(): void {

    }
    changeType(param: 'card' | 'table'): void {
        if (this.type === param) { return; }
        this.type = param;
        this.typeChanged.emit(this.type);
    }
}
