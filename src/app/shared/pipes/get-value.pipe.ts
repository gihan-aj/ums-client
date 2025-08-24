import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getValue',
})
export class GetValuePipe implements PipeTransform {
  /**
   * A pipe to safely get a value from an object property.
   * It handles nested keys (e.g., 'user.name') and all possible key types.
   * @param item The data object for the row.
   * @param key The key of the property to access.
   */
  transform(item: any, key: string | number | symbol): any {
    if (item === null || item === undefined) {
      return '';
    }

    // If the key is not a string with dot notation, access it directly.
    if (typeof key !== 'string' || !key.includes('.')) {
      return item[key as keyof any];
    }

    // Otherwise, reduce to get the nested value.
    return key.split('.').reduce((obj, prop) => obj && obj[prop], item);
  }
}
