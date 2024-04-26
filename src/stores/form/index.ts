import type { ConditionSet } from "@/types/state_types";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useSearchResultStore } from "../search-result";

export const useSearchFormStore = defineStore('form', () => {
    const conditions = ref({ args: '', returns: '' })
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
            args: {
                phrase: conditions.value.args,
                with_slice: argOptions.value.with_slice,
                with_tuple: argOptions.value.with_tuple,
            },
            returns: {
                phrase: conditions.value.returns,
                with_slice: returnOptions.value.with_slice,
                with_tuple: returnOptions.value.with_tuple,
            }
        }

        const { listAsync } = useSearchResultStore()
        await listAsync(needle)
    }

    return { argOptions, returnOptions, setArgsAsync, setReturnAsync }
})