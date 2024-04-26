<script setup lang="ts">
import { useSearchResultStore } from '@/stores/search-result'; 
import { storeToRefs } from 'pinia';

const { items, searching } = storeToRefs(useSearchResultStore())
</script>

<template>
    <div v-show="searching && items.length === 0">
      <p class="my-8 font-large mx-auto text-center">検索結果なし</p>
    </div>
    <div v-show="searching && items.length > 0" class="shadow-sm overflow-hidden my-8 border-[2px] rounded-md bg-gray-10 ">
      <table class="border-collapse table-auto text-sm w-full">
        <thead>
          <tr class="bg-gray-100">
            <th class="border-b dark:border-slate-600 font-large p-4 py-2 text-slate-400 dark:text-slate-200 text-left">Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td class="px-1 pb-2 border-t-[1px] font-medium">
              <div class="p-4 pb-2 font-medium">{{ item.name }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
