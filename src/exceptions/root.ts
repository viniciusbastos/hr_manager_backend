export class HttpException extends Error{
    message: string;
    errorCode: any;
    statusCode:number;
    errors: any

    constructor(message:string,errorCode:any, statusCode: number, errors:any){
        super(message)
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors = errors
    }

}

export enum ErrorCode {
    USER_NOT_FOUD = 1001,
    USER_ALREDY_EXISTS = 1002,
    ICORRET_PASSWORD = 1003
}