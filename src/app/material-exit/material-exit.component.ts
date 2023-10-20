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
import { ApiService } from '../services/api.service';

@Component({
  selector: 'material-exit',
  templateUrl: './material-exit.component.html',
  styleUrls: ['./material-exit.component.scss']
})
export class MaterialExitComponent {

  
  
  public readonly backendService : string = 'http://localhost:4000/material/exit'

  private httpClient: HttpClient
  submitClicked:boolean = true;
  materialExitForm: FormGroup;
  materialExitInfoObj:any={
    pickupPersonName:'',
    date:'',
    inTime:'',
    outTime:'',
    mobileNumber:'',
    vehicleNumber:'',
    materialDescription:'',
    materialDocument:'',
    photo:[]
    //,
    //extra:''
  }
  selectedImage!: File;

  constructor(httpClient: HttpClient, private fb: FormBuilder, private api: ApiService){
    this.httpClient=httpClient

    this.materialExitForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      materialDesc: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      vehicle: ['', [Validators.required, Validators.pattern('^[A-Z]{2} [0-9]{2} [A-Z]{2} [0-9]{4}$')]]
    });
   }



  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0] as File;
    
    if (this.selectedImage) {
      this.getBase64(this.selectedImage).then((base64) => {
        this.materialExitInfoObj.materialDocument = base64;
      });
    }
  }

  getBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  //ngOnInit():void{}

  onMaterialExitEntry():void{
    const now = new Date();
    this.submitClicked=false;
    console.log(JSON.stringify(this.materialExitInfoObj));
    //this.materialInfoObj.inTime=now.toLocaleString();
    this.materialExitInfoObj.outTime=now.toLocaleTimeString();
    this.materialExitInfoObj.date = now.toUTCString().substring(5,16);
    console.log("Date = "+this.materialExitInfoObj.date);
    console.log("In Time = "+this.materialExitInfoObj.inTime);
      this.httpClient.post(this.backendService, this.materialExitInfoObj).subscribe((data:any)=>{console.log(" Material Added/n----", data)});
      alert("Material Added Successfully.....");

      this.api.getExitMaterialId().subscribe({
        next: (res: any) => {
          this.materialExitInfoObj.id=res;
          console.log(res);
        },
        error: (err: any) => console.log(err),
      });
      console.log(this.materialExitInfoObj.id);
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
    this.materialExitInfoObj.photo=this.sysImage;
    console.info('got webcam image', this.sysImage);
    console.info("Material Info--------", this.materialExitInfoObj)
  }
  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }
 

//------------------PDF Genaration Code  -------------------------------------

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
    pdf.text('Material Exit Gatepass', 28, 25);
    pdf.text('No. - '+this.materialExitInfoObj.id, 45, 30);


    // Add an image to PDF
    const imageUrl = 'assets/images/employee.png';
    //pdf.addImage(imageUrl, 'JPEG', 55, 50, 100, 100); // Parameters: image, format, x, y, width, height
    pdf.addImage(this.materialExitInfoObj.photo, 'JPEG', 30, 35, 40, 40); // Parameters: image, format, x, y, width, height

    const items = [
      ['Pickup Person', this.materialExitInfoObj.pickupPersonName],
      ['Vehicle Number', this.materialExitInfoObj.vehicleNumber],
      ['Mobile', this.materialExitInfoObj.mobileNumber],
    ['Material Description', this.materialExitInfoObj.materialDescription],
    ['Date', this.materialExitInfoObj.date],
    ['Exit Time', this.materialExitInfoObj.outTime],
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
    
    pdf.setFontSize(12)
    pdf.text('Officer Sign            Security Sign', 20, 145);
    pdf.setFontSize(5)
    //pdf.text('**Note - This is an auto generated pass', 35, 140);
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
