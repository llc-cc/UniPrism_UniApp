<template>
  <view class="interaction-host">
    <ProZenoChase v-if="type === 'zeno-chase'" />
    <ProLiuHuiPolygon v-else-if="type === 'liu-hui-polygon'" />
    <ProSequenceLimit v-else-if="type === 'sequence-limit-epsilon'" />
    <ProContinuityWindow v-else-if="type === 'continuity-window'" />
    <ProRiemannLedger v-else-if="type === 'riemann-ledger'" />
    <ProCalculatorPrecision v-else-if="type === 'calculator-precision'" />
    <ProPolynomialDegree v-else-if="type === 'polynomial-degree'" />
    <ProMatrixGridAction v-else-if="type === 'matrix-grid-action'" />
    <ProMatrixOrderCube v-else-if="type === 'matrix-order-cube'" />
    <ProRgbVectorBlend v-else-if="type === 'rgb-vector-blend'" />
    <ProPixelIconVector v-else-if="type === 'pixel-icon-vector'" />
    <ProBasisVectorCompose v-else-if="type === 'basis-vector-compose'" />
    <ProBasisRankTransform v-else-if="type === 'basis-rank-transform'" />
    <ProEdgeDetectionMatrix v-else-if="type === 'edge-detection-matrix'" />
    <ProTagVectorRecommendation v-else-if="type === 'tag-vector-recommendation'" />
  </view>
</template>

<script>
import ProZenoChase from './interactions/ProZenoChase.vue'
import ProLiuHuiPolygon from './interactions/ProLiuHuiPolygon.vue'
import ProSequenceLimit from './interactions/ProSequenceLimit.vue'
import ProContinuityWindow from './interactions/ProContinuityWindow.vue'
import ProRiemannLedger from './interactions/ProRiemannLedger.vue'
import ProCalculatorPrecision from './interactions/ProCalculatorPrecision.vue'
import ProPolynomialDegree from './interactions/ProPolynomialDegree.vue'
import ProMatrixGridAction from './interactions/ProMatrixGridAction.vue'
import ProMatrixOrderCube from './interactions/ProMatrixOrderCube.vue'
import ProRgbVectorBlend from './interactions/ProRgbVectorBlend.vue'
import ProPixelIconVector from './interactions/ProPixelIconVector.vue'
import ProBasisVectorCompose from './interactions/ProBasisVectorCompose.vue'
import ProBasisRankTransform from './interactions/ProBasisRankTransform.vue'
import ProEdgeDetectionMatrix from './interactions/ProEdgeDetectionMatrix.vue'
import ProTagVectorRecommendation from './interactions/ProTagVectorRecommendation.vue'

export default {
  name: 'ProInteractionHost',
  components: {
    ProZenoChase,
    ProLiuHuiPolygon,
    ProSequenceLimit,
    ProContinuityWindow,
    ProRiemannLedger,
    ProCalculatorPrecision,
    ProPolynomialDegree,
    ProMatrixGridAction,
    ProMatrixOrderCube,
    ProRgbVectorBlend,
    ProPixelIconVector,
    ProBasisVectorCompose,
    ProBasisRankTransform,
    ProEdgeDetectionMatrix,
    ProTagVectorRecommendation,
  },
  props: {
    type: { type: String, required: true },
  },
}
</script>

<style scoped>
.interaction-host {
  width: 100%;
}
</style>
