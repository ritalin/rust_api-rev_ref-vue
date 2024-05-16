<script setup lang="ts">
import { initAsyncDb } from '@/service/database_async'; 
import { useConnectorStore } from '@/stores/connector'
import { useSearchFormStore } from '@/stores/form';
import { useSearchResultStore } from '@/stores/search-result';

const {ingestAsync} = useConnectorStore()
await ingestAsync(await initAsyncDb(), `${document.baseURI}resources`) 

const {initCrates} = useSearchResultStore()
const default_crate = await initCrates()

const {switchCrateAsync} = useSearchFormStore()
switchCrateAsync(default_crate)
</script>
