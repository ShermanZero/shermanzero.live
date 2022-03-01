<script>
  export let projectName;
  export let projectID;
  export let dateCreated = new Date().now;
  export let description = "No description provided";
  export let showDelay = 0;

  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { quintOut } from "svelte/easing";

  let visible = false;

  const goToProject = () => {
    window.location.href = `/projects/${projectID}`;
  };

  onMount(() => {
    visible = true;
  });
</script>

{#if visible}
  <div
    class="project-card"
    on:click={goToProject}
    transition:fly={{ duration: 500, delay: showDelay, x: 0, y: 50, opacity: 0, easing: quintOut }}
  >
    <h1>{projectName}</h1>
    <h2>{description}</h2>
    <p class="date">{dateCreated}</p>
  </div>
{/if}

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    position: relative;

    width: 20vw;
    height: 20vw;

    border: 3px solid white;
    border-radius: 5%;

    padding: 20px;

    transition: all 0.12s;
    cursor: pointer;

    background-color: rgb(201, 201, 201);
    color: black;
  }

  div:hover {
    background-color: rgb(51, 51, 51);
    transform: scale(1.1);

    box-shadow: 0px 0px 5px 2px black;
  }

  div:hover * {
    color: white;
  }

  .date {
    font-family: "Ubuntu", sans-serif;
    font-weight: 600;

    width: 100%;
    font-size: 0.8em;
    text-align: right;
    margin: 0;

    color: black;
  }

  h1 {
    font-family: "Raleway", sans-serif;
    font-size: 1.3em;
    text-align: center;
    margin: 0;
  }

  h2 {
    font-family: "Raleway", sans-serif;
    font-size: 0.8em;
    text-align: left;
    margin: 0;
  }
</style>
