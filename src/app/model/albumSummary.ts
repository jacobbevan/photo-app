export class AlbumSummary {
    id : string;
    name : string;
    description : string;
    imageIds : string[];
    created : Date;
    updated : Date;

    constructor(id: string, name:string, description:string, imageIds : string[])
    {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageIds = imageIds;
        this.created = new Date(Date.now());
        this.updated = this.created;
    }
}