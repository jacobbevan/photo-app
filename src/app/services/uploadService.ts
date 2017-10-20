import { UploadSummary, UploadStatus, UploadItem } from "../model/uploadSummary";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Injectable } from "@angular/core";
import { Headers, Http, Response } from '@angular/http';
import { ImageSummary } from "../model/imageSummary";

@Injectable()
export class UploadService
{

    private items : UploadSummary[] = [];

    Added : Subject<UploadSummary> = new Subject<UploadSummary>();
    Updated : Subject<UploadSummary> = new Subject<UploadSummary>();
    Active : BehaviorSubject<UploadSummary[]> = new BehaviorSubject<UploadSummary[]>([]);    


    constructor(private http: Http) {}

    public cancelUpload(upload : UploadSummary) : void {

    }

    public removeUpload(upload : UploadSummary) : void {

    }

    public retryUpload(upload : UploadSummary) : void {

    }


    private postImage2(http: Http, summary : UploadSummary, index : number) : void  {

        let input = new FormData();

        const item = summary.items[index];
        input.append("file", item.file);
        input.append("folder", "folder");

        item.status = UploadStatus.Ongoing;
        this.UpdateStatus(summary);        
        
        http.post("http://localhost:5000/api", input).toPromise().then(
            (res ) => {
                item.status = UploadStatus.Completed;
                item.summary = JSON.parse(res.text());
                this.UpdateStatus(summary);
            },
            (err)=> {
                item.status = UploadStatus.Failed;
                "Error " + console.log(err);
                this.UpdateStatus(summary);
            })
        .then(
            () => {
                if(index + 1 < summary.items.length) {
                    this.postImage2(http, summary, index+1);
                }
            },
            (err)=> {
                console.log(err);
            });
    }



    private postImage(http: Http, summary : UploadSummary, item : UploadItem) : void {

        let input = new FormData();
        input.append("file", item.file);
        input.append("folder", "folder");

        http.post("http://localhost:5000/api", input).toPromise().then(
            (res ) => {
                item.status = UploadStatus.Completed;
                item.summary = JSON.parse(res.text());
                this.UpdateStatus(summary);
            },
            (err)=> {
                item.status = UploadStatus.Failed;
                "Error " + console.log(err);
                this.UpdateStatus(summary);
            });
        
        item.status = UploadStatus.Ongoing;
        this.UpdateStatus(summary);        
    }

    public startUpload(upload : UploadSummary) : void {

        // for(let item of upload.items){
        //     this.postImage(this.http, upload, item);
        // }
        
        this.postImage2(this.http, upload, 0);
        this.items.push(upload);
        this.Added.next(upload);
        this.Active.next(this.items);
    }
    
    public UpdateStatus(summary : UploadSummary) : void {

        const statuses = summary.items.map(i=>i.status);

        if(statuses.some((value, index,array) => value == UploadStatus.Failed)) {
            summary.status = UploadStatus.Failed;
            return;
        }

        if(statuses.every((value, index,array) => value == UploadStatus.Completed)) {
            summary.status = UploadStatus.Completed;
            return;
        }

        if(statuses.every((value, index,array) => value == UploadStatus.NotStarted)) {
            summary.status = UploadStatus.NotStarted;
            return;
        }

        summary.status = UploadStatus.Ongoing;

        this.Updated.next(summary);
    }    
}