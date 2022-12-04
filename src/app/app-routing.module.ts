import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { AdminManageComponent } from './admin-manage/admin-manage.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogNewComponent } from './blog-new/blog-new.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminAuthGuardService } from './services/authentication/admin-auth-guard.service';
import { SuperadminAuthGuardService } from './services/authentication/superadmin-auth-guard.service';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'blog', component: BlogListComponent },
  {
    path: 'blog/new',
    component: BlogNewComponent,
    canActivate: [AdminAuthGuardService],
  },
  { path: 'blog/:id', component: BlogDetailComponent },
  {
    path: 'admins',
    component: AdminManageComponent,
    canActivate: [SuperadminAuthGuardService],
  },
  {
    path: 'game',
    component: GameComponent,
  },
  { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
