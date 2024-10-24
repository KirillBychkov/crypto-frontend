import { TradeGroupResponse } from '@/shared/common.ts';
import { DeleteTradeDialog } from './DeleteTradeDialog';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  TrendingDownIcon,
  TrendingUpIcon,
  LoaderIcon,
  SquareCheckBigIcon,
  BanIcon,
  TrashIcon,
  ShareIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UpdateTradeDialog } from './UpdateTradeDialog';
import { AddImageToTrade } from "@/pages/dairy/components/AddImageToTrade.tsx";
import { Button } from "@/components/ui/button.tsx";
import { checkKillZone } from "@/common/Wrapper.tsx";

type TradeDetailsProps = { data: TradeGroupResponse | null, extraFunctionality: boolean };

export function TradeDetails({ data, extraFunctionality }: TradeDetailsProps) {
  if (!data) return;
  const objCreate = checkKillZone(new Date(data?.createdAt));
  const objUpdate = checkKillZone(new Date(data?.updatedAt));
  const sum = Math.round(data.avgEnter * data.quantity - (data.avgEnter * data.quantity * 0.1 / 100));

  return (
    <div className="bg-background">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Position
              </p>
              <Badge
                  variant={data.position === 'Long' ? 'positive' : 'destructive'}
              >
                {data.position}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Trend</p>
              <div className="flex items-center justify-start space-x-1">
                {data.trend === 'Up' ? (
                    <TrendingUpIcon className="h-4 w-4 text-green-500"/>
                ) : (
                    <TrendingDownIcon className="h-4 w-4 text-red-500"/>
                )}
                <span>{data.trend}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Order Type
              </p>
              <p>{data.order}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Enter orders
              </p>
              <>
                {data.enterTrades
                    .sort((a, b) => data.position === 'Long' ? +a.price - +b.price : +b.price - +a.price)
                    .map(e => (
                        <p key={e._id} className={'flex'}>
                          ${e.price.toFixed(2)} - {(data.quantity * e.percentage.replace('%', '') / 100).toFixed(5)}
                          {e.status === "pending" && <LoaderIcon className="ml-1 mt-0.5 h-4 w-4 text-yellow-200"/>}
                          {e.status === "fulfilled" &&
                              <SquareCheckBigIcon className="ml-1 mt-0.5 h-4 w-4 text-green-500"/>}
                          {e.status === "cancelled" && <BanIcon className="ml-1 mt-0.5 h-4 w-4 text-red-500"/>}
                        </p>
                    ))}
              </>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Take orders
              </p>
              <>{data.takeTrades
                  .sort((a, b) => data.position === 'Long' ? +a.price - +b.price : +b.price - +a.price)
                  .map((e, index) => (
                      <p key={e._id} className={'flex'}>
                        ${e.price.toFixed(2)} - {e.percentage}
                        {e.status === "pending" && <LoaderIcon className="ml-1 mt-0.5 h-4 w-4 text-yellow-200"/>}
                        {e.status === "fulfilled" &&
                            <SquareCheckBigIcon className="ml-1 mt-0.5 h-4 w-4 text-green-500"/>}
                        {e.status === "cancelled" && <BanIcon className="ml-1 mt-0.5 h-4 w-4 text-red-500"/>}
                      </p>
                  ))}
                </>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Stop orders
              </p>
              <>{data.stopTrades
                  .sort((a, b) => data.position === 'Long' ? +a.price - +b.price : +b.price - +a.price)
                  .map(e => (
                      <p key={e._id} className={'flex'}>
                        ${e.price.toFixed(2)} - {e.percentage}
                        {e.status === "pending" && <LoaderIcon className="ml-1 mt-0.5 h-4 w-4 text-yellow-200"/>}
                        {e.status === "fulfilled" &&
                            <SquareCheckBigIcon className="ml-1 mt-0.5 h-4 w-4 text-green-500"/>}
                        {e.status === "cancelled" && <BanIcon className="ml-1 mt-0.5 h-4 w-4 text-red-500"/>}
                      </p>
                  ))}</>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Average Enter
              </p>
              <p>${data.avgEnter.toFixed(2)}</p>
              <p>{(+data.quantity).toFixed(5)} {data.ticker.split('/')[0]}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Risk info
              </p>
              <p>{data.riskPercent}% of deposit</p>
              <p>R/R {(data.profit / data.lost).toFixed(2)} to 1</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Leverages ( - 0.1% fee )
              </p>
              <p>
                {sum > data.lost? "$" + sum.toFixed(2) + " x1": ""}
                {sum / 10 > data.lost? " / $" + (sum / 10).toFixed(2) + " x10": ""}
                {sum / 20 > data.lost? " / $" + (sum / 20).toFixed(2) + " x20": ""}
              </p>
              <p>
                {sum / 30 > data.lost? "$" + (sum / 30).toFixed(2) + " x30": ""}
                {sum / 40 > data.lost? " / $" + (sum / 40).toFixed(2) + " x40": ""}
                {sum / 50 > data.lost? " / $" + (sum / 50).toFixed(2) + " x50": ""}
              </p>
              <p>
                {sum / 60 > data.lost? "$" + (sum / 60).toFixed(2) + " x60": ""}
                {sum / 70 > data.lost? " / $" + (sum / 70).toFixed(2) + " x70": ""}
                {sum / 80 > data.lost? " / $" + (sum / 80).toFixed(2) + " x80": ""}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Potential Loss (USDT)
              </p>
              <p className="text-red-500">${data.lost?.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Potential Profit (USDT)
              </p>
              <p className="text-green-500">${data.profit?.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge
                  variant={
                      (data.status === 'success' ? 'positive' : null) ||
                      (data.status === 'new' ? 'default' : null) ||
                      (data.status === 'failed' ? 'destructive' : null)
                  }
              >
                {data.status?.toUpperCase() || '-'}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Result (USDT)
              </p>
              {!!data.result ? (
                  <p className={(data.status === 'success' ? 'text-green-500' : '') ||
                    (data.status === 'failed' ? 'text-red-500' : '')}>
                    ${data.result.toFixed(2)} ({(data.result * 100 / data.depositAfter).toFixed(2)}% to deposit)
                  </p>
              ) : (<p>-</p>)}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Deposit Before
              </p>
              {!!data.depositBefore ? (
                  <p>${data.depositBefore.toFixed(2)}</p>
              ) : (
                  <p>-</p>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Deposit After
              </p>
              {!!data.depositAfter ? (
                  <p>${data.depositAfter.toFixed(2)}</p>
              ) : (
                  <p>-</p>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Custom price trade
              </p>
              <div>{data.manuallyClosedTrades && data.manuallyClosedTrades[0] ? <>
                <div className={'flex'}>
                  ${data.manuallyClosedTrades[0].price.toFixed(2)} - {data.manuallyClosedTrades[0].percentage}
                  {data.manuallyClosedTrades[0].status === "pending" &&
                      <LoaderIcon className="ml-1 mt-0.5 h-4 w-4 text-yellow-200"/>}
                  {data.manuallyClosedTrades[0].status === "fulfilled" &&
                      <SquareCheckBigIcon className="ml-1 mt-0.5 h-4 w-4 text-green-500"/>}
                  {data.manuallyClosedTrades[0].status === "cancelled" &&
                      <BanIcon className="ml-1 mt-0.5 h-4 w-4 text-red-500"/>}
                </div>
              </> : '-'}</div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Scenario
              </p>
              <p>{data.closeScenario ?? '-'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Created / Updated dates
              </p>
              <p className={'flex'}>
                <abbr title={new Date(data?.createdAt).toUTCString()}>
                  {new Date(data?.createdAt).toLocaleString('en-GB')}
                </abbr>
                {objCreate && <span className={'ml-3 mt-1'}>
                    <abbr title={objCreate.name}>
                      <objCreate.flag size={'small'}/>
                    </abbr>
                </span>}
              </p>
              <p className={'flex'}>
                {data?.closeScenario? <>
                  <abbr title={new Date(data?.updatedAt).toUTCString()}>
                    {new Date(data?.updatedAt).toLocaleString('en-GB')}
                  </abbr>
                  {objUpdate && <span className={'ml-3 mt-1'}>
                    <abbr title={objUpdate.name}>
                      <objUpdate.flag size={'small'}/>
                    </abbr>
                  </span>}
                </> : "Not closed"}
              </p>
            </div>
            {extraFunctionality && <div className="flex justify-end gap-2">
              <Button size="icon" variant="secondary" onClick={() => window.open('/share/' + data?.id)}>
                <ShareIcon />
              </Button>
              <DeleteTradeDialog
                  disabled={!!data.closeScenario}
                  tradeId={data.id}
              />
              <UpdateTradeDialog
                  disabled={!!data.closeScenario}
                  trade={data}
              />
              <AddImageToTrade group={data || null} />
            </div>}
          </div>
          {!extraFunctionality && (data.images.length !== 0 || data.description) && <div className={"mt-4"}>
            <h3 className={'tracking-tight text-2xl font-bold'}>Reasons</h3>
            <div className={'flex flex-wrap mt-8'}>
              {data.images.map((image, i) => (
                  <div className={"imagePreview"} style={{flexBasis: '25%'}} key={"image" + i}>
                      <img className="preview-thumb" onClick={() => {
                           const H = 1000, W = 1000, Caption = "Image Preview", imgSrc = image;
                           const newImg = window.open("", "myImg", "height=" + H + ",width=" + W + "")
                           newImg.document.write("<title>" + Caption + "</title>")

                           newImg.document.write("<img src='" + imgSrc + "' width='" + W + "'  height='" + H + "' onclick='window.close()' style='width: " + W + "  height: " + H + " ;position:absolute;left:0;top:0;object-fit: contain;'>")
                           newImg.document.write("<script type='text/javascript'> document.oncontextmenu = new Function('return false') </script>")

                           newImg.document.close()
                         }}
                         src={image} alt={"image" + i} />
                  </div>
              ))}
            </div>

            <p style={{ whiteSpace: "pre-line" }} className={"mt-4"}>{data.description}</p>
          </div>}
        </CardContent>
      </Card>
    </div>
  );
}
