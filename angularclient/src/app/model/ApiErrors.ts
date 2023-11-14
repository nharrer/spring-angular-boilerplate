export class ApiError {
    constructor(
        public message: string,
        public field: string | null = null
    ) {
    }
}

export class ApiErrors {
    public errors: Array<ApiError> = [];
    public cause: any = null;

    public constructor(...e: Array<ApiError>) {
        this.errors = e;
    }

    public add(apiError: ApiError): void {
        this.errors.push(apiError);
    }

    public errorString(fieldName: string, delimiter = ', '): string {
        let str = '';
        for (const err of this.errors) {
            if (fieldName === err.field) {
                if (str) {
                    str += delimiter;
                }
                str += err.message;
            }
        }
        return str;
    }

    public hasGlobalErrors(): boolean {
        for (const err of this.errors) {
            if (err.field === null) {
                return true;
            }
        }
        return false;
    }

    public globalErrorsAsHtml(): string {
        let errStr: Array<string> = [];
        for (const apiError of this.errors) {
            if (apiError.field === null) {
                errStr.push(apiError.message);
            }
        }
        return errStr.join('<br>');
    }
}
