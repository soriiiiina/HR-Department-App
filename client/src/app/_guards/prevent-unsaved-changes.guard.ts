import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileEditComponent } from '../members/profile-edit/profile-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  canDeactivate(
    component: ProfileEditComponent): boolean {
      if(component.editForm.dirty)
      {
        return confirm("Are you sure you want to continue? Any unsaved changes will be lost")
      }
    return true;
  }
  
}
