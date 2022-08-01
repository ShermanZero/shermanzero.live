<h1>Vanessa's Hideout</h1>

<div class="wrapper">

  <div class="intervalWrapper">
    <label for="intervalTime">every</label>
    <input id="intervalTime" type="number" value="30">
    <select name="" id="intervalSelection" value="1">
      <option value="0">seconds</option>
      <option value="1">minutes</option>
      <option value="2">hours</option>
    </select>
  </div>

  <div>
    <label for="startTime">starting at</label>
    <input id="startTime" type="time" value="00:00">
  </div>

  <div>
    <label for="intervalIteration">and repeating</label>
    <input id="intervalIteration" type="number" value="12">
    <label for="intervalIteration">times</label>
  </div>

  <div>
    <h2>send me</h2>
    <ul>
      <li><input type="checkbox" class="checkbox-round" checked>quotes</li>
      <li><input type="checkbox" class="checkbox-round" checked>random</li>
      <li><input type="checkbox" class="checkbox-round">feels</li>
      <li><input type="checkbox" class="checkbox-round" checked>jokes</li>
      <li><input type="checkbox" class="checkbox-round">memes</li>
    </ul>

  </div>

  <button>Save Changes</button>
</div>


<style>
  h1, h2 {
    text-align: center;
    font-family: "Square Peg", cursive;
    font-size: 3.5em;
    font-weight: 200;
    color: whitesmoke;
    margin-top: 4px;
    margin-bottom: 0;
  }

  h2 {
    font-size: 3em;
    font-weight: 900;
  }

  ul {
    list-style: none;
    margin: auto;
  }

  li {
    font-family: "Lato";
    font-weight: 800;
    font-size: 16px;
    margin-right: 50px;
  }

  button {
    font-family: "Lato";
    font-weight: 800;
    font-size: 16px;
    background-image: linear-gradient(to right, hsl(274, 27%, 35%),rgb(27, 83, 85));
    color: rgb(238, 238, 238);
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    margin-top: 34px;
    margin-bottom: 8px;
    width: 100%;
    box-shadow: 0px 5px 0px 0px rgba(238, 238, 238, 0.75);
  }

  button:hover {
    box-shadow: 0px 2px 0px 0px rgba(238, 238, 238, 0.75);
    transform: translateY(3px);
    cursor: pointer;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 360px;

    background-image: linear-gradient(to top, hsl(300, 3%, 6%),rgb(6, 22, 22));
    border-radius: 20px;
    border: 2px solid rgb(155, 155, 155);

    margin: auto;
    padding: 12px;
  }

  .intervalWrapper {
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 2px;
  }

  input[type=number] {
    width: 50px;
    height: 35px;
    padding: 4px;
    margin: 0 5px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-family: "Lato", sans-serif;
    font-weight: 800;
    font-size: 18px;
    text-align: center;
  }

  input[type=time] {
    width: 180px;
    height: 35px;
    padding: 4px;
    margin: 5px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-family: "Lato", sans-serif;
    font-weight: 800;
    font-size: 16px;
    text-align: left;
  }

  input[type=checkbox] {
    padding: 4px;
    margin: 5px;
    display: inline-block;
    box-sizing: border-box;
    font-family: "Lato", sans-serif;
    font-weight: 800;
    font-size: 16px;
    text-align: left;
  }

  .checkbox-round {
    width: 1.5em;
    height: 1.5em;
    background-color: rgb(88, 86, 86);
    border-radius: 50%;
    vertical-align: middle;
    border: 3px solid #aaa;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;

    transition: all 0.075s ease-in-out;
  }

  .checkbox-round:checked {
      background-color: rgb(55, 107, 196);
       border: 3px solid white;
  }

  select {
    width: 100px;
    height: 35px;
    padding: 4px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-family: "Lato", sans-serif;
    font-weight: 800;
    font-size: 16px;
    text-align: left;
  }

  label {
    font-family: "Lato", sans-serif;
    font-size: 14px;
    font-weight: 800;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }


</style>