import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    health(): object {
        return { status: 200, message: "Home page" };
    }
}
