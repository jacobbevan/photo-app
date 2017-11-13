import { UploadSummary, UploadStatus, UploadItem } from "../model/uploadSummary";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Injectable } from "@angular/core";
import { Headers, Http, Response } from '@angular/http';
import { ImageSummary } from "../model/imageSummary";
import { environment } from '../../environments/environment';

@Injectable()
export class UploadService
{

    private items : UploadSummary[] = [];

    Added : Subject<UploadSummary> = new Subject<UploadSummary>();
    Updated : Subject<UploadSummary> = new Subject<UploadSummary>();
    Active : BehaviorSubject<UploadSummary[]> = new BehaviorSubject<UploadSummary[]>([]);


    constructor(private http: Http) {}

    public cancelUpload(upload : UploadSummary) : void {
        upload.isCancelled = true;
        this.items = this.items.filter(i=>i != upload);
        this.Active.next(this.items);

    }

    public removeUpload(upload : UploadSummary) : void {
        this.items = this.items.filter(i=>i != upload);
        this.Active.next(this.items);
    }

    public retryUpload(upload : UploadSummary) : void {

    }

    private postImage(http: Http, summary : UploadSummary, index : number) : void  {

        let input = new FormData();

        const item = summary.items[index];
        input.append("file", item.file);
        input.append("folder", "folder");

        item.status = UploadStatus.Ongoing;
        this.UpdateStatus(summary);
        
        http.post(environment.API_ROOT + 'api/', input).toPromise().then(
            (res ) => {
                item.status = UploadStatus.Completed;
                item.summary = JSON.parse(res.text());
                console.log(item.summary);
                this.UpdateStatus(summary);
            },
            (err)=> {
                item.status = UploadStatus.Failed;
                "Error " + console.log(err);
                this.UpdateStatus(summary);
            })
        .then(
            () => {
                if(!summary.isCancelled && (index + 1 < summary.items.length)) {
                    this.postImage(http, summary, index+1);
                }
            },
            (err)=> {
                console.log(err);
            });
    }

    public startUpload(upload : UploadSummary) : void {
        
        this.postImage(this.http, upload, 0);
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