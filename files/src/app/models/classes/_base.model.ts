import { Exclude, Expose, Transform } from 'class-transformer';
import { transformToDate } from '@misc/helpers/model-conversion/transform-helpers/transform-to-date.function';

@Exclude()
export abstract class AbstractModel {
  @Expose({ name: '@id' })
  iri: string;
  @Expose()
  id: string;
  @Expose()
  @Transform(transformToDate)
  createdAt: Date;
  @Expose()
  @Transform(transformToDate)
  updatedAt: Date;

  [Symbol.toPrimitive](hint: 'number' | 'string' | 'default'): string | number | void {
    switch (hint) {
      case 'default':
      case 'string':
        return this.iri;
      case 'number':
      default:
        return;
    }
  }
}
