import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ModeToggle } from './ModeToggle';
// import { pusherClient } from "@/App.tsx";
import { useAuth } from "@/auth/auth-hook.ts";
import { useAxios } from "@/auth/axios-hook.ts";
import { useQuery } from "@tanstack/react-query";
import { router } from "@/router.tsx";
import { AddDepositModal } from "@/common/AddDepositModal.tsx";
import { Asia, London, Usa } from "@/common/icons.tsx";

export function checkKillZone(time) {
  return killZones.find(({ from, to }, i) => {
    const fromTime  = new Date();
    fromTime.setUTCHours(Number(from.split(':')[0]));
    fromTime.setUTCMinutes(Number(from.split(':')[1]));
    fromTime.setUTCSeconds(Number(from.split(':')[2]));

    const toTime  = new Date();
    toTime.setUTCHours(Number(to.split(':')[0]));
    toTime.setUTCMinutes(Number(to.split(':')[1]));
    toTime.setUTCSeconds(Number(from.split(':')[2]));

    const date = time || new Date();
    return +fromTime < +date && +date < +toTime;
  });
}

export const killZones = [
  {
    name: "Asia open Kill zone",
    from: "00:00:00",
    to: "05:00:00",
    message: "Can be 'Low volatility' and maybe 'future trend direction'",
    flag: Asia
  },
  {
    name: "London open Kill zone",
    from: "07:00:00",
    to: "10:00:00",
    message: "Can be 'High volatility' and maybe 'extremum of the day'",
    flag: London
  },
  {
    name: "USA open Kill zone",
    from: "12:00:00",
    to: "15:00:00",
    message: "Can be 'Correction to London kill zone direction' and maybe 'extremum of the day'",
    flag: Usa
  },
  {
    name: "London close Kill zone",
    from: "15:00:00",
    to: "17:00:00",
    message: "Can be 'Close traders daily positions' and maybe 'If USA's open and London's open Kill zone directions was the same, here can be correction'",
    flag: London
  }
];

