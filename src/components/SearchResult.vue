<script setup lang="ts">
import { useSearchResultStore } from '@/stores/search-result'; 
import { storeToRefs } from 'pinia';

const { items, searching, show_deprecated } = storeToRefs(useSearchResultStore())
</script>

<template>
    <div v-show="searching && items.length === 0">
      <p class="my-8 font-large mx-auto text-center">検索結果なし</p>
    </div>
    <div v-show="searching && items.length > 0" class="my-8">
      <div class="flex h-6 items-center m-4">
        <input 
        id="return-type-with-slice"
        name="return-type-with-slice"
        type="checkbox"
        class="h-4 w-4 rounded border-red-300"
        v-model="show_deprecated"
        >
        <label for="return-type-with-slice" class="ml-2 text-sm font-medium leading-6 text-gray-900">deprecateされたAPIを表示する</label>
      </div>

      <div class="shadow-sm overflow-hidden border-[2px] rounded-md bg-gray-10 ">
      <table class="border-collapse table-auto text-sm w-full">
        <thead>
          <tr class="bg-gray-100">
            <th class="border-b dark:border-slate-600 font-large p-4 py-2 text-slate-400 dark:text-slate-200 text-left">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td 
              v-show="show_deprecated || (item.deprecated_since === null)"
              class="px-1 pb-2 border-t-[1px] font-medium">
              <div class="p-4 pb-2 font-medium">{{ item.name }}</div>
              <div 
                class="ml-4 px-1 border border-yellow-300 bg-yellow-50 w-[fit-content]"
                v-show="item.deprecated_since !== null">deprecated: {{ item.deprecated_since }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
