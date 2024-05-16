export type Condition = Partial<{
    phrase: string
    withSlice: boolean
    withTuple: boolean
}>

export type ConditionSet = {
    crateId: CrateId | null
    args: Condition
    returns: Condition
}

export type SearchResult = {
    id: number
    qualName: string
    deprecated_since: string | null
}

export type CrateId = number & { crate_id: never }

export type Crate = {
    id: CrateId
    name: string
}