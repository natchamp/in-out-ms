import { Component, OnInit } from '@angular/core';
import { Book, CategoryBooks, CategoryVisitors, Visitor } from '../models/models';
import { ApiService } from '../services/api.service';

import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

@Component({
  selector: 'visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.scss']
})
export class VisitorListComponent {

  availableVisitors: Visitor[] = [];
  visitorsToDisplay: CategoryVisitors[] = [];
  displayedColumns: string[] = [
    'photo',
    'name',
    'reason',
    'whomToMeet',
    'mobile',
    "date",
    'intime',
    'outtime',
    'action'
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAllVisitors().subscribe({
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

  isBlocked() {
    let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return blocked;
  }

  isAccessBlocked() {
    //let blocked = this.api.getTokenUserInfo()?.blocked ?? true;
    return false;
  }
}