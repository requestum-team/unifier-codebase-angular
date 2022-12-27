import { User } from '@models/classes/user/user.model';
import { UserRole } from '@models/enums/user-role.enum';
import { AbstractResponses } from '@interceptors/mock/responses/_responses.class';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Params } from '@angular/router';

interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

class UserResponses extends AbstractResponses<IUser> {
  override readonly ENTITIES: IUser[] = [
    {
      id: 'vkvggvc9-33g3-vk0p-v90c-g9g9ggp8v453',
      email: 'john.doe@gmail.com',
      firstName: `John`,
      lastName: `Doe`,
      role: UserRole.client
    }
  ];

  protected _entitiesFn(index: number): IUser {
    return {
      id: `vkvggvc9-33g3-vk0p-v90c-g9g9ggp8v9${index.toString().padStart(2, '0')}`,
      firstName: `John`,
      lastName: `Doe ${index.toString().padStart(3, '0')}`,
      email: `john.doe+${index + 1}@gmail.com`,
      role: UserRole.admin
    };
  }

  protected override _oneById([id]: string[], body: Params, headers: HttpHeaders): Observable<HttpResponse<IUser>> {
    const token: string | null = headers.get('Authorization');
    const role: UserRole | null = token ? (atob(token.replace('Bearer ', '')) as UserRole) : null;
    if (id && id !== 'me') {
      return super._oneById([id], body, headers);
    } else {
      return of(
        new HttpResponse({
          status: 200,
          body: this.ENTITIES.find((user: IUser): boolean => user.role === role)
        })
      );
    }
  }

  protected override _update([id]: string[], body: IUser): Observable<HttpResponse<IUser>> {
    if (id && id !== 'logout') {
      return super._update([id], body);
    } else {
      return of(
        new HttpResponse({
          status: 200,
          body: null as unknown as User
        })
      );
    }
  }
}

export const usersResponses: UserResponses = new UserResponses();
usersResponses.init(500);
