import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, VerifiedGuard } from './shared';
import {LoginGuard} from "./shared/guard/login.guard";

const routes: Routes = [
    {path: 'home', loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule)},
    {path: '',   redirectTo: 'home', pathMatch: 'full' }, // redirect to `home`
    { path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), canActivate: [VerifiedGuard] },

    { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule), canActivate: [LoginGuard] },
    { path: 'verify-otp', loadChildren: () => import('./verify-otp/verify-otp.module').then(m => m.VerifyOtpModule), canActivate: [AuthGuard]},

    { path: 'forgot-password', loadChildren: ()=> import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)},
    { path: 'reset-password/:Email/:EmailToken', loadChildren: ()=> import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule)},

    { path: 'signup', loadChildren: () => import('./signup/signup.module').then(m => m.SignupModule) },
    { path: 'patient-review/:visitId', loadChildren: () => import('./patient-review/patient-review.module').then(m => m.PatientReviewModule) },

    { path: 'error', loadChildren: () => import('./server-error/server-error.module').then(m => m.ServerErrorModule) },
    { path: 'access-denied', loadChildren: () => import('./access-denied/access-denied.module').then(m => m.AccessDeniedModule) },
    { path: 'not-found', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [
      RouterModule
    ]
})
export class AppRoutingModule {}
