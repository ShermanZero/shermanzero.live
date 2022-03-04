<script>
  $: hover = null;

  const onMouseEnter = (e) => {
    hover = e.target.innerHTML.trim().toLowerCase();
  };

  const onMouseLeave = (e) => {
    hover = null;
  };
</script>

<nav>
  <div>
    <span
      ><a href="/"
        >shermanzero.live/
        {#if hover}
          <span id="link">{hover}</span>
        {/if}
      </a></span
    >
    <ul id="navlist">
      <li><a href="/api" on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>API</a></li>
      <li><a href="/downloads" on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>Downloads</a></li>
      <li><a href="/portfolio" on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>Portfolio</a></li>
      <li><a href="/projects" on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>Projects</a></li>
      <li><a href="/upcoming" on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>Upcoming</a></li>
    </ul>
  </div>
</nav>

<slot />

<style>
  @media only screen and (max-width: 800px) {
    li {
      display: none;
    }
  }

  span:not(#link) {
    position: absolute;
    display: block;
    text-align: center;

    top: 10px;
    left: 10px;

    color: white;

    font-family: "Raleway", sans-serif;
  }

  #link {
    margin-left: -5px;
    padding-left: 0;
    color: rgb(105, 105, 105);
    font-style: italic;
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
    align-self: flex-end;

    list-style-type: none;
    margin: 0;

    transition: all 0.1s;
  }

  li:last-child {
    padding-right: 25px;
  }

  li:hover {
    background-color: white;
  }

  li:hover * {
    font-family: "Raleway", sans-serif;
    color: black;
    font-weight: 800;
  }

  li a {
    display: block;

    color: rgb(161, 196, 199);
    text-decoration: none;
    text-transform: uppercase;

    width: 100%;
    height: 100%;

    padding: 12px 10px;
    transition: all 0.12s;

    text-shadow: 0px 5px 5px rgb(20, 20, 20);
  }

  li a:hover {
    cursor: pointer;
    padding: 12px 36px;
  }
</style>