export function Wrapper() {
  const { logout, user } = useAuth();
  const { dairyService } = useAxios();
  const [hoursUTC, setHoursUTC] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [killZone, setKillZone] = useState<unknown>(null);

  const getTime = () => {
    const objectNow = checkKillZone();
    if(objectNow) setKillZone(objectNow)
    else setKillZone(null);

    const timeUTC = Date.UTC(2080, 12, 31) - Date.now();
    const timeNow = timeUTC + (new Date().getTimezoneOffset() * 60 * 1000);
    setHoursUTC(Math.floor((timeUTC / (1000 * 60 * 60)) % 24));
    setHours(Math.floor((timeNow / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((timeNow / 1000 / 60) % 60));
    setSeconds(Math.floor((timeNow / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, []);
  // const [bitcoinPrices, setBitcoinPrices] = useState({
  //   binance: '0',
  //   bybit: '0'
  // });
  // const [etheriumPrices, setEtheriumPrices] = useState({
  //   binance: '0',
  //   bybit: '0'
  // });

  const { data: _deposit  } = useQuery({
    queryKey: ['deposit', user?.id],
    queryFn: () => dairyService?.get("deposit"),
    enabled: !!user,
  });

  const depositObject = useMemo(() => {
    return _deposit?.data ?? null;
  }, [_deposit]);

  useEffect(() => {
    if(!user) return;
    if(!depositObject) return;

    if (!depositObject?.data?.deposit) {
      router.navigate('/deposit');
    }
  }, [user, depositObject]);
  //
  // useEffect(() => {
  //     const channelBinanceBTCUSDT = pusherClient
  //         .subscribe('ticker')
  //         .bind('Binance-BTC/USDT', ({ ticker }) => {
  //           setBitcoinPrices(prev => ({ ...prev, binance: ticker.last }));
  //         });
  //
  //   return () => {
  //     channelBinanceBTCUSDT.unbind();
  //   };
  // }, []);
  //
  // useEffect(() => {
  //   const channelBybitBTCUSDT = pusherClient
  //       .subscribe('ticker')
  //       .bind('Bybit-BTC/USDT', ({ ticker }) => {
  //         setBitcoinPrices(prev => ({ ...prev, bybit: ticker.info.lastPrice }));
  //       });
  //
  //   return () => {
  //     channelBybitBTCUSDT.unbind();
  //   };
  // }, []);
  //
  // useEffect(() => {
  //   const channelBinanceETHUSDT = pusherClient
  //       .subscribe('ticker')
  //       .bind('Binance-ETH/USDT', ({ ticker }) => {
  //         setEtheriumPrices(prev => ({ ...prev, binance: ticker.last }));
  //       });
  //
  //   return () => {
  //     channelBinanceETHUSDT.unbind();
  //   };
  // }, []);
  //
  // useEffect(() => {
  //   const channelBybitETHUSDT = pusherClient
  //       .subscribe('ticker')
  //       .bind('Bybit-ETH/USDT', ({ ticker }) => {
  //         setEtheriumPrices(prev => ({ ...prev, bybit: ticker.info.lastPrice }));
  //       });
  //
  //   return () => {
  //     channelBybitETHUSDT.unbind();
  //   };
  // }, []);

  return (
      <div>
        <div className={'lg:hidden flex justify-center items-center xl:hidden 2xl:hidden fixed inset-0 z-50 bg-black/100'}>
          <h2 className="text-3xl font-extrabold align-middle h-20">Don't trade on mobile phones!</h2>
        </div>
        <div className="container mx-auto flex justify-between py-5">
          <div className="flex items-center gap-x-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {user?.fullName}
            </h3>
            <p>
              Current deposit:{' '}
              <span className="text-green-500">
             {depositObject?.data?.deposit?.toFixed(2)}
            </span> $
            </p>
            <AddDepositModal/>
          </div>

          <div className="flex items-center gap-x-4">
            <NavLink to="/dairy" className={({isActive}) => isActive ? "underline" : ""}>
              <Button style={{textDecoration: "inherit"}}>
                Dairy
              </Button>
            </NavLink>
            {/*<NavLink to="/chart" className={({ isActive }) => isActive? "underline" : ""}>*/}
            {/*  <Button style={{ textDecoration: "inherit" }}>*/}
            {/*    Chart*/}
            {/*  </Button>*/}
            {/*</NavLink>*/}
            {/*<NavLink to="/arbitrage" className={({ isActive }) => isActive? "underline" : ""}>*/}
            {/*  <Button style={{ textDecoration: "inherit" }}>*/}
            {/*    Arbitrage*/}
            {/*  </Button>*/}
            {/*</NavLink>*/}
          </div>

          <div className="flex items-center gap-x-4">
            <Button onClick={logout}>Logout</Button>
            <ModeToggle/>
          </div>
        </div>
        <div className="container mx-auto flex justify-between py-1">
          <div className="flex gap-x-4 w-full">
            <div style={{flexBasis: '33%'}}>
              <div style={{width: 300}}>{new Date().toString()}</div>
              <div>Day close in {hours < 10 ? "0" + hours : hours}:
                {minutes < 10 ? "0" + minutes : minutes}:
                {seconds < 10 ? "0" + seconds : seconds}
              </div>
            </div>
            <div style={{flexBasis: '33%'}}>
              <div style={{width: 300}}>{new Date().toUTCString()}+0000 (Greenwich Mean Time)</div>
              <div>Day close in {hoursUTC < 10 ? "0" + hoursUTC : hoursUTC}:
                {minutes < 10 ? "0" + minutes : minutes}:
                {seconds < 10 ? "0" + seconds : seconds}
              </div>
            </div>
            <div style={{flexBasis: '33%'}}>
              {[0, 6].includes(new Date().getDay())? "Weekend" :<>
                {!killZone?.from && <div>
                  There is no active kill zone now
                </div>}
                {killZone?.from && <div>
                  <div  className={'flex'}>
                    <div className={'p-2'}>
                      <killZone.flag size={'large'} />
                    </div>
                    <div className={'pl-2'}>
                      <div>
                        {killZone?.from}  - {killZone?.to}
                      </div>
                      <div>{killZone?.name}</div>
                    </div>
                  </div>
                  <div>
                    {killZone?.message}
                  </div>
                </div>}
              </>}
            </div>
          </div>
        </div>

        {/*<div className="container mx-auto flex justify-between py-5">*/}
        {/*  <div className="flex items-center gap-x-4">*/}
        {/*    <span className="text-grey-500">Binance BTC/USDT: {Number(bitcoinPrices.binance).toFixed(2)}</span>*/}
        {/*    <span className="text-grey-500">Bybit BTC/USDT: {Number(bitcoinPrices.bybit).toFixed(2)}</span>*/}
        {/*    <span className="text-grey-500">Binance ETH/USDT: {Number(etheriumPrices.binance).toFixed(2)}</span>*/}
        {/*    <span className="text-grey-500">Bybit ETH/USDT: {Number(etheriumPrices.bybit).toFixed(2)}</span>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <Outlet/>
      </div>
  );
}
