import { Component, OnInit } from '@angular/core';
import { Book, CategoryBooks, CategoryEmployees, Employee } from '../models/models';
import { ApiService } from '../services/api.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent {
  availableEmployees: Employee[] = [];
  employeesToDisplay: CategoryEmployees[] = [];
  displayedColumns: string[] = [
    'id',
    'photo',
    'name',
    'reason',
    'mobile',
    "date",
    'intime',
    'outtime',
    'action',
    'delete',
    'print'
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAllEmployeesLatest().subscribe({
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
      element.subCategory="OUT";
      element.isOut=false;
    }
    else{
      element.subCategory="IN";
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
        //alert(res.toString());
      },
      error: (err: any) => console.log(err),
    });

    this.filterEmployees();
    location.reload()
  }

  deleteEmployee(employee:Employee){

    const response = confirm("Are you Sure you want to delete Employee Record - Name : "+employee.name);

    if(response){
    console.log("Deleting Employee = "+employee.name);
    this.api.deleteEmployee(employee).subscribe({
      next: data => {
          
      },
  });
    alert("Employee Record Deleted Successfully...");
    this.filterEmployees();
    location.reload()
  }
  }

  isAccessBlocked() {
    //let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return false;
  }

  generateA6PDF(employeeInfoObj: Employee){
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [105, 148], // A6 dimensions in millimeters (width x height)
    });
    
    pdf.setFont("Helvetica",'bold');
      // Add text to PDF
      const companyLogo = 'assets/images/logo.jpg';
      //pdf.addImage(companyLogo, 'JPEG', 10, 10, 80, 10); // Parameters: image, format, x, y, width, height
      pdf.setFontSize(18);
      pdf.text('Innovative Technomics Pvt. Ltd.', 5, 17);
      pdf.setFontSize(12);
      //pdf.setFont('bold');
      pdf.text('Employee Gatepass', 35, 25);
      pdf.text('No. - '+employeeInfoObj.id, 45, 30);


      // Add an image to PDF
      const imageUrl = 'assets/images/employee.png';
      //pdf.addImage(imageUrl, 'JPEG', 55, 50, 100, 100); // Parameters: image, format, x, y, width, height
      pdf.addImage(employeeInfoObj.photo, 'JPEG', 35, 35, 40, 40); // Parameters: image, format, x, y, width, height

      const items = [
        ['Employee Name', employeeInfoObj.name],
        ['Reason', employeeInfoObj.reason],
        ['Mobile', employeeInfoObj.mobileNumber],
        ['Date', employeeInfoObj.date],
        //['InTime', this.employeeInfoObj.inTime],
        ['OutTime', employeeInfoObj.inTime],
       // [' ',' '],
        //["Employee Sign","HOD Sign"]
        //['OutTime', this.employeeInfoObj.outTime]
        // Add more items here
      ];

      pdf.setFontSize(10);
      autoTable(pdf, {
        
       columnStyles: { 0: { fontSize: 12 } }, 
       styles: {fontSize:12,fontStyle: 'bold',textColor: [0,0,0]},
        margin: { top: 80 },
        body: items,
        theme: 'plain',

      })
      
      pdf.setFontSize(12);
      pdf.text('Employee Sign         HOD Sign', 20, 145);
      
      pdf.setFontSize(5)
      //pdf.text('        **Note - This is an auto generated pass', 30, 140);
     // pdf.text('       *** Do not lose this pass ***',30,145)
      pdf.output('dataurlnewwindow');
      //pdf.autoPrint()
      //pdf.save('generated-pdf.pdf');
    
    
  }
}
