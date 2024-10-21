export type LengthResponse<T> = {
    data: T[],
    length: number
}

export interface IUser {
    _id: string,
    email: string,
    password: string,
    name: string,
    initialDeposit: number,
    currentDeposit: number,
    createdAt: Date,
    updatedAt: Date
}
export type CreateUserData = Pick<IUser, 'name' | 'password' | 'email' | 'initialDeposit' | 'currentDeposit' >
export type FindUserData = Pick<IUser, 'name'>

export const POSITIONS = ['Long', 'Short'] as const;
export const TICKERS = ['BTC/USDT', 'ETH/USDT'] as const;
export const TRENDS = ['Up', 'Down'] as const;
export const ORDERS = ['Limit', 'Market'] as const;
export const RISKS = [0.1, 0.2, 0.3, 0.5, 1, 2, 3] as const;
export const ORDER_TYPE = ['enter', 'stop', 'take', 'mannualyClosed'] as const;
export const ORDER_STATUS = ['pending', 'fulfilled', 'cancelled'] as const;
export const GROUP_STATUS = ['new', 'failed', 'success', 'partiallyClosed', 'pending'] as const;

export type Positions = typeof POSITIONS[number];
export type Tickers = typeof TICKERS[number];
export type Trends = typeof TRENDS[number];
export type Orders = typeof ORDERS[number];
export type Risks = typeof RISKS[number];
export type OrderType = typeof ORDER_TYPE[number];
export type OrderStatus = typeof ORDER_STATUS[number];
export type GroupStatus = typeof GROUP_STATUS[number];

export type ITradeGroup = {
    _id: string,
    ticker: string,
    position: Positions,
    trend: Trends,
    order: Orders,
    riskPercent: Risks,
    avgEnter: number,
    fakeOrder: boolean,
    depositBefore: number,
    enterTrades: string[],
    stopTrades: string[],
    takeTrades: string[],
    manuallyClosedTrades: string[],
    images: string[],
    description: string,
    createdBy: Partial<IUser>,
    createdAt: Date,
    updatedAt: Date
}

export type PartiallyPopulatedTradeGroup = Omit<ITradeGroup, 'enterTrades' | 'stopTrades' | 'takeTrades'> & {
    enterTrades: EnterTrade[],
    stopTrades: StopTrade[],
    takeTrades: TakeTrade[],
}

export type PopulatedTradeGroup = Omit<ITradeGroup, 'enterTrades' | 'stopTrades' | 'takeTrades' | 'manuallyClosedTrades'> & {
    enterTrades: EnterTrade[],
    stopTrades: StopTrade[],
    takeTrades: TakeTrade[],
    manuallyClosedTrades: ManuallyClosedTrade[],
}

export type ITradeOrder = {
    _id: string,
    type: OrderType,
    price: number,
    percentage: string,
    tradeGroup: ITradeGroup,
    status: OrderStatus,
    createdBy: Partial<IUser>,
    createdAt: Date,
    updatedAt: Date
}
export type EnterTrade = Omit<ITradeOrder, 'type'> & { type: 'enter' }
export type StopTrade = Omit<ITradeOrder, 'type'> & { type: 'stop' }
export type TakeTrade = Omit<ITradeOrder, 'type'> & { type: 'take' }
export type ManuallyClosedTrade = Omit<ITradeOrder, 'type'> & { type: 'mannualyClosed' }

export type TradeGroupRequest = Pick<ITradeGroup, 'ticker' | 'position' | 'trend' | 'order' | 'avgEnter' | 'riskPercent'> & {
    enterCount: number,
    stop: number,
    firstTakePrice: string,
    secondTakePrice?: string,
    thirdTakePrice?: string,
}

export type TradeGroupResponse = Omit<PopulatedTradeGroup, '_id'> & {
    id: string,
    quantity: number,
    lost: number,
    profit: number,
    result: number | null,
    status: GroupStatus,
}