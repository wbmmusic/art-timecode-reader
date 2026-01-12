export interface ElectronAPI {
    invoke: (channel: string, data?: any) => Promise<any>;
    send: (channel: string, args?: any) => void;
    receive: (channel: string, func: (...args: any[]) => void) => void;
    removeListener: (channel: string) => void;
    ver: () => string;
}

declare global {
    interface Window {
        electron: ElectronAPI;
    }
}

export interface TimeData {
    time: string;
    rate: number;
    from: string;
}
