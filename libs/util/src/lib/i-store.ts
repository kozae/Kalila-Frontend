export interface IStore<TState, TDispatchers> {
  state: TState,
  dispatchers: TDispatchers,
  loading: boolean
}
