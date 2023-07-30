export interface SideNavItem {
  title: string;
  link: string;
}

export enum UserType {
  ADMIN="ADMIN",
  USER="USER",
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  blocked: boolean;
  active: boolean;
  createdOn: string;
  userType: UserType;
}

export interface RegistrationObj {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  blocked: boolean;
  active: boolean;
  createdOn: string;
  userType: UserType;
}

export interface LoginDetails {
  userName: string;
  password: string;
}

export interface Book {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  price: number;
  available: boolean;
  count?: number;
  author: string;
}

export interface Visitor{
  id: string;
  name: string;
  mobileNumber:string;
  reason: string;
  whomToMeet:string;
  photo: string;
  inTime:string;
  outTime:string;
  date:string;
  category: string;
  subCategory: string;
  isOut:boolean
}

export interface Employee{
  id: string;
  name: string;
  mobileNumber:string;
  reason: string;
  photo: string;
  inTime:string;
  outTime:string;
  date:string;
  category: string;
  subCategory: string;
  isOut:boolean
}

export interface Material{
  id: string;
  driverName: string;
  vehicleNumber:string;
  materialDescription: string;
  materialDocument:string;
  photo: string;
  inTime:string;
  outTime:string;
  date:string;
  category: string;
  subCategory: string;
  isOut:boolean
}

export interface CategoryBooks {
  category: string;
  subCategory: string;
  books: Book[];
}

export interface CategoryVisitors {
  category: string;
  subCategory: string;
  visitors: Visitor[];
}

export interface CategoryEmployees {
  category: string;
  subCategory: string;
  employees: Employee[];
}

export interface CategoryMaterials {
  category: string;
  subCategory: string;
  materials: Material[];
}


export interface Order {
  id: number;
  userid: number;
  name: string;
  bookid: number;
  booktitle: string;
  orderedon: string;
  returned: boolean;
}

export interface Category {
  name: string;
  children?: Category[];
}
