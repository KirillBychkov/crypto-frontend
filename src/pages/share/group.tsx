import { useParams } from 'react-router-dom';
import { useAxios } from "@/auth/axios-hook";
import { useState, useEffect } from "react";
import { TradeDetails } from "@/pages/dairy/components/TradeDetails";

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
            {!order && <div>
                <div style={{ width: '100%', textAlign: 'center', marginBottom: 20 }}>Nothing here</div>
                <div style={{ width: '100%', textAlign: 'center', marginBottom: 20 }}>Please check the ID</div>
                <div style={{ width: '100%', textAlign: 'center', marginBottom: 20 }}>
                    If ID is correct and trade was NOT in progress the author might delete the trade
                </div>
            </div>}
            <TradeDetails data={order} extraFunctionality={false} />
        </div>
    );
}
