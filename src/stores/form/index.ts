import type { ConditionSet, CrateId } from "@/types/state_types";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useSearchResultStore } from "../search-result";

export const useSearchFormStore = defineStore('form', () => {
    const conditions = ref({ crate_id: null as CrateId | null, args: '', returns: '' })
    const argOptions = ref({ with_slice: false, with_tuple: false })
    const returnOptions = ref({ with_slice: false, with_tuple: false })

    const setArgsAsync = async (value: string) => {
        if (conditions.value.args !== value) {
            conditions.value.args = value
            await update()
        }
    }

    const setReturnAsync = async (value: string) => {
        if (conditions.value.returns !== value) {
            conditions.value.returns = value
            await update()
        }
    }

    const switchCrateAsync = async (value: CrateId | null) => {
        if (conditions.value.crate_id !== value) {
            conditions.value.crate_id = value
            await update()
        }
    }

    watch(returnOptions.value, async (_newValues, _oldValues) => {
        if (conditions.value.returns !== '') {
            await update()
        }
    })
    watch(argOptions.value, async (_newValues, _oldValues) => {
        if (conditions.value.args !== '') {
            await update()
        }
    })

    const update = async () => {
        const needle: ConditionSet = {
            crateId: conditions.value.crate_id,
            args: {
                phrase: conditions.value.args,
                withSlice: argOptions.value.with_slice,
                withTuple: argOptions.value.with_tuple,
            },
            returns: {
                phrase: conditions.value.returns,
                withSlice: returnOptions.value.with_slice,
                withTuple: returnOptions.value.with_tuple,
            }
        }

        const { listAsync } = useSearchResultStore()
        await listAsync(needle)
    }

    return { argOptions, returnOptions, setArgsAsync, setReturnAsync, switchCrateAsync }
})