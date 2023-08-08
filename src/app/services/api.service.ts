import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { Book, Category, Order, User, UserType, RegistrationObj, LoginDetails, Visitor, Employee, Material } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'http://localhost:4000';
  constructor(private http: HttpClient, private jwt: JwtHelperService) {}

  createAccount(registrationObj: RegistrationObj) {
    return this.http.post(this.baseUrl + '/user/register', registrationObj, {
      responseType: 'text',
    });
  }

  login(loginDetails: LoginDetails) {
    let params = new HttpParams()
      .append('userName', loginDetails.userName)
      .append('password', loginDetails.password);
    return this.http.get(this.baseUrl + '/user/login', {
      params: params,
      responseType: 'text',
    });
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  saveUsername(userName: string) {

    console.log("Response : "+userName);
    let user = userName.substring(32, userName.length);
    console.log("UserName : "+user);
    localStorage.setItem('username', user);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  isLoggedInUser(): boolean {
    // if(localStorage.getItem('username')?.match(/^([a-zA-Z0-9 _-]+)$/))
    // {
    //   return true;
    // }
    // return false;
    return !!localStorage.getItem('username');
  }


  deleteToken() {
    localStorage.removeItem('access_token');
    location.reload();
  }

  deleteUsername() {
    localStorage.removeItem('username');
    location.reload();
  }

  getUsername():string{

    let username = localStorage.getItem('username');

    if (!this.isLoggedInUser()){ 
      return 'Login First';
    }
    else
      return username != null ? username:'Login First';
  }

  getTokenUserInfo(): User | null {
    if (!this.isLoggedIn()) return null;
    let token = this.jwt.decodeToken();
    let user: User = {
      id: token.id,
      firstName: token.firstName,
      lastName: token.lastName,
      email: token.email,
      mobile: token.mobile,
      password: '',
      blocked: token.blocked.toLowerCase() === 'true',
      active: token.active.toLowerCase() === 'true',
      createdOn: token.createdAt,
      userType: token.userType === 'USER' ? UserType.USER : UserType.ADMIN,
    };
    return user;
  }

  getAllBooks() {
    return this.http.get<Book[]>(this.baseUrl + 'GetAllBooks');
  }

  getAllVisitors() {
    return this.http.get<Visitor[]>(this.baseUrl + '/visitor/all');
  }

  getAllMaterials() {
    return this.http.get<Material[]>(this.baseUrl + '/material/all');
  }


  getAllEmployees() {
    return this.http.get<Employee[]>(this.baseUrl + '/employee/all');
  }

  outVisitor(visitor: Visitor) {
    // return this.http.patch(this.baseUrl + '/visitor/new' , visitor, {
    //   responseType: 'text',
    // });
      return this.http.patch(this.baseUrl + '/visitor/new' , visitor, {
      responseType: 'text',
    });

  }

  outMaterial(material: Material) {
    // return this.http.patch(this.baseUrl + '/visitor/new' , visitor, {
    //   responseType: 'text',
    // });
      return this.http.patch(this.baseUrl + '/material/new' , material, {
      responseType: 'text',
    });

  }

  outEmployee(employee: Employee) {
    // return this.http.patch(this.baseUrl + '/visitor/new' , visitor, {
    //   responseType: 'text',
    // });
      return this.http.patch(this.baseUrl + '/employee/new' , employee, {
      responseType: 'text',
    });

  }

  getOrdersOfUser(userid: number) {
    return this.http.get<Order[]>(this.baseUrl + 'GetOrders/' + userid);
  }

  getAllOrders() {
    return this.http.get<Order[]>(this.baseUrl + 'GetAllOrders');
  }

  returnBook(bookId: string, userId: string) {
    return this.http.get(this.baseUrl + 'ReturnBook/' + bookId + '/' + userId, {
      responseType: 'text',
    });
  }

  getAllUsers() {
    return this.http.get<User[]>(this.baseUrl + 'GetAllUsers').pipe(
      map((users) =>
        users.map((user) => {
          let temp: User = user;
          //temp.userType = user.userType == 0 ? UserType.USER : UserType.ADMIN;
          temp.userType = user.userType == "ADMIN" ? UserType.USER : UserType.ADMIN;
          return temp;
        })
      )
    );
  }

  blockUser(id: number) {
    return this.http.get(this.baseUrl + 'ChangeBlockStatus/1/' + id, {
      responseType: 'text',
    });
  }

  unblockUser(id: number) {
    return this.http.get(this.baseUrl + 'ChangeBlockStatus/0/' + id, {
      responseType: 'text',
    });
  }

  enableUser(id: number) {
    return this.http.get(this.baseUrl + 'ChangeEnableStatus/1/' + id, {
      responseType: 'text',
    });
  }

  disableUser(id: number) {
    return this.http.get(this.baseUrl + 'ChangeEnableStatus/0/' + id, {
      responseType: 'text',
    });
  }

  getCategories() {
    return this.http.get<Category[]>(this.baseUrl + 'GetAllCategories');
  }

  insertBook(book: any) {
    return this.http.post(this.baseUrl + 'InsertBook', book, {
      responseType: 'text',
    });
  }

  deleteBook(id: number) {
    return this.http.delete(this.baseUrl + 'DeleteBook/' + id, {
      responseType: 'text',
    });
  }

  insertCategory(category: string, subcategory: string) {
    return this.http.post(
      this.baseUrl + 'InsertCategory',
      { category: category, subCategory: subcategory },
      { responseType: 'text' }
    );
  }
}
