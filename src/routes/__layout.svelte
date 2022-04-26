<script>
  $: lastUpdated = null;
  $: lastMessage = null;

  let showUpdated = false;

  $: icons = true;

  const fetchLastUpdate = () => {
    fetch("https://api.github.com/repos/shermanzero/shermanzero.com/branches/main")
      .then((res) => res.json())
      .then((data) => {
        if (data.commit) {
          lastUpdated = data.commit.commit.committer.date;
          lastUpdated = new Date(lastUpdated).toLocaleString();
          lastMessage = data.commit.commit.message;
        }
      });
  };

  const toggleIcons = () => {
    icons = !icons;
  };

  fetchLastUpdate();
</script>

<nav>
  <div class="wrapper">
    <span><a href="/">shermanzero.live</a></span>

    <ul id="navlist">
      <li class="toggle">
        <label class="switch">
          <input type="checkbox" checked on:change={toggleIcons} />
          <span class="slider round" />
        </label>
      </li>
      {#if icons}
        <li>
          <a href="/api" class="icon"> <img src="/svgs/nav/api.svg" width="28" alt="api" /> </a>
        </li>
        <li>
          <a href="/downloads" class="icon"> <img src="/svgs/nav/downloads.svg" width="28" alt="downloads" /> </a>
        </li>
        <li>
          <a href="/portfolio" class="icon"> <img src="/svgs/nav/portfolio.svg" width="28" alt="portfolio" /> </a>
        </li>
        <li>
          <a href="/projects" class="icon"> <img src="/svgs/nav/projects.svg" width="28" alt="projects" /> </a>
        </li>
        <li>
          <a href="/socials" class="icon"> <img src="/svgs/nav/socials.svg" width="28" alt="socials" /> </a>
        </li>
        <li>
          <a href="/upcoming" class="icon"> <img src="/svgs/nav/upcoming.svg" width="28" alt="upcoming" /> </a>
        </li>
      {:else}
        <li class="text"><a href="/api">API</a></li>
        <li class="text"><a href="/downloads">Downloads</a></li>
        <li class="text"><a href="/portfolio">Portfolio</a></li>
        <li class="text"><a href="/projects">Projects</a></li>
        <li class="text"><a href="/socials">Socials</a></li>
        <li class="text"><a href="/upcoming">Upcoming</a></li>
      {/if}
    </ul>
  </div>
</nav>

<slot />

{#if lastUpdated && lastMessage && showUpdated}
  <footer class="update">
    <a href="https://github.com/ShermanZero/shermanzero.com" target="_">LATEST BUILD</a> ON [{lastUpdated}] -
    <q>{lastMessage}</q>
  </footer>
{/if}

<style>
  @media only screen and (max-width: 800px) {
    .text {
      display: none;
    }

    .toggle {
      display: none;
    }
  }
  .wrapper {
    width: 100%;
    height: 100%;
  }

  .update {
    padding: 15px;
    border-radius: 5px;
    background-color: lightgray;
    color: darkslategray;

    position: fixed;
    bottom: 12px;
    left: 12px;

    font-family: "Roboto Condensed", sans-serif;
    opacity: 0.25;
    transition: all 0.2s ease;

    margin-right: 12px;
  }

  .update:hover {
    opacity: 1;
  }

  .update a {
    text-decoration: none;
    color: rgb(160, 72, 167);
  }

  span {
    position: absolute;
    display: block;
    text-align: center;

    top: 10px;
    left: 10px;

    color: white;

    font-family: "Raleway", sans-serif;
  }

  span a {
    font-family: "Raleway", sans-serif;
    margin: 20px 0px;
    color: white;
    text-decoration: none;
    text-transform: lowercase;
  }

  nav {
    width: 100%;
    position: sticky;
    z-index: 999;
    background-color: rgb(20, 20, 20);
    top: 0;
    right: 0;

    height: 42px;
  }

  ul {
    margin: 0;
    padding: 0;

    margin-right: 20px;

    display: flex;
    flex-direction: row;

    justify-content: flex-end;

    width: 100%;
    height: 100%;
  }

  li {
    flex-shrink: 1;
    align-self: center;

    list-style-type: none;
    margin: 0;

    border-radius: 4px;

    padding: 0px 4px;

    transition: all 0.1s;
    overflow: hidden;
  }

  li:last-child {
    margin-right: 25px;
  }

  li:hover {
    background-color: white;
  }

  .icon {
    transition: all 0.12s;
  }

  .icon:hover {
    filter: invert(80%);
  }

  li:hover * {
    font-family: "Raleway", sans-serif;
    color: black;
    font-weight: 800;

    cursor: pointer;
  }

  li a {
    display: block;

    color: rgb(161, 196, 199);
    text-decoration: none;
    text-transform: uppercase;

    font-size: 0.8em;

    width: 100%;
    height: 100%;

    transition: all 0.12s;

    text-shadow: 0px 5px 5px rgb(20, 20, 20, 0.3);
  }

  li a:hover {
    cursor: pointer;
    padding: 12px 18px;
  }

  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 24px;

    margin: 0;
    margin-right: 6px;
    padding: 0;
    transform: translateY(0px);
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;

    margin: 0;
    padding: 0;

    transform: translateY(-5px);
  }

  /* The slider */
  .slider {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.1s;
    transition: 0.1s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.1s;
    transition: 0.1s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(16px);
    -ms-transform: translateX(16px);
    transform: translateX(16px);
  }

  a {
    padding: 0;
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
