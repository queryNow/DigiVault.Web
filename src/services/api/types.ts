export interface ApiConfig {
  endpoint: string;
  scopes: string[];
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface GlobalNavigationResponse {
  "@odata.context": string;
  value: GlobalNavigationItem[];
}

export interface GlobalNavigationItem {
  Id: number;
  ParentId: number;
  Name: string;
  Order: number;
  Depth: number;
  PathIndex: number;
  NumericalMapping: string;
  Description: string;
  IsNewTab: boolean;
  Url: string;
  Icon: string;
  Config: string;
  children: GlobalNavigationItem[];
}

export interface User {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  IsActive: boolean;
  UserGroupUsersXref: UserGroupXref[];
}

export interface UserGroupXref {
  Id: number;
  UserGroup: UserGroup;
  User: User;
}

export interface UserGroup {
  Id: number;
  Name: string;
  Precedence: number;
  Description: string;
  UserGroupPermissionLevelXref?: PermissionLevelXref[];
}

export interface PermissionLevelXref {
  Id: number;
  PermissionLevel: PermissionLevel;
  UserGroup: UserGroup;
}

export interface PermissionLevel {
  Id: number;
  Code: string;
  Name: string;
  Description: string;
  Read: boolean;
  Write: boolean;
  Update: boolean;
  Delete: boolean;
  InActive: boolean;
}

export interface UserResponse {
  "@odata.context": string;
  "@odata.count"?: number;
  value: User[];
}

export interface UserGroupResponse {
  "@odata.context": string;
  "@odata.count"?: number;
  value: UserGroup[];
}

export interface PermissionLevelResponse {
  "@odata.context": string;
  value: PermissionLevel[];
}

export interface CreateUpdateUserRequest {
  Id?: number;
  Email: string;
  FirstName: string;
  LastName: string;
  IsActive: boolean;
  UserGroupUsersXrefs: UserGroupUsersXref[];
}

export interface CreateUpdateGroupRequest {
  Id?: number;
  Name: string;
  Description: string;
  Precedence: number;
  UserGroupPermissionLevelXrefs: GroupPermissionLevelXref[];
}

export interface GroupPermissionLevelXref {
  Id: number;
  UserGroup: number;
  PermissionLevel: number;
}

export interface UserGroupUsersXref {
  Id: number;
  User: number;
  UserGroup: number;
}

export interface ODataParams {
  $top?: number;
  $skip?: number;
  $filter?: string;
  $orderby?: string;
  $search?: string;
  $count?: boolean;
}