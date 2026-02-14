import {Configuration} from "../config";
import {bootstrapInfrastructure} from "./bootstrap-infrastructure";
import {bootstrapServices} from "./bootstrap-services";
import {bootstrapRoutes} from "./bootstrap-routes";
import {bootstrapApp} from "./bootstap-app";
import {Application} from "express";

/**
 * Bootstrap the application.
 * This function can be used to perform any necessary initialization before the server starts.
 * For example, you can connect to a database, load configuration, or set up logging here.
 * Motivation:
 * - Centralized initialization: Having a single entry point for bootstrapping the application allows for better organization and separation of concerns.
 *  It keeps the initialization logic separate from the main application logic.
 * - Flexibility: It allows for more flexibility in how the application is initialized. For example, you can swap out different implementations of services or infrastructure components without changing the main application code.
 * - Testing: It makes it easier to test the initialization logic separately from the main application logic. You can write unit tests for the bootstrap function without having to start the entire server.
 * - Scalability: As the application grows, the initialization logic may become more complex. Having a dedicated bootstrap function allows you to manage this complexity more effectively.
 *
 * @returns {Promise<ReturnType<typeof bootstrapApp>>} The initialized Express application.
 */
export async function bootstrap(): Promise<{ configuration: Configuration, app: Application }> {
    // 1. Load configuration
    const configuration = new Configuration();

    // 2. Initialize infrastructure (e.g., database connections, repositories)
    const infrastructure = bootstrapInfrastructure({configuration});

    // 3. Initialize services
    const services = bootstrapServices({ configuration, infrastructure });

    // 4. Initialize routes
    const routes = bootstrapRoutes({ configuration, services });

    // 5. Initialize the Express application with middleware and routes
    return {
        configuration,
        app: await bootstrapApp({configuration, routes, services})
    };
}