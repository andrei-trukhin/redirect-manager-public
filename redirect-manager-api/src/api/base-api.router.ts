import {RouterController} from "./router-controller.type";
import e from "express";

/**
 * Router to wrap all api routes with common prefix.
 */
export class BaseApiRouter implements RouterController {

    constructor(private readonly routers: RouterController[]) {
    }

    getBasePath(): string {
        return '';
    }

    initRoutes(): e.Router {
        const router = e.Router();
        for (const routerController of this.routers) {
            router.use(routerController.getBasePath(), routerController.initRoutes());
        }
        return router;
    }

}