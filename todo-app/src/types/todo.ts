export interface ToDo {
    id: number;
    content: string;
    position: {
        x: number;
        y: number;
    };
    priority: boolean;
    zIndex: number;
    color: string;
    colorSecondary: string;
}