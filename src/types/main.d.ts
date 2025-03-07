declare interface GatewayEvent {
    name: string,
    code: (...params) => Promise<void>;
    once: boolean;
}

declare interface EventsClass {
    functions: Array<GatewayEvent>;
    parse: () => Promise<GatewayEvent[]>;
    listen: () => Promise<void>;
}