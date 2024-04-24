<script setup lang="ts">
import { initAsyncDb } from '@/service/database_async'; 
import { useConnectorStore } from '@/stores/connector'

const store = useConnectorStore()
await store.ingestAsync(await initAsyncDb(), `${document.baseURI}resources`) 
</script>
