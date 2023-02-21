/// <reference types="node" resolution-mode="require"/>
import EventEmitter from "events";
export declare class Multiplex<sent, received = sent> extends EventEmitter implements Multiplex.Like<sent, received> {
    private socket;
    private channelName;
    constructor(socket: Multiplex.Like<Multiplex.Message<unknown>>, channelName: string);
    private onMessage;
    private onError;
    private onClose;
    /**
     * The underlying socket is aggregated rather than composited, and will not be closed.
     */
    close(): void;
    send(channelMessage: sent): void;
}
export declare namespace Multiplex {
    interface Message<message> {
        readonly channel: string;
        readonly message: message;
    }
    interface Like<sent, received = sent> extends EventEmitter {
        on<Event extends keyof Like.Events<received>>(event: Event, listener: Like.Events<received>[Event]): this;
        once<Event extends keyof Like.Events<received>>(event: Event, listener: Like.Events<received>[Event]): this;
        off<Event extends keyof Like.Events<received>>(event: Event, listener: Like.Events<received>[Event]): this;
        emit<Event extends keyof Like.Events<received>>(event: Event, ...params: Parameters<Like.Events<received>[Event]>): boolean;
        /**
         * Calling after 'close' event causes an undefined consequence.
         */
        send(message: sent): void;
        close(): void;
    }
    namespace Like {
        interface Events<received> {
            message(message: received): void;
            error(err: Error): void;
            close(): void;
        }
    }
}
