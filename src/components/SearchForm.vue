<script setup lang="ts">
import { useSearchFormStore } from '@/stores/form';
import { storeToRefs } from 'pinia';

const { setReturnAsync, setArgsAsync } = useSearchFormStore()

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
    </div>

    <div class="max-w-96 mt-2">
      <label for="arg-type" class="block text-sm font-medium leading-6 text-gray-900">引数</label>
      <input 
        id="arg-type" 
        name="arg-type" 
        type="text" 
        class="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        v-debounce:300ms="setArgsAsync">
    </div>
  </form>
</template>

