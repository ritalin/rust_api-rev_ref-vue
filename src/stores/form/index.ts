import type { Condition } from "@/types/state_types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useSearchResultStore } from "../search-result";

export const useSearchFormStore = defineStore('form', () => {
    const conditions = ref({ args: '', returns: '' } as Condition)

    const setArgsAsync = async (value: string) => {
        if (conditions.value.args !== value) {
            conditions.value.args = value

            const { listAsync } = useSearchResultStore()
            await listAsync(conditions.value)
        }
    }

    const setReturnAsync = async (value: string) => {
        if (conditions.value.returns !== value) {
            conditions.value.returns = value

            const { listAsync } = useSearchResultStore()
            await listAsync(conditions.value)
        }
    }

    return { setArgsAsync, setReturnAsync }
})