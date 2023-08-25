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
  selector: 'material-entry',
  templateUrl: './material-entry.component.html',
  styleUrls: ['./material-entry.component.scss']
})
export class MaterialEntryComponent {

  
  public readonly backendService : string = 'http://localhost:4000/material/new'

  private httpClient: HttpClient
  submitClicked:boolean = true;
  materialEntryForm: FormGroup;
  materialInfoObj:any={
    driverName:'',
    vehicleNumber:'',
    date:'',
    inTime:'',
    outTime:'',
    mobileNumber:'',
    materialDescription:'',
    materialDocument:'',
    photo:[]
    //,
    //extra:''
  }
  selectedImage!: File;

  constructor(httpClient: HttpClient, private fb: FormBuilder){
    this.httpClient=httpClient

    this.materialEntryForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      vehicle: ['', [Validators.required, Validators.pattern('^[A-Z]{2} [0-9]{2} [A-Z]{2} [0-9]{4}$')]],
      //materialDoc: ['', [Validators.required]],
      materialDesc: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
   }



  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0] as File;
    
    if (this.selectedImage) {
      this.getBase64(this.selectedImage).then((base64) => {
        this.materialInfoObj.materialDocument = base64;
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

  onMaterialEntry():void{
    const now = new Date();
    this.submitClicked=false;
    console.log(JSON.stringify(this.materialInfoObj));
    //this.materialInfoObj.inTime=now.toLocaleString();
    this.materialInfoObj.inTime=now.toLocaleTimeString();
    this.materialInfoObj.date = now.toUTCString().substring(5,16);
    console.log("Date = "+this.materialInfoObj.date);
    console.log("In Time = "+this.materialInfoObj.inTime);
      this.httpClient.post(this.backendService, this.materialInfoObj).subscribe((data:any)=>{console.log(" Material Added/n----", data)});
      alert("Material Added Successfully.....");
      /*const response = fetch(this.backendService, {
        method: 'POST',
        body: JSON.stringify(this.visitorInfoObj),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});*/
      //console.log('Visitor Added', response)
      //this.httpClient.get('http://localhost:4000/visitor/1').subscribe((data: any)=>{console.log("Get Visitor", data)})

      //console.log("Get Visitor", resp)

  }
/*
  videoHeight = 200;
  videoWidth = 200;
  videoSrc!: string;
  canvasTransform = '';
  videoTransform = '';
  image!: string | null;

  async captureImage() {
    const video = document.querySelector('video') as HTMLVideoElement;
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;

    canvas.getContext('2d')?.drawImage(video, 0, 0, this.videoWidth, this.videoHeight);
    this.image = canvas.toDataURL('image/jpeg'); // Base64 encoded image data
  }

  async uploadImage() {
    if (!this.image) {
      console.error('No image captured yet!');
      return;
    }
  }
*/

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
    this.materialInfoObj.photo=this.sysImage;
    console.info('got webcam image', this.sysImage);
    console.info("Material Info--------", this.materialInfoObj)
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
  pdf.text('Material Info', 80, 50);


  // Add an image to PDF
  const imageUrl = 'assets/images/employee.png';
  //pdf.addImage(imageUrl, 'JPEG', 55, 50, 100, 100); // Parameters: image, format, x, y, width, height
  pdf.addImage(this.materialInfoObj.photo, 'JPEG', 60, 60, 80, 80); // Parameters: image, format, x, y, width, height

  const items = [
    ['Driver Name', this.materialInfoObj.driverName],
    ['Vehicle Number', this.materialInfoObj.vehicleNumber],
    ['Material Description', this.materialInfoObj.materialDescription],
    //['Material Document', this.materialInfoObj.materialDocument],
    ['Mobile', this.materialInfoObj.mobileNumber],
    ['InTime', this.materialInfoObj.inTime],
    ['OutTime', this.materialInfoObj.outTime]
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
  
    // Add text to PDF
    //pdf.text('Hello, this is some text!', 10, 10);
    const companyLogo = 'assets/images/logo.jpg';
    pdf.addImage(companyLogo, 'JPEG', 10, 10, 80, 10); // Parameters: image, format, x, y, width, height
    pdf.setFontSize(10);
    //pdf.setFont('bold');
    pdf.text('Material Info', 40, 30);


    // Add an image to PDF
    const imageUrl = 'assets/images/employee.png';
    //pdf.addImage(imageUrl, 'JPEG', 55, 50, 100, 100); // Parameters: image, format, x, y, width, height
    pdf.addImage(this.materialInfoObj.photo, 'JPEG', 30, 35, 40, 40); // Parameters: image, format, x, y, width, height

    const items = [
      ['Driver Name', this.materialInfoObj.driverName],
    ['Vehicle Number', this.materialInfoObj.vehicleNumber],
    ['Material Description', this.materialInfoObj.materialDescription],
    //['Material Document', this.materialInfoObj.materialDocument],
    ['Mobile', this.materialInfoObj.mobileNumber],
    ['Date', this.materialInfoObj.date],
    ['Delivery Time', this.materialInfoObj.inTime],
    //['OutTime', this.materialInfoObj.outTime]
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
    pdf.text('Driver Sign         Officer Sign       Security Sign', 20, 135);
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
