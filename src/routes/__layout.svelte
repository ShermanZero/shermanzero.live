<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/projects">Projects</a></li>
    <li><a href="/portfolio">Portfolio</a></li>
    <li><a href="/downloads">Downloads</a></li>
    <li><a href="/api">API</a></li>
    <li><a href="/upcoming">Upcoming</a></li>
  </ul>
</nav>

<slot />

<style>
  nav {
    width: 180px;
    height: 100%;
    position: fixed;
    background-color: rgb(20, 20, 20);

    margin: 0;
    overflow: hidden;
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
    color: black;
    font-weight: 600;
  }

  a {
    color: rgb(124, 185, 209);
    text-decoration: none;
    text-transform: uppercase;

    width: 100%;
    height: 100%;
  }
</style>
