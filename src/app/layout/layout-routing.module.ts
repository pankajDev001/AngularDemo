import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import {AuthGuard} from '../shared';
import {LoginGuard} from "../shared/guard/login.guard";

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    { path: '', redirectTo: 'agency/dashboard', pathMatch: 'prefix' , canActivate:[LoginGuard] },
    { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),  canActivateChild: [AuthGuard], data: { url : '/dashboard/list'}   },
    { path: 'agency/dashboard', loadChildren: () => import('./dashboard/agency-dashboard/agency-dashboard.module').then(m => m.AgencyDashboardModule), canActivateChild: [AuthGuard], data: { url : '/dashboard/agency'} },

    { path: 'clinicians', loadChildren: () => import('./clinicians/clinicians.module').then(m => m.CliniciansModule),  canActivateChild: [AuthGuard], data: { url : '/clinicians/list'}  },
    { path: 'clinician-details/:id', loadChildren: () => import('./clinicians/clinician-details/clinician-details.module').then(m => m.ClinicianDetailsModule), canActivateChild: [AuthGuard], data: { url : '/clinicians/list'}},

    { path: 'agencies', loadChildren: () => import('./agencies/agencies.module').then(m => m.AgenciesModule),  canActivateChild: [AuthGuard], data: { url : '/agencies/list'} },
    { path: 'agency-details/:id', loadChildren: () => import('./agencies/agency-details/agency-details.module').then(m => m.AgencyDetailsModule),  canActivateChild: [AuthGuard], data: { url : '/agencies/edit'} },

    { path: 'patients', loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule),  canActivateChild: [AuthGuard], data: { url : '/patients/list'} },
    { path: 'scheduled-visits', loadChildren: () => import('./scheduled-visits/scheduled-visits.module').then(m => m.ScheduledVisitsModule),  canActivateChild: [AuthGuard], data: { url : '/Scheduled Visits/list'} },

    /*types => 0 - from dashboard ,  1 - from clinicians, 2 - from patients */
    { path: 'scheduled-visits/add/:type', loadChildren: () => import('./schedule-visit/schedule-visit.module').then(m => m.ScheduleVisitModule) },

    { path: 'my-account', loadChildren: () => import('./my-account/my-account.module').then(m => m.MyAccountModule) },

    { path: 'manage-admins', loadChildren: () => import('./manage-admins/manage-admins.module').then(m => m.ManageAdminsModule),  canActivateChild: [AuthGuard], data: { url : '/Admin Users/list'} },

    { path: 'manage-modules', loadChildren:() => import('./manage-modules/manage-modules.module').then(m => m.ManageModulesModule) },

    { path: 'user-fee-settings', loadChildren: () => import('./user-fee-settings/user-fee-settings.module').then(m => m.UserFeeSettingsModule),  canActivateChild: [AuthGuard], data: { url : '/Category Fee/list'} },
    { path: 'payment-report', loadChildren: () => import('./payment-report/payment-report.module').then(m => m.PaymentReportModule),  canActivateChild: [AuthGuard], data: { url : '/Payment Revenue/list'} }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
