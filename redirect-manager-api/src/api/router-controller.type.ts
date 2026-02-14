import {Router} from "express";

export type RouterController = {
    initRoutes(): Router
    getBasePath(): string
}