<script>
  import JournalImage from "./JournalImage.svelte";

  export let paragraph;
  export let imageSrc = null;
  export let imageAlt = null;
</script>

<div>
  <p>{paragraph}</p>

  {#if imageSrc}
    <JournalImage {imageSrc} {imageAlt} />
  {/if}
</div>

<style>
  p {
    margin: 24px;
  }
</style>
