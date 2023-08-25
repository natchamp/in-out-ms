import { Component } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { OnInit, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss']
})
export class VisitorComponent implements OnInit{

  public readonly backendService : string = 'http://localhost:4000/visitor/new'

  private httpClient: HttpClient
  visitorEntryForm: FormGroup;
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

  constructor(httpClient: HttpClient, private fb: FormBuilder){
    this.httpClient=httpClient

    this.visitorEntryForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      reason: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      whomToMeet: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

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
      ['Visitor Name', this.visitorInfoObj.name],
      ['Whom To Meet', this.visitorInfoObj.whomToMeet],
      ['Reason', this.visitorInfoObj.reason],
      ['Mobile', this.visitorInfoObj.mobileNumber],
      ['InTime', this.visitorInfoObj.inTime],
      ['OutTime', this.visitorInfoObj.outTime]
      // Add more items here
    ];


    autoTable(pdf, {
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

generateA6PDF(){
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [105, 148], // A6 dimensions in millimeters (width x height)
  });
  
    // Add text to PDF
    //pdf.text('Hello, this is some text!', 10, 10);
    const companyLogo = 'assets/images/logo.jpg';
    pdf.addImage(companyLogo, 'JPEG', 10, 10, 80, 10); // Parameters: image, format, x, y, width, height
    pdf.setFontSize(10);
    //pdf.setFont('bold');
    pdf.text('Visitor Info', 40, 30);


    // Add an image to PDF
    const imageUrl = 'assets/images/employee.png';
    //pdf.addImage(imageUrl, 'JPEG', 55, 50, 100, 100); // Parameters: image, format, x, y, width, height
    pdf.addImage(this.visitorInfoObj.photo, 'JPEG', 30, 35, 40, 40); // Parameters: image, format, x, y, width, height

    const items = [
      ['Visitor Name', this.visitorInfoObj.name],
      ['Whom To Meet', this.visitorInfoObj.whomToMeet],
      ['Reason', this.visitorInfoObj.reason],
      ['Mobile', this.visitorInfoObj.mobileNumber],
      ['Date', this.visitorInfoObj.date],
      ['InTime', this.visitorInfoObj.inTime],
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


showButton()
{
  return this.submitClicked;
}
//--------------------

  
}