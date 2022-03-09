<script>
  const onFocus = (e) => {
    e.target.select();
  };

  const submit = (e) => {};
</script>

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

<style>
  h3 {
    text-transform: uppercase;
    font-family: "Raleway", sans-serif;
    font-weight: 800;

    text-shadow: 0px 0px 1px #000;
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
