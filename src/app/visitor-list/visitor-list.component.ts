import { Component, OnInit } from '@angular/core';
import { Book, CategoryBooks, CategoryVisitors, Visitor } from '../models/models';
import { ApiService } from '../services/api.service';

import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.scss']
})
export class VisitorListComponent {

  availableVisitors: Visitor[] = [];
  visitorsToDisplay: CategoryVisitors[] = [];
  displayedColumns: string[] = [
    'id',
    'photo',
    'name',
    'reason',
    'whomToMeet',
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
    this.api.getAllVisitorLatest().subscribe({
      next: (res: Visitor[]) => {
        this.availableVisitors = [];
        console.log(res);
        for (var visitor of res) this.availableVisitors.push(visitor);
        //this.updateList();

        this.addcategory();
        this.filterVisitors();

        //this.sortVisitors();
        console.log(this.availableVisitors)
      },
      error: (err: any) => console.log(err),
    });
  }

addcategory(){
  //for( let visitor of this.availableVisitors){}
  
  this.availableVisitors.forEach(element => {
    element.category='Visitor';
    if(element.outTime.trim().length==0){
      element.subCategory="IN";
      element.isOut=false;
    }
    else{
      element.subCategory="OUT";
      element.isOut=true;
  }
  });

  console.log(this.availableVisitors);
}

filterVisitors(){
  this.visitorsToDisplay = [];
    for (let visitor of this.availableVisitors) {
      let exist = false;
      for (let categoryVisitors of this.visitorsToDisplay) {
        if (
          visitor.category === categoryVisitors.category &&
          visitor.subCategory === categoryVisitors.subCategory
        )
          exist = true;
      }

      if (exist) {
        for (let categoryVisitors of this.visitorsToDisplay) {
          if (
            visitor.category === categoryVisitors.category &&
            visitor.subCategory === categoryVisitors.subCategory
          )
            categoryVisitors.visitors.push(visitor);
        }
      } else {
        this.visitorsToDisplay.push({
          category: visitor.category,
          subCategory: visitor.subCategory,
          visitors: [visitor],
        });
      }
    }
}


  getVisitorCount() {
    return this.visitorsToDisplay.reduce((pv, cv) => cv.visitors.length + pv, 0);
  }


  search(value: string) {
    value = value.toLowerCase();
    this.filterVisitors();
    if (value.length > 0) {
      this.visitorsToDisplay = this.visitorsToDisplay.filter((categoryVisitors) => {
        categoryVisitors.visitors = categoryVisitors.visitors.filter(
          (visitor) =>
          visitor.name.toLowerCase().includes(value) ||
          visitor.mobileNumber.toLowerCase().includes(value)
        );
        return categoryVisitors.visitors.length > 0;
      });
    }
  }

  outVisitor(visitor: Visitor) {
    const now = new Date();
    visitor.outTime=now.toLocaleTimeString();
    //let userid = this.api.getTokenUserInfo()?.id ?? 0;
    this.api.outVisitor(visitor).subscribe({
      next: (res: any) => {
        if (res === 'Visitor Out Successfully...') {
          visitor.isOut = true;
        }
        //alert('Visitor Out Successfully...');
        alert(res.toString());
      },
      error: (err: any) => console.log(err),
    });

    this.filterVisitors();
    location.reload()
  }


  deleteVisitor(visitor:Visitor){

    const response = confirm("Are you Sure you want to delete Visitor Record - Name : "+visitor.name);

    if(response){
    console.log("Deleting Visitor = "+visitor.name);
    this.api.deleteVisitor(visitor).subscribe({
      next: data => {
          
      },
  });
    alert("Visitor Record Deleted Successfully...");
    this.filterVisitors();
    location.reload()
  }
  }


  isBlocked() {
    let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return blocked;
  }

  isAccessBlocked() {
    //let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return false;
  }

  generateA6PDF(visitorInfoObj:Visitor){
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [105, 148], // A6 dimensions in millimeters (width x height)
    });
    
      // Add text to PDF
      const companyLogo = 'assets/images/logo.jpg';
      //pdf.addImage(companyLogo, 'JPEG', 10, 10, 80, 10); // Parameters: image, format, x, y, width, height
      pdf.setFontSize(18);
      
      pdf.text('Innovative Technomics Pvt. Ltd.', 8, 17);
      pdf.setFontSize(10);
      //pdf.setFont('bold');
      pdf.text('Visitor Gatepass', 38, 25);
      pdf.text('No. - '+visitorInfoObj.id, 45, 30);
  
  
      // Add an image to PDF
      const imageUrl = 'assets/images/employee.png';
      //pdf.addImage(imageUrl, 'JPEG', 55, 50, 100, 100); // Parameters: image, format, x, y, width, height
      pdf.addImage(visitorInfoObj.photo, 'JPEG', 30, 35, 40, 40); // Parameters: image, format, x, y, width, height
  
      const items = [
        ['Visitor Name', visitorInfoObj.name],
        ['Whom To Meet',visitorInfoObj.whomToMeet],
        ['Reason', visitorInfoObj.reason],
        ['Mobile', visitorInfoObj.mobileNumber],
        ['Date', visitorInfoObj.date],
        ['InTime', visitorInfoObj.inTime],
        //['OutTime', this.visitorInfoObj.outTime]
        // Add more items here
      ];
  
      pdf.setFontSize(8);
      autoTable(pdf, {
       columnStyles: { 0: { fontSize: 8 } }, 
       styles: {fontSize:8},
        margin: { top: 80 },
        body: items,
  
      })
      
      pdf.setFontSize(8)
      pdf.text('Visitor Sign         Officer Sign       Security Sign', 20, 135);
      pdf.setFontSize(5)
      pdf.text('**Note - This is an auto generated pass', 30, 140);
      //pdf.text('       *** Do not lose this pass ***',30,135)
      pdf.output('dataurlnewwindow');
      //pdf.autoPrint()
      //pdf.save('generated-pdf.pdf');
    
    
  }
  
}