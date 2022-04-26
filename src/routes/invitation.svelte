<script>
  let linzy = false;
  let message =
    "I don't know how to brighten up your day really, or to be the person that makes your day, but I want you to know that I'm always thinking about you.  I typically would invest more time into making this look nicer than just text on a screen, but I literally wrote the code to do this in like 15 minutes because I wanted to catch you before you left work.  I'll have time to touch this up and polish it later, but my idea for this is I would like to leave you small messages from time to time.  Ideally I'd be able to write you little pick-me-up's daily, but I don't think I'll have the time to be able to right now.  I'll continue to develop this little personal page of yours when I have the time, and who knows maybe in a year or two it will turn into something really special.  You're the only 'code' I've written into my website right now.  I got those business cards months ago with the idea to create little personalized pages for people, or to give them to potential employers.  I hadn't done a single thing with them until now, so congrats on being the first B) I hope your day improves, and you feel better.  As always, if there's anything I can do for you, do not hesitate to ask.";

  const onFocus = (e) => {
    e.target.select();
  };

  const submit = (e) => {
    // get the text from the input fields

    const in1 = document.getElementById("in1").value;
    const in2 = document.getElementById("in2").value;
    const in3 = document.getElementById("in3").value;
    const in4 = document.getElementById("in4").value;

    const code = in1 + in2 + in3 + in4;

    linzy = code.toLowerCase() === "linz";
  };
</script>

{#if linzy}
  <div class="message">
    <h2>Linzy,</h2>
    <p>{message}</p>
    <h5>~Kieran</h5>
  </div>
{:else}
  <div>
    <h3>Invite Code</h3>

    <ul>
      <li><input id="in1" type="text" required maxlength="1" on:focus={onFocus} /></li>
      <li><input id="in2" type="text" required maxlength="1" on:focus={onFocus} /></li>
      <li><input id="in3" type="text" required maxlength="1" on:focus={onFocus} /></li>
      <li><input id="in4" type="text" required maxlength="1" on:focus={onFocus} /></li>
    </ul>

    <button on:click={submit}>SUBMIT</button>
  </div>
{/if}

<style>
  h3 {
    text-transform: uppercase;
    font-family: "Raleway", sans-serif;
    font-weight: 800;

    text-shadow: 0px 0px 1px #000;
  }

  .message {
    margin-top: 20px;
  }

  p {
    max-width: 75%;
  }

  div {
    width: 100%;
    margin-top: 80px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  ul {
    display: flex;
    flex-direction: row;

    list-style: none;
    padding: 0;
    margin: 0;

    border: none;
  }

  li {
    margin: 5px;

    border: none;
  }

  input {
    width: 60px;
    height: 90px;
    border: none;
    border-radius: 12px;
    outline: none;
    background: transparent;

    transition: all 0.12s;

    font-family: "Roboto Condensed", sans-serif;
    font-size: 3em;
    font-weight: 600;
    text-align: center;
    vertical-align: text-top;

    text-transform: uppercase;
    caret-color: transparent;

    background-color: rgb(94, 94, 94);
    box-shadow: 0 5px 0px 0px rgb(63, 63, 63);
  }

  input::selection {
    background: transparent;
  }

  input:focus {
    background-color: rgb(177, 177, 177);
  }

  input:valid:not(:focus) {
    background-color: white;
  }

  button {
    margin-top: 25px;
    width: 280px;

    padding: 12px;
    border-radius: 12px;

    font-family: "Raleway", sans-serif;
    font-weight: 800;
    font-size: 1.25em;

    box-shadow: 0 5px 0px 0px rgb(63, 63, 63);
    outline: none;
    border: none;
  }

  button:focus {
    outline: none;
  }

  button:active {
    background-color: rgb(177, 177, 177);

    transform: translateY(5px);
    box-shadow: none;
  }
</style>
