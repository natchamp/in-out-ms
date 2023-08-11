import { Component } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { User, UserType, RegistrationObj } from '../models/models';
import { ApiService } from '../services/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  submitClicked:boolean = true;
  responseMsg: string = 'Testing Employee entry';
  employeeEntryForm: FormGroup;

  ///-------------------camera----------
  private trigger: Subject<any> = new Subject();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();
  sysImage = '';

  
  public readonly backendService : string = 'http://localhost:4000/employee/new'

  private httpClient: HttpClient

  employeeInfoObj:any={
    name:'',
    reason:'',
    date:'',
    inTime:'',
    outTime:'',
    mobileNumber:'',
   // whomToMeet:'',
    photo:[]
    //,
    //extra:''
  }

  constructor(httpClient: HttpClient,private fb: FormBuilder, private api: ApiService){
    this.httpClient=httpClient

    this.employeeEntryForm = fb.group(
      {
        firstName: fb.control('', [Validators.required]),
        lastName: fb.control('', [Validators.required]),
        email: fb.control('', [Validators.required, Validators.email]),
        password: fb.control('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ]),
      } as AbstractControlOptions
    );
   }


  ngOnInit() {}
  public getSnapshot(): void {
    this.trigger.next(void 0);
  }
  public captureImg(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage!.imageAsDataUrl;
    this.employeeInfoObj.photo=this.sysImage;
    console.info('got webcam image', this.sysImage);
    //console.info("Visitor Info--------", this.visitorInfoObj)
  }
  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }



  getNameErrors() {
    if (this.Name.hasError('required')) return 'Field is requied!';
    return '';
  }
  getReasonErrors() {
    if (this.Reason.hasError('required')) return 'Field is requied!';
    return '';
  }
  getMobileNumberErrors() {
    if (this.MobileNumber.hasError('required')) return 'Mobile Number is required!';
   ///if (this.MobileNumber.hasError('mobile')) return 'Mobile Number is invalid.';
    return '';
  }

  get Name(): FormControl {
    return this.employeeEntryForm.get('name') as FormControl;
  }
  get Reason(): FormControl {
    return this.employeeEntryForm.get('reason') as FormControl;
  }
  get MobileNumber(): FormControl {
    return this.employeeEntryForm.get('mobileNumber') as FormControl;
  }


   onEmployeeEntry():void{
    const now = new Date();
    this.submitClicked=false;
    console.log(JSON.stringify(this.employeeInfoObj));
    this.employeeInfoObj.inTime=now.toLocaleTimeString();
    this.employeeInfoObj.date = now.toUTCString().substring(5,16);
    console.log("In Time = "+this.employeeInfoObj.inTime);
    this.httpClient.post(this.backendService, this.employeeInfoObj).subscribe((data:any)=>{console.log(" Employee Added/n----", data)});
    alert("Employee Added Successfully.....");
    //console.log('Visitor Added', response)
    
    
    //this.httpClient.get('http://localhost:4000/employee/087150f0-db90-4a69-84ea-6fe3f1c3ad2f').subscribe((data: any)=>{console.log("Get Employee", data)})
    
    //this.hide=true;
    //console.log("Get Visitor", resp)

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
      pdf.text('Employee Info', 80, 50);


      // Add an image to PDF
      const imageUrl = 'assets/images/employee.png';
      //pdf.addImage(imageUrl, 'JPEG', 55, 50, 100, 100); // Parameters: image, format, x, y, width, height
      pdf.addImage(this.employeeInfoObj.photo, 'JPEG', 60, 60, 80, 80); // Parameters: image, format, x, y, width, height

      const items = [
        ['Employee Name', this.employeeInfoObj.name],
        ['Reason', this.employeeInfoObj.reason],
        ['Mobile', this.employeeInfoObj.mobileNumber],
        ['Date', this.employeeInfoObj.date],
        ['InTime', this.employeeInfoObj.inTime],
        ['OutTime', this.employeeInfoObj.outTime]
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
