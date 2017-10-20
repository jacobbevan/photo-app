import { ImageSummary } from "./imageSummary";

export enum UploadStatus {
    NotStarted,
    Ongoing,
    Completed,
    Failed
}

export class UploadItem {
    public id : string;
    public status : UploadStatus;
    public file : File;   
    public summary? : ImageSummary;
}

export class UploadSummary {
    public id : string;
    public status : UploadStatus;
    public items : UploadItem[];

    public static createNewUpload(files : FileList) : UploadSummary {
        
        let items : UploadItem[] = [];
        
        for(let i = 0; i < files.length; i++){
            let file = files[i];
            let item : UploadItem = {
                file : file,
                status : UploadStatus.NotStarted,
                id : "abc",
            }
            items.push(item);
        }

        return {
            id : "efg",
            status : UploadStatus.NotStarted,
            items : items
        };
    }
}

