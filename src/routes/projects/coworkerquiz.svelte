<script>
  let cardsPerPage = 12;
  $: imageData = null;

  const rangeChanged = (event) => {
    cardsPerPage = event.target.value;
  };

  const handler = () =>
    fetch("/.netlify/functions/card-generator", {
      method: "GET",
      mode: "no-cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    })
      .then((r) => r.json())
      .then((j) => (imageData = j.data));
</script>

<div class="container">
  <div class="wrapper">
    <button on:click={handler}>Press To<br />Generate Positivity</button>

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
    padding: 10px;

    display: flex;
    flex-direction: column;
  }

  button {
    width: 100%;
    height: 100px;
    background-color: #357b85;
    background: linear-gradient(30deg, #357b85 10%, #175058 90%);

    color: #fff;
    font-size: 1.5rem;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    padding: 20px;

    font-family: "Raleway", sans-serif;
    text-transform: uppercase;
    font-weight: 800;

    transition: all 0.1s;
  }

  button:hover {
    background-color: #81cbda;
    color: black;
  }
</style>
