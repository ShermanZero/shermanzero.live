<script>
  export let journalEntryTitle;
  export let journalEntryDay;
</script>

<div class="title">
  <h2>{journalEntryDay}</h2>
  <h1>{journalEntryTitle}</h1>
</div>

<style>
  .title {
    margin: auto;
    box-shadow: 0 -4px 8px #888888;

    text-align: center;

    padding: 15px;
    border-radius: 8px;

    margin: 0px 15px;

    background-color: white;
    color: black;
  }

  .title h1 {
    margin: 0;
    font-family: "Square Peg", cursive;
  }

  .title h2 {
    font-family: "Square Peg";
    font-size: 1rem;
    margin: 0;
    text-transform: uppercase;
    line-height: 0.25em;
  }
</style>
