import { type TypeCategory } from '../user-types/TypeCategory'

export type Parameter = {
  crateId: number | null,
  retPhrase: string | null,
  retCat1: TypeCategory | null,
  retCat2: TypeCategory | null,
  argPhrase: string | null,
  argCat1: TypeCategory | null,
  argCat2: TypeCategory | null,
}

export const ParameterOrder: (keyof Parameter)[] = ['crateId', 'retPhrase', 'retCat1', 'retCat2', 'argPhrase', 'argCat1', 'argCat2']

export type ResultSet = {
  id: number,
  qualSymbol: string,
  since: string | null,
}
