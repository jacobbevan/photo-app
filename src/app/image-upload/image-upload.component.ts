import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { UploadSummary, UploadStatus, UploadItem } from "../model/uploadSummary";
import { UploadService } from "../services/uploadService";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit, OnDestroy {

  private uploadStatus =  UploadStatus;
  private newUpload : UploadSummary;
  private uploads : UploadSummary[];
  private subUpload : Subscription;
  private testUpload : UploadSummary;
  constructor(private uploadService : UploadService) { }

  ngOnInit() {
    this.subUpload = this.uploadService.Active.subscribe(u=> this.uploads = u);

    let upload : UploadItem =         {
      id : "456",
      status : UploadStatus.Ongoing,
      file : new File(["some content"],"DOC287.PNG"),
      dataUrl : ""    
    };


    this.testUpload = {
      id : "123",
      status : UploadStatus.Failed,
      items : [
        {
          id : "456",
          file : new File(["some content"],"DOC287.PNG"),    
          status : UploadStatus.Ongoing
        },
        {
          id : "457",
          file : new File(["some content"],"DOC287.PNG"),    
          status : UploadStatus.Completed
        },
        {
          id : "458",
          file : new File(["some content"],"DOC287.PNG"),    
          status : UploadStatus.NotStarted
        },
        {
          id : "458",
          file : new File(["some content"],"DOC287.PNG"),    
          status : UploadStatus.Failed
        },
      ]
    };
  }

  ngOnDestroy(): void {
    this.subUpload.unsubscribe();
  }

  setFiles(event) : void {
    let fileList :FileList = event.target.files;
    
    if(fileList == undefined || fileList == null){
      this.newUpload == null;
      return;
    }
    this.newUpload = UploadSummary.createNewUpload(fileList);
    
  }

  onSubmit(f : NgForm){
    this.uploadService.startUpload(this.newUpload);
    f.reset();

  }
}
