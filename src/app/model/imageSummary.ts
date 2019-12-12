export class ImageSummary {

    id: string;
    caption: string;
    created: Date;
    updated: Date;
    _links: Links;

    constructor(id: string, caption: string) {
        this.id = id;
        this.caption = caption;
        this.created = new Date(Date.now());
        this.updated = this.created;
    }
}

export class Links {
    thumb : Link;
    image : Link;
}

export class Link {
    href: URL;
}

export class QueryResult<T> {
    records: ImageSummary[];
    next: Link;
    nextStartKey : string;
}