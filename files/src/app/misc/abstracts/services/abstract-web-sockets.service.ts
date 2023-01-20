import { inject, Injectable, NgZone } from '@angular/core';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { catchError, filter, map, retry } from 'rxjs/operators';
import { Observable, Subject, timer } from 'rxjs';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';
import { AuthService } from '@services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractWebSocketsService<T> {
  protected _config: IAppConfig = inject<IAppConfig>(APP_CONFIG);
  protected _auth: AuthService = inject(AuthService);
  protected _zone: NgZone = inject(NgZone);
  protected readonly _CONNECTIONS: Map<string, WebSocketSubject<T>> = new Map<string, WebSocketSubject<T>>();
  protected readonly _BLOBS$: Map<string, Subject<string>> = new Map<string, Subject<string>>();
  protected readonly _ERRORS$: Map<string, Subject<ErrorEvent>> = new Map<string, Subject<ErrorEvent>>();
  protected readonly _CLOSES$: Map<string, Subject<CloseEvent>> = new Map<string, Subject<CloseEvent>>();
  protected abstract readonly _MODEL: ClassConstructor<T>;

  abstract connectionUrl(topicId: string, ...rest: any[]): string;

  allMessages$(topicId: string): Observable<T> | undefined {
    return this._BLOBS$.get(topicId)?.pipe(
      map((data: string): T => (data.length ? plainToInstance(this._MODEL, JSON.parse(data)) : null)),
      filter((data: T): boolean => !!data)
    );
  }

  connect(topicId: string, ...rest: any[]): Observable<Event> {
    const connected$: Subject<Event> = new Subject<Event>();
    this._BLOBS$.set(topicId, new Subject<string>());
    this._ERRORS$.set(topicId, new Subject<ErrorEvent>());
    this._CLOSES$.set(topicId, new Subject<CloseEvent>());

    const connection: WebSocketSubject<T> = webSocket<T>({
      url: this.connectionUrl(topicId, ...rest),
      serializer: (message: T): string => JSON.stringify(message),
      deserializer: ({ data }: MessageEvent): Blob => data,
      openObserver: {
        next: (e: Event): void => {
          connected$.next(e);
        }
      },
      closeObserver: {
        next: (e: CloseEvent): void => {
          if (this._CLOSES$.has(topicId)) {
            this._CLOSES$.get(topicId)?.next(e);
            this._CLOSES$.get(topicId)?.complete();
          }
        }
      }
    } as WebSocketSubjectConfig<T>);
    connection
      .pipe(
        retry({
          delay: (error: Error, retryCount: number) => timer(retryCount * 100),
          count: 100
        }),
        catchError((err: ErrorEvent): any => this._ERRORS$.get(topicId)?.next(err))
      )
      .subscribe((msg: any): any => this._BLOBS$.get(topicId)?.next(msg));

    this._CONNECTIONS.set(topicId, connection);

    return connected$;
  }

  disconnect(topicId: string): void {
    type Key = '_CONNECTIONS' | '_BLOBS$' | '_ERRORS$' | '_CLOSES$';
    (['_CONNECTIONS', '_BLOBS$', '_ERRORS$', '_CLOSES$'] as Key[]).forEach((key: Key): void => {
      if (this[key]?.has(topicId)) {
        this[key]?.get(topicId)?.complete?.();
        this[key]?.delete?.(topicId);
      }
    });
  }

  send(topicId: string, message: unknown): void {
    this._zone.runOutsideAngular((): void => {
      if (this._CONNECTIONS.has(topicId)) {
        this._CONNECTIONS.get(topicId)?.next(message as T);
      }
    });
  }

  error(topicId: string, message: any): void {
    this._zone.runOutsideAngular((): void => {
      if (this._CONNECTIONS.has(topicId)) {
        this._CONNECTIONS.get(topicId)?.error(message);
      }
    });
  }
}
