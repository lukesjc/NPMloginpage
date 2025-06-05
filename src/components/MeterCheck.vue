<template>
  <div class="meter-check-wrapper">
    <div class="canvas-container">
      <canvas ref="gaugeCanvas"></canvas>
    </div>
    <div class="input-section">
      <label for="userInput">Enter a value:</label>
      <input type="number" v-model.number="inputValue" min="0" max="100" placeholder="0 - 100" />
      <button @click="updateGauge">Set</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "MeterCheck",
  setup() {
    const gaugeCanvas = ref<HTMLCanvasElement | null>(null);
    const inputValue = ref(0);

    // Constants & state
    const info = [
      { colorName: "Blue", hexCode: "#0000FF", threshold: 10 },
      { colorName: "Green", hexCode: "#00FF00", threshold: 30 },
      { colorName: "Yellow", hexCode: "#FFFF00", threshold: 60 },
      { colorName: "Orange", hexCode: "#FFA500", threshold: 80 },
      { colorName: "Red", hexCode: "#FF0000", threshold: 100 }
    ];
    const startAngle = (Math.PI * 150) / 180;
    const endAngle = (Math.PI * 390) / 180;
    const totalAngle = endAngle - startAngle;

    let currentValue = 0;
    let targetValue = 0;

    let ctx: CanvasRenderingContext2D | null = null;
    let centerX = 0;
    let centerY = 0;
    let radius = 0;

    function drawGauge(value: number) {
      if (!ctx || !gaugeCanvas.value) return;

      ctx.clearRect(0, 0, gaugeCanvas.value.width, gaugeCanvas.value.height);
      centerX = gaugeCanvas.value.width / 2;
      centerY = gaugeCanvas.value.height / 2;
      radius = Math.min(gaugeCanvas.value.width, gaugeCanvas.value.height) * 0.45;

      // Base arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineWidth = Math.max(2, radius * 0.1);
      ctx.strokeStyle = "#555";
      ctx.stroke();

      // Colored arcs
      let sa = startAngle;
      for (let i = 0; i < 5; i++) {
        const ea = startAngle + (info[i].threshold / 100) * totalAngle;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, sa, ea);
        ctx.lineWidth = Math.max(2, radius * 0.1);
        ctx.strokeStyle = info[i].colorName;
        ctx.stroke();
        sa = ea;
      }

      drawTicks(50, radius - 40, radius - 25);
      drawTicks(5, radius - 40, radius - 49);
      drawLabelsInside(5, 0, 100, radius);

      // Needle
      const needleAngle = startAngle + (value / 100) * totalAngle;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      const needleLength = radius * 0.6;
      ctx.lineTo(
        centerX + needleLength * Math.cos(needleAngle),
        centerY + needleLength * Math.sin(needleAngle)
      );
      ctx.lineWidth = Math.max(2, radius * 0.015);
      ctx.strokeStyle = "#2196F3";
      ctx.stroke();

      // Needle center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.04, 0, Math.PI * 2);
      ctx.fillStyle = "#2196F3";
      ctx.fill();

      // Value text
      ctx.fillStyle = "#FFF";
      ctx.font = `${Math.max(10, radius * 0.09)}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(`[${value.toFixed(2)}]`, centerX, centerY + 20);
    }

    function drawTicks(
      tickCount: number,
      innerRadius: number,
      outerRadius: number,
      color = "#FFF"
    ) {
      if (!ctx) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, radius * 0.01);

      for (let i = 0; i <= tickCount; i++) {
        const angle = startAngle + (i / tickCount) * totalAngle;
        const x1 = centerX + innerRadius * Math.cos(angle),
          y1 = centerY + innerRadius * Math.sin(angle);
        const x2 = centerX + outerRadius * Math.cos(angle),
          y2 = centerY + outerRadius * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    function drawLabelsInside(
      labelCount: number,
      minValue: number,
      maxValue: number,
      radiusVal: number
    ) {
      if (!ctx) return;

      ctx.fillStyle = "#FFF";
      ctx.font = `${radiusVal * 0.1}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i <= labelCount; i++) {
        const value = minValue + (i / labelCount) * (maxValue - minValue);
        const angle = startAngle + (i / labelCount) * totalAngle;
        const labelRadius = radiusVal * 0.4;
        const x = centerX + labelRadius * Math.cos(angle),
          y = centerY + labelRadius * Math.sin(angle);
        ctx.fillText(value.toFixed(2), x, y);
      }
    }

    function animateNeedle() {
      if (Math.abs(currentValue - targetValue) < 0.5) {
        currentValue = targetValue;
        drawGauge(currentValue);
        return;
      }
      currentValue += (targetValue - currentValue) * 0.06;
      drawGauge(currentValue);
      requestAnimationFrame(animateNeedle);
    }

    function updateGauge() {
      if (!isNaN(inputValue.value)) {
        targetValue = Math.min(100, Math.max(0, inputValue.value));
        animateNeedle();
      }
    }

    function resizeCanvas() {
      if (!gaugeCanvas.value) return;

      const container = gaugeCanvas.value.parentElement;
      if (!container) return;

      const maxWidth = container.offsetWidth;
      const maxHeight = window.innerHeight - 150;
      let width = maxWidth,
        height = width * 0.8;

      if (height > maxHeight) {
        height = maxHeight;
        width = height / 0.8;
      }

      gaugeCanvas.value.width = width;
      gaugeCanvas.value.height = height;
      drawGauge(currentValue);
    }

    onMounted(() => {
      if (!gaugeCanvas.value) return;
      ctx = gaugeCanvas.value.getContext("2d");
      if (!ctx) return;

      resizeCanvas();
      animateNeedle();

      window.addEventListener("resize", resizeCanvas);
    });

    return { gaugeCanvas, inputValue, updateGauge };
  }
});
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  background-color: #000;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgb(0, 0, 0);
}
.meter-check-wrapper {
  background-color: #000;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgb(0, 0, 0);
  position: relative;
}
.canvas-container {
  width: 90vw;
  max-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  display: block;
}

.input-section {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
  color: white;
}

.input-section input {
  width: 80px;
  padding: 5px;
}

.input-section button {
  padding: 5px 10px;
}
</style>
