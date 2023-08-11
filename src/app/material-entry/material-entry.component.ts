import { Component } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { OnInit, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'material-entry',
  templateUrl: './material-entry.component.html',
  styleUrls: ['./material-entry.component.scss']
})
export class MaterialEntryComponent {

  
  public readonly backendService : string = 'http://localhost:4000/material/new'

  private httpClient: HttpClient
  submitClicked:boolean = true;
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

  constructor(httpClient: HttpClient){
    this.httpClient=httpClient
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
    ['Material Document', this.materialInfoObj.materialDocument],
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

showButton()
{
return this.submitClicked;
}
//--------------------



}
