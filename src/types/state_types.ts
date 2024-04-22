export type PhraseKind = 'args' | 'returns'

export type Condition = Partial<Record<PhraseKind, string>>

export type SearchResult = {
    name: string
    args: string[]
    returns: string
}
