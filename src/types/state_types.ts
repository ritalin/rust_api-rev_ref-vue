export type Condition = Partial<{
    phrase: string
    with_slice: boolean
    with_tuple: boolean
}>

export type ConditionSet = {
    args: Condition
    returns: Condition
}

export type SearchResult = {
    name: string
    args: string[]
    returns: string
    deprecated_since: string | null
}
