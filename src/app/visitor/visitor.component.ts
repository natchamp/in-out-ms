import { Component } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss']
})
export class VisitorComponent implements OnInit{

  public readonly backendService : string = 'http://localhost:4000/visitor/new'

  private httpClient: HttpClient

  visitorInfoObj:any={
    name:'',
    reason:'',
    date:'',
    inTime:'',
    outTime:'',
    mobile:'',
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
      console.log(JSON.stringify(this.visitorInfoObj));
      this.httpClient.post(this.backendService, this.visitorInfoObj).subscribe((data:any)=>{console.log(" Visitor Added/n----", data)});
      /*const response = fetch(this.backendService, {
        method: 'POST',
        body: JSON.stringify(this.visitorInfoObj),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});*/
      //console.log('Visitor Added', response)
      this.httpClient.get('http://localhost:4000/visitor/1').subscribe((data: any)=>{console.log("Get Visitor", data)})

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
  
}