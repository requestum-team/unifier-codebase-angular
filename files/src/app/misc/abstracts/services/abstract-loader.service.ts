import { ComponentRef, inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractLoaderService<AttachedComponent> implements OnDestroy {
  private _overlayRef: OverlayRef;
  private readonly _QUEUE$: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([]);
  private readonly _DESTROYED$: Subject<void> = new Subject<void>();
  protected _overlay: Overlay = inject(Overlay);
  protected abstract _attachedComponent: ComponentType<AttachedComponent>;
  protected abstract _overlayConfig: OverlayConfig;

  get isLoading(): boolean {
    return Boolean(this._QUEUE$.value?.length);
  }

  get isLoading$(): Observable<boolean> {
    return this._QUEUE$.asObservable().pipe(
      map((value: boolean[]): boolean => Boolean(value.length)),
      distinctUntilChanged(),
      auditTime(0),
      tap((isLoading: boolean): void => {
        if (isLoading) {
          if (!this._overlayRef.hasAttached()) {
            const componentRef: ComponentRef<AttachedComponent> = this._overlayRef.attach(new ComponentPortal(this._attachedComponent));
            componentRef.setInput('mode', 'indeterminate');
            componentRef.location.nativeElement.style.width = '100vw';
          }
        } else {
          this._overlayRef.detach();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._QUEUE$.next([]);
    this._QUEUE$.complete();
    this._DESTROYED$.next();
    this._DESTROYED$.complete();
  }

  on(): void {
    this._addToQueue(true);
  }

  off(): void {
    this._removeDismissed();
  }

  init(): void {
    this._overlayRef = this._overlay.create(this._overlayConfig);

    this._QUEUE$
      .asObservable()
      .pipe(
        filter((queue: boolean[]): boolean => queue.length > 0 && queue[0]),
        tap((): void => {
          const updatedQueue: boolean[] = this._QUEUE$.value;
          updatedQueue[0] = false;
          this._QUEUE$.next(updatedQueue);
        }),
        takeUntil(this._DESTROYED$)
      )
      .subscribe();

    this.isLoading$.subscribe();
  }

  private _addToQueue(isLoading: boolean): void {
    this._QUEUE$.next(this._QUEUE$.value.concat([isLoading]));
  }

  private _removeDismissed(): void {
    const updatedQueue: boolean[] = this._QUEUE$.value;
    if (!updatedQueue[0] && typeof updatedQueue[0] === 'boolean') {
      updatedQueue.shift();
    }
    this._QUEUE$.next(updatedQueue);
  }
}
