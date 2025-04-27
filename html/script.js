const confirmSection = document.querySelector('.confirm')
const boi = document.querySelector('.boi')
const btnDelete = document.querySelector('.confirm-body-button-delete')
const btnCancel = document.querySelector('.confirm-body-button-cancel')
const title = document.querySelector('.confirm-body-title')
const subtitle = document.querySelector('.confirm-body-subtitle')
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

confirmSection.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
    let dx1 = x - btnDelete.getBoundingClientRect().x - btnDelete.getBoundingClientRect().width * 0.5
    let dy1 = y - btnDelete.getBoundingClientRect().y - btnDelete.getBoundingClientRect().height * 0.5
    let dx2 = x - btnCancel.getBoundingClientRect().x - btnCancel.getBoundingClientRect().width * 0.5
    let dy2 = y - btnCancel.getBoundingClientRect().y - btnCancel.getBoundingClientRect().height * 0.5
    let px = (x - confirmSection.getBoundingClientRect().x) / confirmSection.getBoundingClientRect().width
    let py = (y - confirmSection.getBoundingClientRect().y) / confirmSection.getBoundingClientRect().height
    let distDelete = Math.sqrt(dx1 * dx1 + dy1 * dy1)
    let distCancel = Math.sqrt(dx2 * dx2 + dy2 * dy2)
    let happiness = Math.pow(distDelete / (distCancel + distDelete), 0.75)
    target.happiness = happiness
    target.derp = 0
    target.px = px
    target.py = py
})

confirmSection.addEventListener('mouseleave', () => {
    target.happiness = 0.9
    target.derp = 1
    target.px = 0.5
    target.py = 0.5
})

btnCancel.addEventListener('click', () => {
    if (isAnimating) {
        Object.assign(current, acceptedtarget)
        btnCancel.innerHTML = '返回'
        title.innerHTML = '已取消'
        subtitle.innerHTML = '感谢您继续使用本插件'
        btnDelete.style.visibility = 'hidden'
        isAnimating = false
    } else {
        btnCancel.innerHTML = '取消'
        title.innerHTML = '你确定要卸载吗'
        subtitle.innerHTML = '希望不要卸载'
        isAnimating = true
        btnDelete.style.visibility = 'visible'
        btnDelete.style.position = 'static'
        btnDelete.style.left = ''
        btnDelete.style.top = ''
        updateBoi()
    }
})

btnDelete.addEventListener('click', () => {
    if (isAnimating) {
        rejectCount++
        if (rejectCount >= maxrejectCount) {
            Object.assign(current, rejectedtarget)
            btnDelete.innerHTML = '返回'
            title.innerHTML = '已删除'
            subtitle.innerHTML = '感谢您使用本插件'
            btnCancel.style.visibility = 'hidden'
            btnDelete.style.position = 'static'
            btnDelete.style.left = ''
            btnDelete.style.top = ''
            isAnimating = false
        } else {
            btnDelete.style.position = 'absolute'
            btnDelete.style.left = `${Math.random() * 80}%`
            btnDelete.style.top = `${Math.random() * 80}%`
            target.happiness = Math.max(0.1, target.happiness - 0.1)
            btnCancel.style.transform = `scale(${1 + rejectCount * 0.1})`
        }
    } else {
        btnDelete.innerHTML = '卸载'
        title.innerHTML = '你确定要卸载吗'
        subtitle.innerHTML = '希望不要卸载'
        btnCancel.style.visibility = 'visible'
        btnDelete.style.position = 'static'
        btnDelete.style.left = ''
        btnDelete.style.top = ''
        isAnimating = true
        updateBoi()
    }
})

function updateBoi() {
    for (let prop in target) {
        if (target[prop] === current[prop]) {
            continue
        } else if (Math.abs(target[prop] - current[prop]) < 0.01) {
            current[prop] = target[prop]
        } else {
            current[prop] += (target[prop] - current[prop]) * 0.1
        }
        boi.style.setProperty(`--${prop}`, current[prop])
    }
    if (!isAnimating) return
    requestAnimationFrame(updateBoi)
}

updateBoi()
