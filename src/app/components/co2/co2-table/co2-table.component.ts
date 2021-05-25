import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Co2TableModel } from 'src/app/shared/models/co2-table.model';
import { Co2Model } from 'src/app/shared/models/co2.model';

@Component({
    selector: 'app-co2-table',
    templateUrl: './co2-table.component.html',
    styles: [`    `]
})
export class Co2TableComponent implements OnInit, AfterViewInit {
    @Input() data$ = new BehaviorSubject<Co2Model[]>([]);
    source$ = new BehaviorSubject<Co2TableModel[]>([]);
    header$ = new BehaviorSubject<Co2TableModel>({});
    displayedColumns = ['origin', 'destination', 'item1', 'item2', 'item3', 'item4', 'item5', 'item6',
        'item7', 'item8', 'item9', 'item10', 'item11', 'item12', 'item13', 'item14', 'item15'];
    constructor() { }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
      this.data$.subscribe(x => {
        if (x.length === 0) { return; }
        const first = x[0];
        const header: Co2TableModel = {
          origin: 'Origin',
          destination: 'Destination',
          item1: first.firstDictionary[0].key,
          item2: first.firstDictionary[1].key,
          item3: first.firstDictionary[2].key,
          item4: first.firstDictionary[3].key,
          item5: first.firstDictionary[4].key,
          item6: first.firstDictionary[5].key,
          item7: first.firstDictionary[6].key,
          item8: first.secondDictionary && first.secondDictionary.length > 0 ? first.secondDictionary[0].key : '',
          item9: first.secondDictionary && first.secondDictionary.length > 0 ? first.secondDictionary[1].key : '',
          item10: first.secondDictionary && first.secondDictionary.length > 0 ? first.secondDictionary[2].key : '',
          item11: first.secondDictionary && first.secondDictionary.length > 0 ? first.secondDictionary[3].key : '',
          item12: first.secondDictionary && first.secondDictionary.length > 0 ? first.secondDictionary[4].key : '',
          item13: first.secondDictionary && first.secondDictionary.length > 0 ? first.secondDictionary[5].key : '',
          item14: first.secondDictionary && first.secondDictionary.length > 0 ? first.secondDictionary[6].key : '',
          item15: first.secondDictionary && first.secondDictionary.length > 0 ? first.secondDictionary[7].key : '',
        };
        const source = x.map(y => {
          const current: Co2TableModel = {
            origin: y.origin,
            destination: y.destination,
            item1: y.firstDictionary[0].value,
            item2: y.firstDictionary[1].value,
            item3: y.firstDictionary[2].value,
            item4: y.firstDictionary[3].value,
            item5: y.firstDictionary[4].value,
            item6: y.firstDictionary[5].value,
            item7: y.firstDictionary[6].value,
            item8: y.secondDictionary && y.secondDictionary.length > 0 ? y.secondDictionary[0].value : '',
            item9: y.secondDictionary && y.secondDictionary.length > 0 ? y.secondDictionary[1].value : '',
            item10: y.secondDictionary && y.secondDictionary.length > 0 ? y.secondDictionary[2].value : '',
            item11: y.secondDictionary && y.secondDictionary.length > 0 ? y.secondDictionary[3].value : '',
            item12: y.secondDictionary && y.secondDictionary.length > 0 ? y.secondDictionary[4].value : '',
            item13: y.secondDictionary && y.secondDictionary.length > 0 ? y.secondDictionary[5].value : '',
            item14: y.secondDictionary && y.secondDictionary.length > 0 ? y.secondDictionary[6].value : '',
            item15: y.secondDictionary && y.secondDictionary.length > 0 ? y.secondDictionary[7].value : '',
          };
          return current;
        });
        this.header$.next(header);
        this.source$.next(source);
      });
    }
}
