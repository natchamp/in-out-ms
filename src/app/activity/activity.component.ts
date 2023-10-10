import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {


  constructor(private api: ApiService) {}

  getEmployeeData(){
      this.api.getAllEmployees().subscribe((data: any[]) => {
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
    this.api.getAllVisitors().subscribe((data: any[]) => {
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
    this.api.getAllMaterials().subscribe((data: any[]) => {
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
    this.api.getAllMaterialExit().subscribe((data: any[]) => {
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
