import { Component, OnInit } from '@angular/core';
import { Book, CategoryBooks, CategoryEmployees, Employee } from '../models/models';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  availableEmployees: Employee[] = [];
  employeesToDisplay: CategoryEmployees[] = [];
  displayedColumns: string[] = [
    'photo',
    'name',
    'reason',
    'mobile',
    "date",
    'intime',
    'outtime',
    'action'
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAllEmployees().subscribe({
      next: (res: Employee[]) => {
        this.availableEmployees = [];
        console.log(res);
        for (var employee of res) this.availableEmployees.push(employee);
        //this.updateList();

        this.addcategory();
        this.filterEmployees();

        //this.sortVisitors();
        console.log(this.availableEmployees)
      },
      error: (err: any) => console.log(err),
    });
  }

addcategory(){
  //for( let visitor of this.availableVisitors){}
  
  this.availableEmployees.forEach(element => {
    element.category='Employee';
    if(element.outTime?.trim().length==0){
      element.subCategory="IN";
      element.isOut=false;
    }
    else{
      element.subCategory="OUT";
      element.isOut=true;
  }
  });

  console.log(this.availableEmployees);
}

filterEmployees(){
  this.employeesToDisplay = [];
    for (let employee of this.availableEmployees) {
      let exist = false;
      for (let categoryEmployees of this.employeesToDisplay) {
        if (
          employee.category === categoryEmployees.category &&
          employee.subCategory === categoryEmployees.subCategory
        )
          exist = true;
      }

      if (exist) {
        for (let categoryEmployees of this.employeesToDisplay) {
          if (
            employee.category === categoryEmployees.category &&
            employee.subCategory === categoryEmployees.subCategory
          )
          categoryEmployees.employees.push(employee);
        }
      } else {
        this.employeesToDisplay.push({
          category: employee.category,
          subCategory: employee.subCategory,
          employees: [employee],
        });
      }
    }
}


  getEmployeeCount() {
    return this.employeesToDisplay.reduce((pv, cv) => cv.employees.length + pv, 0);
  }


  search(value: string) {
    value = value.toLowerCase();
    this.filterEmployees();
    if (value.length > 0) {
      this.employeesToDisplay = this.employeesToDisplay.filter((categoryEmployees) => {
        categoryEmployees.employees = categoryEmployees.employees.filter(
          (employee) =>
          employee.name.toLowerCase().includes(value) ||
          employee.mobileNumber.toLowerCase().includes(value)
        );
        return categoryEmployees.employees.length > 0;
      });
    }
  }

  outEmployee(employee: Employee) {
    const now = new Date();
    employee.outTime=now.toLocaleTimeString();
    this.api.outEmployee(employee).subscribe({
      next: (res: any) => {
        if (res === 'Employee Out Successfully...') {
          employee.isOut = true;
        }
        //alert('Visitor Out Successfully...');
        alert(res.toString());
      },
      error: (err: any) => console.log(err),
    });

    this.filterEmployees();
    location.reload()
  }

  isAccessBlocked() {
    //let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return false;
  }
}
