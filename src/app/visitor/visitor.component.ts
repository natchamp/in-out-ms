import { Component } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { OnInit, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss']
})
export class VisitorComponent implements OnInit{

  public readonly backendService : string = 'http://localhost:4000/visitor/new'

  private httpClient: HttpClient
  submitClicked:boolean = true;
  visitorInfoObj:any={
    name:'',
    reason:'',
    date:'',
    inTime:'',
    outTime:'',
    mobileNumber:'',
    whomToMeet:'',
    photo:[]
    //,
    //extra:''
  }

  constructor(httpClient: HttpClient){
    this.httpClient=httpClient
   }

  //ngOnInit():void{}

  onVisitorEntry():void{
    const now = new Date();
    this.submitClicked= false;
      console.log(JSON.stringify(this.visitorInfoObj));
      this.visitorInfoObj.inTime=now.toLocaleTimeString();
    this.visitorInfoObj.date = now.toUTCString().substring(5,16);
    console.log("In Time = "+this.visitorInfoObj.inTime);
      this.httpClient.post(this.backendService, this.visitorInfoObj).subscribe((data:any)=>{console.log(" Visitor Added/n----", data)});
      alert("Visitor Added Successfully.....");

  }
//--------------------------------------
private trigger: Subject<any> = new Subject();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();
  sysImage = '';
  ngOnInit() {}
  public getSnapshot(): void {
    this.trigger.next(void 0);
  }
  public captureImg(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage!.imageAsDataUrl;
    this.visitorInfoObj.photo=this.sysImage;
    console.info('got webcam image', this.sysImage);
    console.info("Visitor Info--------", this.visitorInfoObj)
  }
  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  //------------------PDF Genaration Code  -------------------------------------
  
  generatePDF() {
    const pdf = new jsPDF();
    
    // Add text to PDF
    //pdf.text('Hello, this is some text!', 10, 10);
    const companyLogo = 'assets/images/logo.jpg';
    pdf.addImage(companyLogo, 'JPEG', 10, 10, 190, 20); // Parameters: image, format, x, y, width, height
    pdf.setFontSize(20);
    //pdf.setFont('bold');
    pdf.text('Visitor Info', 80, 50);


    // Add an image to PDF
    const imageUrl = 'assets/images/employee.png';
    //pdf.addImage(imageUrl, 'JPEG', 55, 50, 100, 100); // Parameters: image, format, x, y, width, height
    pdf.addImage(this.visitorInfoObj.photo, 'JPEG', 60, 60, 80, 80); // Parameters: image, format, x, y, width, height

    const items = [
      ['Employee Name', this.visitorInfoObj.name],
      ['Whom To Meet', this.visitorInfoObj.whomToMeet],
      ['Reason', this.visitorInfoObj.reason],
      ['Mobile', this.visitorInfoObj.mobileNumber],
      ['InTime', this.visitorInfoObj.inTime],
      ['OutTime', this.visitorInfoObj.outTime]
      // Add more items here
    ];


    autoTable(pdf, {
      //head: [['ID', 'ID']],
     // columnStyles: { 0: { halign: 'center' } }, 
     columnStyles: { 0: { fontSize: 15 } }, 
     
      margin: { top: 150 },
      body: items,
    })
    
   // pdf.table({});
    // pdf.autoTable({
    //   startY: 60,
    //   body: items,
    //   theme: 'striped',
    // });
    pdf.setFontSize(10)
    pdf.text('**Note - This is an auto generated pass', 70, 240);
    pdf.text('       *** Do not lose this pass ***',70,245)
    pdf.output('dataurlnewwindow');
    //pdf.autoPrint()
    //pdf.save('generated-pdf.pdf');
  
  
}

showButton()
{
  return this.submitClicked;
}
//--------------------

  
}