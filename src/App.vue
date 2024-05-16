<script setup lang="ts">
import Ingestion from './components/Ingestion.vue'
import SearchForm from './components/SearchForm.vue'
import SearchResult from './components/SearchResult.vue'
</script>

<template>
  <div class="xl:w-[80%] md:container md:mx-auto mx-2">
    <header>
      <h1 class="my-8 text-center text-2xl">Rust API逆引き検索</h1>
      <Suspense timeout="0">
        <div class="max-w-96 mx-auto">
          <Ingestion />
          <SearchForm />
        </div>
        <template #fallback>
          <h2 class="mx-auto text-center">初期化処理中・・・</h2>
        </template>
      </Suspense>
    </header>

    <main>
      <SearchResult />
    </main>
  </div>
</template>
<style scoped>
</style>
