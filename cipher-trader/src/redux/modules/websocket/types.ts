export interface WebsocketState {
  isConnected: boolean;
  tradePrice: number | null;
  askPrice: number | null;
  bidPrice: number | null;
  orders: any[];
  error: string;
  status: string;
}
