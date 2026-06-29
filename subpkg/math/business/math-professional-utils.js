import { LIMIT_POLYGON_SIDES } from './math-professional-assets'

export function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function getClampedRatio(value, min, max) {
  return clampNumber((value - min) / (max - min), 0, 1)
}

export function formatLimitNumber(value) {
  if (value === 0) return '0'
  if (value >= 10) return value.toFixed(1)
  if (value >= 1) return value.toFixed(2)
  if (value >= 0.01) return value.toFixed(3)
  return value.toExponential(2)
}

export function formatZenoCoordinate(value) {
  const rounded = Math.round(value * 100) / 100
  return rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
}

export function getZenoSceneX(value, width = 806, offset = 68) {
  return offset + (clampNumber(value, 0, 20) / 20) * width
}

export function getZenoChaseState(step) {
  const chaseGap = 10 * 0.5 ** step
  const elapsedSeconds = 10 * (1 - 0.5 ** step)
  const achillesPosition = 2 * elapsedSeconds
  const turtlePosition = 10 + elapsedSeconds
  return { chaseGap, elapsedSeconds, achillesPosition, turtlePosition }
}

export function getRegularPolygonPoints(sides, centerX = 100, centerY = 100, radius = 78) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (index / sides) * Math.PI * 2
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    }
  })
}

export function getLiuHuiPolygonState(polygonIndex) {
  const polygonSides = LIMIT_POLYGON_SIDES[polygonIndex] ?? 12
  const polygonArea = (polygonSides / 2) * Math.sin((2 * Math.PI) / polygonSides)
  const circleArea = Math.PI
  const areaGap = circleArea - polygonArea
  return { polygonSides, polygonArea, circleArea, areaGap }
}

export function getSequenceLimitThreshold(epsilon) {
  return Math.floor(1 / epsilon) + 1
}

export function getSequenceValue(n) {
  return 1 + 1 / n
}

export function getSequenceDistance(n) {
  return Math.abs(getSequenceValue(n) - 1)
}

export function formatSubscriptNumber(value) {
  const subscripts = '₀₁₂₃₄₅₆₇₈₉'
  return String(value)
    .split('')
    .map((char) => {
      const digit = Number(char)
      return Number.isNaN(digit) ? char : subscripts[digit] ?? char
    })
    .join('')
}

export function factorial(value) {
  return Array.from({ length: Math.max(0, value) }, (_, index) => index + 1).reduce(
    (product, current) => product * current,
    1,
  )
}

export function sinTaylorPartialByTermCount(x, termCount) {
  return Array.from({ length: termCount }, (_, index) => {
    const power = 2 * index + 1
    const sign = index % 2 === 0 ? 1 : -1
    return sign * x ** power / factorial(power)
  }).reduce((sum, value) => sum + value, 0)
}

export function sinTaylorNextTermBound(x, termCount) {
  const nextPower = 2 * termCount + 1
  return Math.abs(x) ** nextPower / factorial(nextPower)
}

export function getSinCalculatorTermCount(x, epsilon) {
  return (
    Array.from({ length: 7 }, (_, index) => index + 1).find(
      (termCount) => sinTaylorNextTermBound(x, termCount) < epsilon,
    ) ?? 7
  )
}

export function applyMatrix2(matrix, vector) {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
  ]
}

export function matrixDeterminant2(matrix) {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
}
