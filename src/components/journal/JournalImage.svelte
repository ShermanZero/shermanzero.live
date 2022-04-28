<script>
  export let imageSrc;
  export let imageAlt;
</script>

<div>
  <img src={imageSrc} alt={imageAlt} />
</div>

<style>
  img {
    width: 150px;
    height: auto;
    transform: translateY(-30px);
  }

  div {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 3px solid white;
    overflow: hidden;

    float: right;
    margin: 12px;

    box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.548);
  }
</style>
