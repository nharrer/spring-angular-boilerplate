import { Component } from '@angular/core';
import { ApiErrors } from 'src/app/model/ApiErrors';
import { DataService } from 'src/app/services/data.service';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent {

    public data = {
        name: '',
        message: ''
    }
    public error = '';

    constructor(
        private progressService: ProgressService,
        private dataService: DataService
    ) {
    }

    public ngOnInit() {
        this.progressService.wrapLoading(this.dataService.test()).subscribe(
            {
                next: (data) => {
                    if (data && data.name && data.message) {
                        this.data = data;
                    }
                },
                error: (apiErrors: ApiErrors) => {
                    this.error = apiErrors.globalErrorsAsHtml();
                }
            }
        );
    }
}
