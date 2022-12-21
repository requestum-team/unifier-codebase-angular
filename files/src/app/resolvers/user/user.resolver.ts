import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserApiService } from '@services/api/user-api/user-api.service';
import { User } from '@models/classes/user/user.model';
import { AbstractDetailsInfoResolver } from '@misc/abstracts/services/abstract-details-info.resolver';

@Injectable({
  providedIn: 'root'
})
export class UserResolver extends AbstractDetailsInfoResolver<User> implements Resolve<User> {
  protected override readonly _PARAM_NAME: string = 'userId';
  protected override _api: UserApiService = inject(UserApiService);
}
