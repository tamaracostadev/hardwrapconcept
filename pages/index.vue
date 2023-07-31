<script lang="ts" setup>
</script>

<template>
  <div id="hero" class="relative w-full h-full min-h-screen bg-black">
    <h1 class="w-full text-center text-secondary leading-[56px] relative z-10 pt-24 pb-6 font-title text-7xl gradient">Personalização Sofisticada<br>
      Para Proprietários Exigentes</h1>
    <ThreeCar />
    <img src="/bg_texture.jpg" alt="textura background" class="absolute top-0 h-[100dvh] w-[100-dvw] texture">

  </div>

</template>

<style scoped>

.texture{
  object-fit: cover;
  object-position: center;
  z-index: 1;
  opacity: 0.6;
}
.gradient {
  background-image: linear-gradient(to right, #3d3629, #c7b686, #3d3629);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  /* Defina aqui a cor de sobreposição para a fonte, pode ser uma cor que combine com o degradê */
  text-shadow: 0 0 5px rgba(98, 88, 66, 0.4);
}
</style>

