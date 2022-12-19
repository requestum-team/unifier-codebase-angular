import { Exclude, Expose } from 'class-transformer';
import { AbstractModel } from '@models/classes/_base.model';

@Exclude()
export class ApiFile extends AbstractModel {
  @Expose({ name: 'originalName' }) name: string;
  @Expose() context: string;
  @Expose() path: string;
  @Expose({ name: 'mimeType' }) type: string;
  @Expose() size: number;
  @Expose() uri: string;
}
