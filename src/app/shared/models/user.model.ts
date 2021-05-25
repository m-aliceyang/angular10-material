

export interface User {
    id: string;
}

export interface CreateAndUpdate {
    createdDate: Date;
    createdByUser: string;
    lastUpdatedDate: Date;
    lastUpadatedByUser: string;
}

export interface UserProfilePostPutModel {
    name: string;
    emails: string;
    department?: string;
    branch?: string;
    roles: string[];
    companies: string[];
}

export interface UserProfileListModel extends UserProfilePostPutModel, CreateAndUpdate {
    id: string;
    companies: string[];
    isActive: boolean;
}

export interface UserProfileModel extends UserProfilePostPutModel, CreateAndUpdate {
    id: string;
    componies: CompanyModel[];
    isActive: boolean;
}

export interface CompanyModel {
    id: string;
    name: string;
}