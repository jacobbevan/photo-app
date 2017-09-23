export class ImageSummary {

    id : string;
    caption : string;
    created : Date;
    updated : Date;
       
    constructor(id : string, caption : string)
    {
        this.id = id;
        this.caption = caption;
        this.created = new Date(Date.now());
        this.updated = this.created;        
    }
}