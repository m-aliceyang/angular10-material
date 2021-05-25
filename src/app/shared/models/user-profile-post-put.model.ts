export interface UserProfilePostPutModel {
  name: string;
  email: string;
  department?: string;
  branch?: string;
  roles: string[];
  companies: string[];
}
