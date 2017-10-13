import { UploadSummary } from "../model/uploadSummary";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class UploadService
{

    private items : UploadSummary[] = [];
    Added : Subject<UploadSummary> = new Subject<UploadSummary>();
    Updated : Subject<UploadSummary> = new Subject<UploadSummary>();
    Active : BehaviorSubject<UploadSummary[]> = new BehaviorSubject<UploadSummary[]>([]);    
    public startUpload(upload : UploadSummary) : void {

        for(let item of upload.items){
            let local = item;
            let reader : FileReader = new FileReader();
            reader.onload = (ev : Event) => {
                local.dataUrl = reader.result as string;
                console.log(ev.target);
            };
            reader.readAsDataURL(item.file);
        }

        this.items.push(upload);
        this.Added.next(upload);
        this.Active.next(this.items);
    }
}