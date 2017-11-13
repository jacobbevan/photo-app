import { ImageSummary } from './imageSummary';

export enum UploadStatus {
    NotStarted,
    Ongoing,
    Completed,
    Failed
}

export class UploadItem {
    public status: UploadStatus;
    public file: File;
    public summary?: ImageSummary;
}

export class UploadSummary {
    public status: UploadStatus;
    public items: UploadItem[];
    isCancelled = false;

    public static createNewUpload(files: FileList): UploadSummary {

        const items: UploadItem[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const  item: UploadItem = {
                file : file,
                status : UploadStatus.NotStarted
            };
            items.push(item);
        }

        return {
            status : UploadStatus.NotStarted,
            items : items,
            isCancelled : false
        };
    }
}

