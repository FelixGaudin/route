<template>
  <div id="app">
    <canvas id ="beerCanvas"></canvas>
    <div class="debbuger">
      <Navbar/>
      <router-view/>
    </div>
  </div>
</template>



<script>
import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Navbar,
  },
  mounted() {
    // Bulles script
    var canvas = document.getElementById('beerCanvas');
    setInterval(()=>{
        canvas.style.height = "0px";
        canvas.style.height = document.documentElement.scrollHeight + "px";
    }, 100)
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 500;

    for (var i = 0; i < particleCount; i++) {
        particles.push(new particle());
    }

    function particle() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 300;
        this.speed = 0.2 + Math.random();
        this.radius = Math.random() * 3;
        this.opacity = (Math.random() * 100) / 1000;
    }

    function loop() {
        requestAnimationFrame(loop);
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
            ctx.fill();
            p.y -= p.speed;
            if (p.y <= -10)
                particles[i] = new particle();
        }
    }
    loop();
  },
}
</script>

<style>

</style>

<style>
/* @import '../src/css/all.css'; */
/* TODO:avoir les icons en offline */
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css');
@import url('https://use.fontawesome.com/releases/v5.2.0/css/all.css');
@import '../src/css/bulles.css';
body::-webkit-scrollbar {
  display: none;
}
</style>

