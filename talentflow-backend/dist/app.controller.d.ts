import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getRoot(): {
        status: string;
        service: string;
        version: string;
    };
    getHealth(): {
        status: string;
        service: string;
        aws_region: string;
        s3_bucket: string;
        creds: {
            ACCESS_KEY_ID: boolean;
            AWS_ACCESS_KEY_ID: boolean;
            SECRET_ACCESS_KEY: boolean;
            AWS_SECRET_ACCESS_KEY: boolean;
            accessKeyLast4: string;
            secretHasSpace: boolean;
        };
    };
}
