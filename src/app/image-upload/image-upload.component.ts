import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UploadSummary, UploadStatus, UploadItem } from '../model/uploadSummary';
import { UploadService } from '../services/uploadService';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit, OnDestroy {

  private uploadStatus =  UploadStatus;
  private subUpload: Subscription;

  uploads: UploadSummary[];
  newUpload: UploadSummary;


  constructor(private uploadService: UploadService) { }

  ngOnInit() {
    this.subUpload = this.uploadService.Active.subscribe(u => this.uploads = u);
  }

  ngOnDestroy(): void {
    this.subUpload.unsubscribe();
  }

  setFiles(event): void {
    const fileList: FileList = event.target.files;

    if (fileList === undefined || fileList == null) {
      this.newUpload = null;
      return;
    }
    this.newUpload = UploadSummary.createNewUpload(fileList);

  }

  getThumbnailURL(item: UploadItem): URL {
    if (item.summary == null) {
      return new URL('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
    } else {
      return item.summary._links.thumb.href;
    }
  }

  onClose(summary: UploadSummary): void {
    this.uploadService.removeUpload(summary);
  }

  onRetry(summary: UploadSummary): void {
    this.uploadService.retryUpload(summary);
  }

  onCancel(summary: UploadSummary): void {
    this.uploadService.cancelUpload(summary);
  }

  onSubmit(f: NgForm) {
    this.uploadService.startUpload(this.newUpload);
    f.reset();
    this.newUpload = null;
  }
}
