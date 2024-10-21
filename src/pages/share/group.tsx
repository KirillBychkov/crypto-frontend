import { useParams } from 'react-router-dom';
import { useAxios } from "@/auth/axios-hook.ts";
import { useState, useEffect } from "react";
import {TradeDetails} from "@/pages/dairy/components/TradeDetails.tsx";

export function SharePage() {
    const { dairyService } = useAxios();
    const [order, setOrder] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if(id)
            dairyService?.get('tradegroup/' + id).then(res => {
                if(res.status === 200) setOrder(res?.data[0]);
            });
    }, [id, dairyService]);

    return (
        <div className="flex pt-20 items-center justify-center">
            {!order && <div>Nothing here</div>}
            <TradeDetails data={order} extraFunctionality={false} />
        </div>
    );
}
