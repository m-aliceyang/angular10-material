import {CreateAndUpdate} from './create-and-update.model';
import {CompanyModel} from './company.model';

export interface UserProfileModel extends CreateAndUpdate {
  id?: string;
  isActive?: boolean;
  name?: string;
  email?: string;
  department?: string;
  branch?: string;
  roles?: string[];
  companies?: CompanyModel[];
}
