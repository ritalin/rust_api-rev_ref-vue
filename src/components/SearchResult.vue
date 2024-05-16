<script setup lang="ts">
import { useSearchResultStore } from '@/stores/search-result'; 
import { storeToRefs } from 'pinia';

const { items, searching, show_deprecated } = storeToRefs(useSearchResultStore())
</script>

<template>
  <div v-if="searching && items.length === 0">
    <p class="my-8 font-large mx-auto text-center">検索結果なし</p>
  </div>
  <div v-show="searching && items.length > 0" class="my-8">
    <div class="h-[2.6rem] sticky top-0 z-2 bg-white">
      <div class="items-center p-3">
      <input 
      id="return-type-with-slice"
      name="return-type-with-slice"
      type="checkbox"
      class="h-4 w-4 rounded border-red-300"
      v-model="show_deprecated"
      >
      <label for="return-type-with-slice" class="ml-2 text-sm font-medium leading-6 text-gray-900">deprecateされたAPIを表示する</label>
    </div>
    </div>

    <div class="shadow-sm border-[2px] border-slate-200 rounded-md bg-gray-10 mx-0 box-content">
      <table class="border-collapse table-fixed text-sm w-full">
        <thead>
          <tr>
            <th class="sticky top-10 z-1 font-large text-slate-400 text-left bg-gray-200"><div class="w-full p-4 py-2">Name</div></th>
          </tr>
        </thead>
        <tbody>
          <tr class="flex border-slate-300 [&:nth-child(n+2)]:border-t-[1px] mx-2" v-for="item in items">
            <td 
              v-show="show_deprecated || (item.deprecated_since === null)"
              class="px-4 pb-2 font-medium w-full break-words">
              <div class="">
                <div class="p-4 pb-2 font-medium">{{ item.qualName }}</div>
                <div 
                  class="ml-4 mr-2 px-1 border border-yellow-300 bg-yellow-50 w-[fit-content]"
                  v-show="item.deprecated_since !== null">deprecated: {{ item.deprecated_since }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
