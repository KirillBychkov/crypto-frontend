import { useCallback } from "react";
import { useAxios } from "@/auth/axios-hook.ts";
import { useAuth } from "@/auth/auth-hook.ts";
import { Button } from "@/components/ui/button.tsx";

export function Arbitrage() {
    const { arbitrageService } = useAxios();
    const { isAuthenticated, user } = useAuth();

    const first = useCallback(async () => {
        const { data } = await arbitrageService?.get('helloworld');
        console.log('arbitrage data', data);
    }, [arbitrageService]);

    const second = useCallback(async () => {
        const { data } = await arbitrageService?.get('protected');
        console.log('protected data', data);
    }, [arbitrageService]);

    return (
        <div className="container mx-auto py-10">
            <h1 className="scroll-m-20 text-left text-4xl font-extrabold tracking-tight lg:text-5xl">
                Arbitrage page
            </h1>
            <br/>
            <div>
                {`User is ${!isAuthenticated ? 'NOT ' : ''}authenticated. `}
                {isAuthenticated && <span>Logged in as {user?.fullName}</span>}
            </div>
            <br/>
            <Button onClick={first}>
                Request arbitrage service
            </Button>
            <br/>
            <br/>
            <Button onClick={second}>
                Request protected service
            </Button>
        </div>
    );
}
