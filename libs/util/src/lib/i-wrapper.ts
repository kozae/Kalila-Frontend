export interface IWrapper<TState, TDispatchers> {
  data: TState,
  methods: TDispatchers,
  loading?: boolean
}
