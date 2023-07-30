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


@Component({
  selector: 'employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  hide = true;
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
    console.log(JSON.stringify(this.employeeInfoObj));
    this.httpClient.post(this.backendService, this.employeeInfoObj).subscribe((data:any)=>{console.log(" Employee Added/n----", data)});
    alert("Employee Added Successfully.....");
    //console.log('Visitor Added', response)
    this.httpClient.get('http://localhost:4000/employee/087150f0-db90-4a69-84ea-6fe3f1c3ad2f').subscribe((data: any)=>{console.log("Get Employee", data)})

    //console.log("Get Visitor", resp)

   }

  //------------------PDF Genaration Code  -------------------------------------
  
  
//--------------------

}
