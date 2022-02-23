<nav>
  <span><a href="/">shermanzero.live</a></span>
  <ul>
    <li><a href="/api">API</a></li>
    <li><a href="/downloads">Downloads</a></li>
    <li><a href="/portfolio">Portfolio</a></li>
    <li><a href="/projects">Projects</a></li>
    <li><a href="/upcoming">Upcoming</a></li>
  </ul>
</nav>

<slot />

<style>
  span {
    display: block;
    width: 100%;
    margin: auto;
    text-align: center;

    margin: 20px 0px;
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
    width: 180px;
    height: 100%;
    position: fixed;
    background-color: rgb(20, 20, 20);

    margin-left: -100px;
    overflow: hidden;

    border-right: 2px solid white;
  }

  ul {
    margin: 0;
    padding: 0;

    width: 100%;
    height: 100%;
  }

  li {
    margin: 0;
    padding: 10px 10px;

    width: 100%;

    transition: all 0.1s;
  }

  li:hover {
    cursor: pointer;

    background-color: white;
    padding: 15px 10px;
    transform: scale(1.25) translateX(20px);
  }

  li:hover * {
    font-family: "Raleway", sans-serif;
    color: black;
    font-weight: 800;
  }

  li a {
    display: block;

    color: rgb(124, 185, 209);
    text-decoration: none;
    text-transform: uppercase;

    width: 100%;
    height: 100%;
  }
</style>
