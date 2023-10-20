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

      this.employeeEntryForm = this.fb.group({
        name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        reason: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      });

    // this.employeeEntryForm = this.fb.group({
    //   name: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\'-]+')]],
    //   mobile: ['', [Validators.required, Validators.pattern('[+]?[0-9]+')]]
    // });

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

fullNameValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (!value) {
      return null; // No error if the field is empty
    }

    // Split the full name into parts (first name and last name)
    const parts = value.split(' ');

    // Check if there are at least two parts (first name and last name)
    if (parts.length < 2) {
      return { fullName: true, message: 'Please enter a valid full name.' };
    }

    return null;
  };
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
    this.api.getEmployeeId().subscribe({
      next: (res: any) => {
        this.employeeInfoObj.id=res;
        console.log(res);
      },
      error: (err: any) => console.log(err),
    });
    console.log(this.employeeInfoObj.id);
    
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
      pdf.text('Employee Gatepass', 80, 50);


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


  generateA6PDF(){
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
      pdf.text('No. - '+this.employeeInfoObj.id, 45, 30);

      // Add an image to PDF
      const imageUrl = 'assets/images/employee.png';
      //pdf.addImage(imageUrl, 'JPEG', 55, 50, 100, 100); // Parameters: image, format, x, y, width, height
      pdf.addImage(this.employeeInfoObj.photo, 'JPEG', 35, 35, 40, 40); // Parameters: image, format, x, y, width, height

      const items = [
        ['Employee Name', this.employeeInfoObj.name],
        ['Reason', this.employeeInfoObj.reason],
        ['Mobile', this.employeeInfoObj.mobileNumber],
        ['Date', this.employeeInfoObj.date],
        //['InTime', this.employeeInfoObj.inTime],
        ['OutTime', this.employeeInfoObj.inTime],
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

  

  showButton()
  {
    return this.submitClicked;
  }
//--------------------

}
