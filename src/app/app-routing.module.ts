import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'session', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'session', loadChildren: './pages/session/session.module#SessionPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'illustrations', loadChildren: './pages/illustrations/illustrations.module#IllustrationsPageModule' },
  { path: 'rewards', loadChildren: './pages/rewards/rewards.module#RewardsPageModule' },
  { path: 'reward-detailed/:data', loadChildren: './pages/reward-detailed/reward-detailed.module#RewardDetailedPageModule' },
  { path: 'message-page/:status/:price/:item/:stock', loadChildren: './pages/message-page/message-page.module#MessagePagePageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'statistics', loadChildren: './pages/statistics/statistics.module#StatisticsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
