import { NextRequest } from "next/server";
import { createRouterMap } from "../core";

export const createNextHandler = <Router extends object>({
    router,
    createContext = async () => ({}),
    prefix,
}: {
    router: Router;
    createContext?: (req: NextRequest) => Promise<any> | any;
    prefix?: string;
}) => {
    const map = createRouterMap(router);
    return async (req: NextRequest) => {
        const url = new URL(req.url!);
        const path = prefix ? url.pathname.replace(prefix, "") : url.pathname;

        let handler: any;
        let params: Record<string, string> = {};

        for (const route in map) {
            const { regex, keys, handler: routeHandler } = map[route];
            const match = path.match(regex);

            if (match) {
                handler = routeHandler;
                keys.forEach((name, index) => {
                    params[name] = match[index + 1].replace(`${name}:`, "");
                });
                break;
            }
        }

        if (typeof handler === "function") {
            const context = {
                path: url,
                params,
                ...(await createContext(req)),
            };

            const body = await req.json().catch(() => void 0);

            const response = await handler(body, context);

            return Response.json(response, { status: 200 });
        } else {
            return Response.json("Not found", { status: 404 });
        }
    };
};
