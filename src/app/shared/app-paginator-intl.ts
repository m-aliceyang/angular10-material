import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class AppPaginatorIntl extends MatPaginatorIntl {
  constructor(private tran: TranslateService) {
    super();
    this.tran.onLangChange.subscribe((e: Event) => {
      this.getAndInitTranslations();
    });
    this.getAndInitTranslations();
  }

  private getAndInitTranslations(): void {
    this.tran.get(['ITEMS_PER_PAGE', 'NEXT_PAGE', 'PREVIOUS_PAGE', 'OF_LABEL', 'FIRST_PAGE', 'LAST_PAGE']).subscribe(translation => {
      this.itemsPerPageLabel = translation['ITEMS_PER_PAGE'];
      this.nextPageLabel = translation['NEXT_PAGE'];
      this.previousPageLabel = translation['PREVIOUS_PAGE'];
      this.firstPageLabel = translation['FIRST_PAGE'];
      this.lastPageLabel = translation['LAST_PAGE'];
      this.changes.next();
    });
  }

  getRangeLabel = (page: number, pageSize: number, length: number) =>  {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} / ${length}`;
  }
}
