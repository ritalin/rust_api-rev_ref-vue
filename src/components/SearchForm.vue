<script setup lang="ts">
import { useSearchFormStore } from '@/stores/form';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const form = useSearchFormStore()
const { setReturnAsync, setArgsAsync } = form
const { argOptions, returnOptions } = storeToRefs(form)

</script>

<template>
  <form>
    <div class="max-w-96 mt-2">
      <label for="return-type" class="block text-sm font-medium leading-6 text-gray-900">戻り値</label>
      <input 
        id="return-type" 
        name="return-type" 
        type="text" class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        v-debounce:300ms="setReturnAsync">
      
      <div class="ml-4 mt-2">
        <div class="flex h-6 items-center">
          <input 
          id="return-type-with-slice"
          name="return-type-with-slice"
          type="checkbox"
          class="h-4 w-4 rounded border-red-300"
          v-model="returnOptions.with_slice"
          >
          <label for="return-type-with-slice" class="ml-2 text-sm font-medium leading-6 text-gray-900">配列・スライスを含める</label>
        </div>
        <div class="flex h-6 items-center">
          <input 
          id="return-type-with-tuple"
          name="return-type-with-tuple"
          type="checkbox"
          class="h-4 w-4 rounded border-red-300"
          v-model="returnOptions.with_tuple"
          >  
          <label for="return-type-with-tuple" class="ml-2 text-sm font-medium leading-6 text-gray-900">タプルを含める</label>
        </div>
      </div>
    </div>

    <div class="max-w-96 mt-2">
      <label for="arg-type" class="block text-sm font-medium leading-6 text-gray-900">引数</label>
      <input 
        id="arg-type" 
        name="arg-type" 
        type="text" 
        class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        v-debounce:300ms="setArgsAsync">
      
        <div class="ml-4 mt-2">
        <div class="flex h-6 items-center">
          <input 
          id="return-type-with-slice"
          name="return-type-with-slice"
          type="checkbox"
          class="h-4 w-4 rounded border-red-300"
          v-model="argOptions.with_slice"
          >
          <label for="return-type-with-slice" class="ml-2 text-sm font-medium leading-6 text-gray-900">配列・スライスを含める</label>
        </div>
        <div class="flex h-6 items-center">
          <input 
          id="return-type-with-tuple"
          name="return-type-with-tuple"
          type="checkbox"
          class="h-4 w-4 rounded border-red-300"
          v-model="argOptions.with_tuple"
          >  
          <label for="return-type-with-tuple" class="ml-2 text-sm font-medium leading-6 text-gray-900">タプルを含める</label>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
  .checkbox-round {
    width: 1.3em;
    height: 1.3em;
    background-color: white;
    border-radius: 50%;
    vertical-align: middle;
    border: 1px solid #ddd;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;
}
</style>