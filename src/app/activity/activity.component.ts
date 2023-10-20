import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import * as XLSX from 'xlsx';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  now:Date;
  yesterday:Date;

  currDate: string='';
  yestDate: string='';

  constructor(private api: ApiService) {
    this.now=new Date();
    this.yesterday=new Date();
    //this.currDate='';
    //this.yestDate='';
  }

  getDataFilters(){

     //====================================================

     const currentDate = new Date(this.currDate); // Creates a Date object representing the current date and time

     // Get date components
     const year = currentDate.getFullYear();
     const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
     const day = currentDate.getDate().toString().padStart(2, '0');
 
     // Get time components
     const hours = currentDate.getHours().toString().padStart(2, '0');
     const minutes = currentDate.getMinutes().toString().padStart(2, '0');
     const seconds = currentDate.getSeconds().toString().padStart(2, '0');
     const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');
 
     // Construct the formatted string
     const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
 
     console.log(formattedDate);
 
 
     //========================================================
 
           //const currentDate = new Date(); // Current date and time
       const yesterdayDate = new Date(this.yestDate); // Copy the current date to another date object
 
       // Subtract one day from yesterday's date
       //yesterdayDate.setDate(currentDate.getDate() - 1);
 
       // Get date components
       const year1 = yesterdayDate.getFullYear();
       const month1 = (yesterdayDate.getMonth() + 1).toString().padStart(2, '0');
       const day1 = yesterdayDate.getDate().toString().padStart(2, '0');
 
       // Get time components
       const hours1 = yesterdayDate.getHours().toString().padStart(2, '0');
       const minutes1 = yesterdayDate.getMinutes().toString().padStart(2, '0');
       const seconds1 = yesterdayDate.getSeconds().toString().padStart(2, '0');
       const milliseconds1 = yesterdayDate.getMilliseconds().toString().padStart(3, '0');
 
       // Construct the formatted string
       const formattedYesterdayDate = `${year1}-${month1}-${day1} ${hours1}:${minutes1}:${seconds1}.${milliseconds1}`;
 
       console.log(formattedYesterdayDate);
 
 
     //======================================================
     //const params = new HttpParams().set('startDate', this.yesterday.setDate(this.yesterday.getDate()-1)).set('endDate',this.now.toString());
     const params = new HttpParams().set('startDate', formattedDate).set('endDate',formattedYesterdayDate);
     //const params = new HttpParams().set('startDate', startDate.toString()).set('endDate',endDate.toString());
     console.log("Fetching Visitor Data...");
     console.log("Start Date : " + params.get("startDate") + "\nEnd Date : "+params.get("endDate"));
     return params;
  }

  getEmployeeData(){

      const params = this.getDataFilters();

      this.api.getAllEmployees(params).subscribe((data: any[]) => {
        this.exportEmployeeData(data);
        console.log("Employee Data Fetch Successfully...");
      });

  }
  exportEmployeeData(data: any[]){

    const header = ['ID', 'Name', 'Reason', 'Mobile', 'Date','OutTime','InTime']; // Replace with your actual header
    const rows = data.map(item => [item.id, item.name, item.reason, item.mobileNumber, item.date, item.outTime, item.inTime]); // Replace with your actual data mapping

    const csvContent = [header.join(',')].concat(rows.map(row => row.join(','))).join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'EmployeeData.csv';
    link.click();
  }

  getVisitorData(){
    const params = this.getDataFilters();
    this.api.getAllVisitors(params).subscribe((data: any[]) => {
      this.exportVisitorData(data);
      console.log("Visitor Data Fetch Successfully...");
    });
    
  }
  exportVisitorData(data: any[]){
    const header = ['ID', 'Name', 'Reason','WhomtoMeet', 'Mobile', 'Date','InTime','OutTime']; // Replace with your actual header
    const rows = data.map(item => [item.id, item.name, item.reason, item.whomToMeet, item.mobileNumber, item.date, item.inTime, item.outTime]); // Replace with your actual data mapping

    const csvContent = [header.join(',')].concat(rows.map(row => row.join(','))).join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'VisitorData.csv';
    link.click();
  }

  getMaterialData(){

    const params = this.getDataFilters();
    this.api.getAllMaterials(params).subscribe((data: any[]) => {
      this.exportMaterialData(data);
      console.log("Material Data Fetch Successfully...");
    });
  }
  exportMaterialData(data:any[]){
    const header = ['ID', 'Driver Name', 'Vehicle Number','Material Desc', 'Date','InTime','OutTime']; // Replace with your actual header
    const rows = data.map(item => [item.id, item.driverName, item.vehicleNumber, item.materialDescription, item.date, item.inTime, item.outTime]); // Replace with your actual data mapping

    const csvContent = [header.join(',')].concat(rows.map(row => row.join(','))).join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'MaterialData.csv';
    link.click();
  }

  getMaterialExitData(){
    const params = this.getDataFilters();
    this.api.getAllMaterialExit(params).subscribe((data: any[]) => {
      this.exportMaterialExitData(data);
      console.log("Exit Material Data Fetch Successfully...");
    });
  }
  exportMaterialExitData(data:any[]){
    const header = ['ID', 'Pickup Person Name', 'Vehicle Number','Material Desc', 'Mobile', 'Date','InTime','OutTime']; // Replace with your actual header
    const rows = data.map(item => [item.id, item.pickupPersonName, item.vehicleNumber, item.materialDescription, item.mobileNumber, item.date, item.inTime, item.outTime]); // Replace with your actual data mapping

    const csvContent = [header.join(',')].concat(rows.map(row => row.join(','))).join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'ExitMaterialData.csv';
    link.click();
  }

}
