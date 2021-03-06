import { OptionsBase, ProxyOptions } from "./proxy-options";

export interface ListOptionsAttributes extends OptionsBase {
    /**
     * Maximum number of items to fetch at the same time
     * If not provided but maxItems is it will use maxItems value
     */
    pageSize?: number;

    /**
     * Maximum number of items to return from the list proxy(If you only want to show the first 5 items)
     */
    maxItems?: number;

    /**
     *
     */
    filter?: string;

    /**
     * Other options
     */
    [key: string]: any;
}

export class ListOptions extends ProxyOptions {
    public pageSize: number;
    public maxItems: number;
    public filter: string;

    public original: ListOptionsAttributes;

    constructor(attributes: ListOptionsAttributes | ListOptions) {
        super(attributes);
        this.pageSize = this.original.pageSize;
        this.maxItems = this.original.maxItems;
        this.filter = this.original.filter;
    }

    protected specialAttributes(): string[] {
        return super.specialAttributes().concat(["filter", "maxItems", "pageSize"]);
    }

    /**
     * Computed value using the pageSize and maxItems provided.
     */
    public get maxResults(): number {
        const { maxItems, pageSize } = this;
        if (!pageSize) {
            return maxItems || null;
        }
        if (!maxItems) {
            return pageSize || null;
        }

        if (maxItems < pageSize) {
            return maxItems;
        } else {
            return pageSize;
        }
    }
}
