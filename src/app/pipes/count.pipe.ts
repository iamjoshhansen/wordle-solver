import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'count',
})
export class CountPipe implements PipeTransform {
  transform(value: any[] | null): number {
    return value?.length ?? 0;
  }
}
