<script>
  import JournalTitle from "../JournalTitle.svelte";
  import JournalLine from "../JournalLine.svelte";
  import JournalQuote from "../JournalQuote.svelte";

  import { fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  export let date = null;
  export let title = null;
  export let paragraphs = [];
  export let images = [];
  export let quote = null;

  let view = false;
  const toggleView = () => {
    view = !view;
  };
</script>

<JournalTitle journalEntryDay={date} journalEntryTitle={title} on:toggleView={toggleView} />

{#if view}
  <div class="viewport" transition:fly={{ duration: 400, delay: 0, x: 0, y: 20, opacity: 0, easing: quintOut }}>
    {#each paragraphs as paragraph, i}
      {#if images[i] != null}
        <JournalLine {paragraph} imageSrc={images[i]} imageAlt="img" />
      {:else}
        <JournalLine {paragraph} />
      {/if}
    {/each}

    {#if quote != null}
      <JournalQuote {quote} />
    {/if}
  </div>
{/if}

<style>
  .viewport {
    border: 2px solid white;
    padding: 12px;
    border-radius: 8px;

    border-top: none;

    border-top-left-radius: 0px;
    border-top-right-radius: 0px;

    z-index: -200;

    background-color: rgba(255, 255, 255, 0.1);

    margin: 0px 24px;
    margin-top: -2px;
  }
</style>
