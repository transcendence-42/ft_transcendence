export const drawStage = (ctx: any, grid: object) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(50, 100, 20*Math.sin(10*0.05)**2, 0, 2*Math.PI)
  ctx.fill()
}

export const drawScores = (ctx: any, grid: object, scores: any) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(50, 100, 20*Math.sin(10*0.05)**2, 0, 2*Math.PI)
  ctx.fill()
}

export const drawPaddles = (ctx: any, grid: object) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(50, 100, 20*Math.sin(10*0.05)**2, 0, 2*Math.PI)
  ctx.fill()
}

export const drawBall = (ctx: any, grid: object) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(50, 100, 20*Math.sin(10*0.05)**2, 0, 2*Math.PI)
  ctx.fill()
}

export const drawMessages = (ctx: any, grid: object, message: string) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(50, 100, 20*Math.sin(10*0.05)**2, 0, 2*Math.PI)
  ctx.fill()
}
