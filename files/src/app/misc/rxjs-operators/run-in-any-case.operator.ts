import { Observable, OperatorFunction } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

export function runInAnyCase<T>(func: () => void): OperatorFunction<T, T> {
  return (input$: Observable<T>): Observable<T> =>
    input$.pipe(
      tap((): void => {
        func();
      }),
      catchError((err: Error): Observable<never> => {
        func();
        throw err;
      }),
      finalize((): void => {
        func();
      })
    );
}
