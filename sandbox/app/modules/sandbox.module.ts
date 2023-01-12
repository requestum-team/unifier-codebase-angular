import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundPageModule } from '@modules/main/common/not-found-page/not-found-page.module';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from '@modules/main/common/not-found-page/not-found-page.component';
import { MainLayoutComponent } from '@layouts/main/main-layout.component';
import { MainLayoutModule } from '@layouts/main/main-layout.module';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/404'
      },
      {
        path: '**',
        redirectTo: '/404'
      },
      {
        path: '404',
        component: NotFoundPageComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), MainLayoutModule, NotFoundPageModule]
})
export class SandboxModule {}
