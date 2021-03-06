import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { autobind } from "core-decorators";

import { EditStorageAccountFormComponent } from "app/components/account/action/edit-storage-account";
import { SidebarManager } from "app/components/base/sidebar";
import { AccountResource, BatchApplication } from "app/models";
import { AccountService } from "app/services";

@Component({
    selector: "bl-application-error-display",
    templateUrl: "application-error-display.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationErrorDisplayComponent implements OnInit {
    @Input()
    public application: BatchApplication;

    public get batchAccount() {
        return this._batchAccount;
    }

    private _batchAccount: AccountResource;

    constructor(
        private accountService: AccountService,
        private changeDetector: ChangeDetectorRef,
        private sidebarManager: SidebarManager) {
    }

    public get hasLinkedStorageAccountIssue(): boolean {
        if (this._batchAccount) {
            return !this._batchAccount.properties
                || !this._batchAccount.properties.autoStorage
                || !this._batchAccount.properties.autoStorage.storageAccountId;
        }

        return false;
    }

    public ngOnInit() {
        this.accountService.currentAccount.subscribe((account) => {
            this._batchAccount = account;
            this.changeDetector.markForCheck();
        });
    }

    @autobind()
    public setupLinkedStorage() {
        const sidebarRef = this.sidebarManager.open("edit-storage-account", EditStorageAccountFormComponent);
        sidebarRef.component.account = this._batchAccount;
    }
}
