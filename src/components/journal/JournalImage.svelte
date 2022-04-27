<script>
  export let imageSrc;
  export let imageAlt;
</script>

<div>
  <img src={imageSrc} alt={imageAlt} />
</div>

<style>
  img {
    width: 240px;
    height: auto;
    transform: translateY(-40px);
  }

  div {
    width: 240px;
    height: 240px;
    border-radius: 50%;
    border: 3px solid white;
    overflow: hidden;

    float: right;
    margin-right: 12px;

    box-shadow: 0px 0px 20px white;
  }
</style>
