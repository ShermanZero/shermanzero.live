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
    transition:fly={{ duration: 300, delay: showDelay, x: 0, y: 50, opacity: 0, easing: quintOut }}
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

    min-width: 160px;
    min-height: 160px;

    width: 20vw;
    height: 20vw;

    border: 0px;
    border-radius: 5%;

    padding: 20px;

    transition: all 0.12s;
    cursor: pointer;

    background: linear-gradient(180deg, rgb(230, 230, 230) 0%, rgb(22, 20, 20, 0.1) 100%);
    color: black;

    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);

    overflow: hidden;
  }

  div:hover {
    background: linear-gradient(180deg, rgb(187, 199, 202) 0%, rgba(66, 85, 82, 0.1) 100%);

    transform: translateY(10px);
  }

  .date {
    font-family: "Robot Condensed", sans-serif;
    font-weight: 600;

    width: 100%;
    font-size: 0.8em;
    text-align: right;
    margin: 0;
    font-weight: 700;
    font-style: italic;

    color: black;
  }

  h1 {
    font-family: "Roboto Condensed", sans-serif;
    font-size: 1.3em;
    text-align: center;
    margin: 0;
  }

  h2 {
    font-family: "Raleway", sans-serif;
    font-size: 0.8em;
    text-align: left;
    font-weight: 600;
    margin: 0;
  }
</style>
