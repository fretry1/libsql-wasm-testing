<script>
    import { onDestroy, onMount } from "svelte";
    import { db } from "$lib/db/db";

    let initialized = $state(false)
    let loading = $state(true)
    let counters = $state([])

    onMount(() => db.init()
        .then(() => db.getCounters())
        .then(arr => counters = arr)
        .catch(err => console.error(`failed to get counters: ${err}`))
        .finally(() => loading = false)
    )

    const initializeDatabase = () => db.init()
        .then(() => db.getCounters())
        .then(arr => counters = arr)
        .catch(err => console.error(`failed to get counters: ${err}`))
        .finally(() => {
            initialized = true
            loading = false
        })

    function createCounter() {
        if (loading) return
        loading = true
        db.createCounter()
            .then(it => counters.push(it))
            .catch(err => console.error(`failed to create counter: ${err}`))
            .finally(() => loading = false)
    }

    /**@param {number} id */
    function incrementCounter(id) {
        if (loading) return
        loading = true
        db.incrementCounter(id)
            .then(it => counters[counters.findIndex(it => it.id === id)] = it)
            .catch(err => console.error(`failed to increment counter: ${err}`))
            .finally(() => loading = false)
    }

    onDestroy(async () => await db.close())
</script>

{#if !initialized}
    <button onclick={initializeDatabase}>Initialize</button>
{:else}
    <main>
        {#each counters as counter}
            {@render Counter(counter)}
            {/each}
        <button onclick={createCounter}>Create Counter</button>
    </main>
{/if}

{#snippet Counter(/**@type{Counter}*/ counter)}
    <div class="counter">
        <button onclick={() => incrementCounter(counter.id)}>+</button>
        <p>{counter.value}</p>
    </div>
{/snippet}

<style>
    main {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .counter {
        border: 1px solid rgb(230, 230, 230);
        background: rgb(245, 245, 245);
        padding: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 10rem;
    }
    p,
    button {
        font-size: 2rem;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
