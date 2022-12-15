import { NgModule, Type } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeResolver } from '@resolvers/me/me.resolver';
import { AuthLayoutComponent } from '@layouts/auth/auth-layout.component';
import { MainLayoutComponent } from '@layouts/main/main-layout.component';
import { CommonModule } from '@angular/common';
import { UserRole } from '@models/enums/user-role.enum';
import { UnauthGuard } from '@guards/unauth/unauth.guard';
import { IRoleGuardParams, RoleGuard } from '@guards/role/role.guard';
import { AuthGuard } from '@guards/auth/auth.guard';
import { AuthModule } from '@modules/auth/auth.module';
import { SandboxModule } from './modules/sandbox.module';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [UnauthGuard],
    component: AuthLayoutComponent,
    loadChildren: (): Promise<Type<AuthModule>> =>
      import('@modules/auth/auth.module').then((m: { AuthModule: Type<AuthModule> }): Type<AuthModule> => m.AuthModule)
  },
  {
    path: '',
    resolve: { me: MeResolver },
    canLoad: [AuthGuard, RoleGuard],
    component: MainLayoutComponent,
    runGuardsAndResolvers: 'always',
    data: {
      roleGuardParams: {
        redirectTo: ['', 'auth', 'log-in'],
        roles: [UserRole.admin]
      } as IRoleGuardParams
    },
    loadChildren: (): Promise<Type<SandboxModule>> =>
      import('./modules/sandbox.module').then((m: { SandboxModule: Type<SandboxModule> }): Type<SandboxModule> => m.SandboxModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      enableTracing: false,
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
