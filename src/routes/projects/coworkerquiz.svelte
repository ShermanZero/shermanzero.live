<script>
  let cardsPerPage = 12;
  $: imageData = null;

  const rangeChanged = (event) => {
    cardsPerPage = event.target.value;
  };

  const handler = () =>
    fetch("/.netlify/functions/card-generator", { headers: { accept: "Accept: application/json" } }).then((data) => {
      imageData = data;
    });
</script>

<div class="container">
  <div class="wrapper">
    <input
      type="range"
      name="page"
      id="numPerPage"
      min="1"
      max="24"
      value={cardsPerPage}
      on:change={rangeChanged}
      on:drag={rangeChanged}
      on:mousemove={rangeChanged}
    />
    <span>
      <label for="numPerPage">Cards/Page</label>
      <label for="numPerPage">{cardsPerPage}</label>
    </span>

    <button on:click={handler}>Generate</button>

    {#if imageData}
      <img id="image" src={imageData} alt="output" />
    {/if}
  </div>
</div>

<style>
  .container {
    padding: 20px;
  }

  img {
    margin-top: 10px;
  }

  .container > .wrapper {
    width: 840px;

    padding: 10px;

    display: flex;
    flex-direction: column;
  }

  input {
    width: 100%;
  }

  span {
    display: flex;
    justify-content: space-between;
  }

  button {
    width: 100%;
    height: 50px;
    background-color: #357b85;
    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    margin-top: 20px;

    font-family: "Ubuntu", sans-serif;
    text-transform: uppercase;

    transition: all 0.1s;
  }

  button:hover {
    background-color: #81cbda;
    color: black;
  }
</style>
