const container = document.querySelector('.container')
const faceSlider = document.querySelector('.face-slider')
const btnYes = document.querySelector('.button-yes')
const btnNo = document.querySelector('.button-no')
const title = document.querySelector('.title')
const subtitle = document.querySelector('.subtitle')
const current = {
    happiness: 0.9,
    derp: 1,
    px: 0.5,
    py: 0.5
}
const target = { ...current }
const acceptedtarget = {
    happiness: 1,
    derp: 0,
    px: 0.5,
    py: 0.5
}
const rejectedtarget = {
    happiness: 0.2,
    derp: 0,
    px: 0.5,
    py: 0.5
}
let rejectCount = 0
const maxrejectCount = 2
let isAnimating = true

container.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
    const yesRect = btnYes.getBoundingClientRect()
    const noRect = btnNo.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    const dx1 = x - (yesRect.x + yesRect.width * 0.5)
    const dy1 = y - (yesRect.y + yesRect.height * 0.5)
    const dx2 = x - (noRect.x + noRect.width * 0.5)
    const dy2 = y - (noRect.y + noRect.height * 0.5)

    const px = (x - containerRect.x) / containerRect.width
    const py = (y - containerRect.y) / containerRect.height

    const distYes = Math.sqrt(dx1 * dx1 + dy1 * dy1)
    const distNo = Math.sqrt(dx2 * dx2 + dy2 * dy2)
    const happiness = Math.pow(distYes / (distNo + distYes), 0.75)

    target.happiness = happiness
    target.derp = 0
    target.px = px
    target.py = py
})

container.addEventListener('mouseleave', () => {
    target.happiness = 0.9
    target.derp = 1
    target.px = 0.5
    target.py = 0.5
})

btnNo.addEventListener('click', () => {
    if (isAnimating) {
        Object.assign(current, acceptedtarget)
        btnNo.innerHTML = '返回'
        title.innerHTML = '已取消'
        subtitle.innerHTML = '感谢您继续使用本插件'
        btnYes.style.visibility = 'hidden'
        isAnimating = false
    } else {
        btnNo.innerHTML = '取消'
        title.innerHTML = '你确定要卸载吗'
        subtitle.innerHTML = '希望不要卸载'
        isAnimating = true
        btnYes.style.visibility = 'visible'
        btnYes.style.position = 'static'
        btnYes.style.left = ''
        btnYes.style.top = ''
        updateFace()
    }
})

btnYes.addEventListener('click', () => {
    if (isAnimating) {
        rejectCount++
        if (rejectCount >= maxrejectCount) {
            Object.assign(current, rejectedtarget)
            btnYes.innerHTML = '返回'
            title.innerHTML = '已删除'
            subtitle.innerHTML = '感谢您使用本插件'
            btnNo.style.visibility = 'hidden'
            btnYes.style.position = 'static'
            btnYes.style.left = ''
            btnYes.style.top = ''
            isAnimating = false
        } else {
            btnYes.style.position = 'absolute'
            btnYes.style.left = `${Math.random() * 80}%`
            btnYes.style.top = `${Math.random() * 80}%`
            target.happiness = Math.max(0.1, target.happiness - 0.1)
            btnNo.style.transform = `scale(${1 + rejectCount * 0.1})`
        }
    } else {
        btnYes.innerHTML = '卸载'
        title.innerHTML = '你确定要卸载吗'
        subtitle.innerHTML = '希望不要卸载'
        btnNo.style.visibility = 'visible'
        btnYes.style.position = 'static'
        btnYes.style.left = ''
        btnYes.style.top = ''
        isAnimating = true
        updateFace()
    }
})

function updateFace() {
    for (let prop in target) {
        if (target[prop] === current[prop]) {
            continue
        } else if (Math.abs(target[prop] - current[prop]) < 0.01) {
            current[prop] = target[prop]
        } else {
            current[prop] += (target[prop] - current[prop]) * 0.1
        }
        faceSlider.style.setProperty(`--${prop}`, current[prop])
    }
    if (!isAnimating) return
    requestAnimationFrame(updateFace)
}

updateFace()
