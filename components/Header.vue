<template>
  <header class="w-full font-title text-primary h-30 z-50 fixed ">
    <nav class="max-w-screen-xl mx-auto">
      <div class="flex items-center justify-between mx-20">
<!--Menu hamburguer-->
        <button class="hamburguer" @click="toggleMenu">
          <div></div>
          <div></div>
          <div></div>
        </button>
<!--Logo-->
        <img src="~/assets/logo.png" alt="logo" class="w-28">
        <a href="#" class=" font-semibold gradient text-xl">Contato</a>
      </div>
    </nav>
  </header>
<!--Menu lateral-->
  <div class="absolute w-[100dvw] h-[100dvh] top-0 bg-black z-30 opacity-80 left-[-100%] side">
  </div>
  <div class="absolute w-[100dvw] h-[100dvh] top-0 z-30 left-[-100%] side-items">
    <div class="max-w-screen-xl mx-auto h-full">
      <ul class="flex flex-col items-start justify-center h-full ml-16 pt-24">
        <li v-for="item in menuItems" :key="item.name" :class="['text-4xl', 'font-title', 'mb-3', 'menu-item', { 'active': item.active }]" @click="handleItemClick(item)">
          <button class="gradient-menu py-2 px-4">{{ item.name }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

  export default {
    name: "Header",
    data(){
      return{
        menuItems: [
          {
            name: 'Envelopamento',
            active: false,
            link: '#'
          },
          {
            name: 'Película Solar',
            active:false,
            link: '#'
          },
          {
            name: 'Pintura de Rodas e Pinças',
            active:false,
            link: '#'
          },
          {
            name: 'Instalação de Som e Alarme',
            active:false,
            link: '#'
          },
          {
            name: 'Customizações especiais',
            active:false,
            link: '#'
          },
          {
            name: 'Projetos',
            active:false,
            link: '#'
          },
          {
            name: 'Sobre nós',
            active:false,
            link: '#'
          },
          {
            name: 'Contato',
            active:false,
            link: '#'
          },
        ]
      }
    },
    methods:{
      toggleMenu(){
        document.querySelector('.side').classList.toggle('active')
        document.querySelector('.side-items').classList.toggle('active')
        document.querySelector('.hamburguer').classList.toggle('active')
      },

      handleItemClick(item){
        this.menuItems.forEach(item => item.active = false)
        item.active = true
        this.toggleMenu()
      }
    }
  }

</script>

<style scoped lang="scss">




.hamburguer{
  width: 32px;
  height: 20px;
  position: relative;
  cursor: pointer;
  z-index: 10;
  div{
    width: 100%;
    height: 2px;
    background-color: #c7b686;
    position: absolute;
    left: 0;
    transition: all 0.3s ease;
    &:nth-child(1){
      top: 0;
    }
    &:nth-child(2){
      top: 50%;
      transform: translateY(-50%);
    }
    &:nth-child(3){
      bottom: 0;
    }
  }
  /* Animate transform to X with class ative */
  &.active{
    div{
      &:nth-child(1){
        top: 50%;
        transform:  rotate(45deg);
      }
      &:nth-child(2){
        opacity: 0;
      }
      &:nth-child(3){
        bottom: 40%;
        transform: rotate(-45deg);
      }
    }
  }
}
.side, .side-items{
  transition: all 0.7s ease-in-out;
  &.active{
    left: 0;
  }
}
.menu-item{
  transition: all 0.3s ease-in-out;
  &::after{
    content: '';
    display: block;
    margin-left: 20px;

    width: 50px;
    height: 2px;
    background-color: #c7b686;
    transition: all 0.3s ease-in-out;
  }

  &:hover, &.active{
    transform: translateX(30px);
    &::after{
      width: 110px;
    }
  }
}
</style>


