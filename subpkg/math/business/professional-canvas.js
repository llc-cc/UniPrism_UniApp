/**
 * 小程序 canvas 2d 初始化辅助
 */
export function queryCanvasNode(component, selector) {
  return new Promise((resolve, reject) => {
    uni
      .createSelectorQuery()
      .in(component)
      .select(selector)
      .fields({ node: true, size: true })
      .exec((res) => {
        const entry = res?.[0]
        if (!entry?.node) {
          reject(new Error(`canvas not found: ${selector}`))
          return
        }
        resolve(entry)
      })
  })
}

export function setupCanvas2d(entry, logicalWidth, logicalHeight) {
  const canvas = entry.node
  const dpr = uni.getSystemInfoSync().pixelRatio || 2
  canvas.width = Math.round(logicalWidth * dpr)
  canvas.height = Math.round(logicalHeight * dpr)
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  return { canvas, ctx, dpr }
}

export function clearCanvas(ctx, width, height, fill = '#ffffff') {
  ctx.fillStyle = fill
  ctx.fillRect(0, 0, width, height)
}

export function drawLine(ctx, x1, y1, x2, y2, color = '#102033', width = 2) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

export function drawCircle(ctx, x, y, r, fill, stroke, strokeWidth = 1) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = strokeWidth
    ctx.stroke()
  }
}

export function drawText(ctx, text, x, y, options = {}) {
  const {
    color = '#102033',
    size = 12,
    align = 'left',
    baseline = 'alphabetic',
    bold = false,
  } = options
  ctx.fillStyle = color
  ctx.font = `${bold ? 'bold ' : ''}${size}px sans-serif`
  ctx.textAlign = align
  ctx.textBaseline = baseline
  ctx.fillText(text, x, y)
}

export function drawPolygon(ctx, points, fill, stroke, strokeWidth = 2) {
  if (!points.length) return
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y))
  ctx.closePath()
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = strokeWidth
    ctx.stroke()
  }
}

export function drawDashedLine(ctx, x1, y1, x2, y2, color = '#c46d00', width = 3) {
  ctx.save()
  ctx.setLineDash([8, 6])
  drawLine(ctx, x1, y1, x2, y2, color, width)
  ctx.restore()
}

export function drawRect(ctx, x, y, width, height, fill, stroke, strokeWidth = 1, dash = null) {
  ctx.beginPath()
  if (dash) ctx.setLineDash(dash)
  ctx.rect(x, y, width, height)
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = strokeWidth
    ctx.stroke()
  }
  if (dash) ctx.setLineDash([])
}
