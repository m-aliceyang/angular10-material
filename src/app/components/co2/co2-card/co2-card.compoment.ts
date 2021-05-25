import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Co2Model } from 'src/app/shared/models/co2.model';

@Component({
    selector: 'app-co2-card',
    templateUrl: './co2-card.component.html',
    styles: [``]
})
export class Co2CardComponent implements OnInit {
    @Input() data$ = new BehaviorSubject<Co2Model[]>([]);

    constructor() {

    }

    ngOnInit(): void { }
}
