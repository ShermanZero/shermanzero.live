<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let journalEntryTitle;
  export let journalEntryDay;

  let selected = false;

  function toggleView() {
    dispatch("toggleView");

    selected = !selected;
  }
</script>

<div class="title {selected ? 'selected' : ''}" on:click={toggleView}>
  <img src="/svgs/chevron-right.svg" width="28" alt="expand" />
  <h2>{journalEntryDay}</h2>
  <h1>{journalEntryTitle}</h1>
</div>

<style>
  .title {
    position: relative;
    box-shadow: 0 -4px 8px #888888;

    text-align: center;

    padding: 15px;
    border-radius: 8px;

    margin: 12px;
    margin-bottom: 0px;
    width: 100%;

    background-color: white;
    color: black;

    z-index: 100;
    max-width: 600px;
  }

  .title.selected {
    transition: all 0.12s;

    box-shadow: 0 -4px 8px darkslategray;
    background-color: rgb(42, 33, 49);
    color: whitesmoke;

    border: 2px solid white;
  }

  .title img {
    transition: all 0.12s;
    transform: rotate(0deg);

    position: absolute;
    right: 48px;

    filter: invert(40%);
    transform: translateY(4px);
  }

  .title.selected img {
    transform: rotate(90deg) translateX(12px);
    filter: invert(90%);
  }

  .title h1 {
    margin: 0;
    font-family: "Square Peg", cursive;

    line-height: 1em;
  }

  .title h2 {
    font-family: "Square Peg";
    font-size: 1rem;
    margin: 0;
    text-transform: uppercase;
    line-height: 0.25em;
  }

  h1,
  h2 {
    transition: all 0.12s;
  }

  .title.selected h1,
  .title.selected h2 {
    transform: translateX(-20%);
  }
</style>
