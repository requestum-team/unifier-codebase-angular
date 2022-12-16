import { TransformFnParams } from 'class-transformer';

export function transformToDate({ value }: TransformFnParams): Date | null {
  return value ? new Date(value) : null;
}
