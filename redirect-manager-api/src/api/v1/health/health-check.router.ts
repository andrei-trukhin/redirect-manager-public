import {RouterController} from "../../router-controller.type";
import e from "express";
import {methodNotAllowed} from "../../shared";

export class HealthCheckRouter implements RouterController {

    private readonly startUpTime = new Date();

    constructor(private readonly data: {
        readonly healthCheckPath: string,
        readonly appVersion: string
    }) {
    }

    getBasePath(): string {
        return `${this.data.healthCheckPath}`;
    }

    initRoutes(): e.Router {
        const router = e.Router();

        router.route('/')
            .get(this.getSimpleHealthStatus.bind(this))
            .all(methodNotAllowed);

        router.route('/ready')
            .get(this.getHealthStatus.bind(this))
            .all(methodNotAllowed);

        return router;
    }

    private getSimpleHealthStatus(req: e.Request, res: e.Response) {
        const response = {
            status: 'UP'
        }
        res.status(200).send(response);
    }

    private getHealthStatus(req: e.Request, res: e.Response) {
        const response = {
            status: 'UP',
            timestamp: new Date().toISOString(),
            version: this.data.appVersion || 'unknown',
            uptime_seconds: (Date.now() - this.startUpTime.getTime()) / 1000
        };

        res.status(200).json(response);
    }
}
