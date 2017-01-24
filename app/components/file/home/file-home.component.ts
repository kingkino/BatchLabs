import { Component, HostBinding, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { Constants, FileUrlUtils } from "app/utils";
import { SidebarManager } from "../../base/sidebar";

@Component({
    selector: "bex-file-home",
    templateUrl: "file-home.html",
})
export class FileHomeComponent implements OnInit, OnDestroy {
    public url: string;

    public isPool: boolean;
    public isJob: boolean;

    public poolId: string;
    public nodeId: string;
    public jobId: string;
    public taskId: string;
    public filename: string;

    private _paramsSubscriber: Subscription;

    @HostBinding("style.display") get display() {
        return "block";
    }

    @HostBinding("style.position") get position() {
        return "absolute";
    }

    constructor(
        private sidebarManager: SidebarManager,
        private activatedRoute: ActivatedRoute) {
    }

    public ngOnInit() {
        this._paramsSubscriber = this.activatedRoute.params.subscribe((params) => {
            this.url = params["url"];
            let obj: any = FileUrlUtils.parseRelativePath(this.url);
            this.isJob = obj.type === Constants.FileSourceTypes.Job;
            this.isPool = obj.type === Constants.FileSourceTypes.Pool;

            if (this.isJob) {
                this.jobId = obj.containerName;
                this.taskId = obj.entityName;
            } else {
                this.poolId = obj.containerName;
                this.nodeId = obj.entityName;
            }

            this.filename = obj.file;
        });
    }

    public ngOnDestroy() {
        this._paramsSubscriber.unsubscribe();
    }
}