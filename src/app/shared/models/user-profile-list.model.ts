import {CreateAndUpdate} from './create-and-update.model';

export interface UserProfileListModel extends CreateAndUpdate{
  id: string;
  companies: string;
  isActive: boolean;
  name: string;
  email: string;
  department?: string;
  branch?: string;
  roles: string[];
}
