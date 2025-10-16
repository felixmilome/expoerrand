export interface UberState {
    uber:{
        origin:{
            location:{
                lat: number;
                lng: number;

            };
            description: string;
        } | null;
        distance: {
            text:string;
            value: number;
        };
        destination: {
            location:{
                lat: number;
                lng: number;

            };
            description: string;
        };
        travelTimeInformation:null | {
            distance: {
                text:string;
                value: number;
            };
            duration: {
                text:string;
                value:number;
            };
        };
    };
}