const confirmSection = document.querySelector('.confirm');
const acceptedSection = document.querySelector('.accepted');
const rejectedSection = document.querySelector('.rejected');
const boi = document.querySelector('.boi');
const btnDelete = document.querySelector('.confirm-body-button-delete');
const btnCancel = document.querySelector('.confirm-body-button-cancel');
const current = {
    happiness: 0.9,
    derp: 1,
    px: 0.5,
    py: 0.5
};
const target = { ...current };
let rejectCount = 0;

// 事件监听
confirmSection.addEventListener('mousemove', onMouseMove);
confirmSection.addEventListener('mouseleave', onMouseLeave);

btnCancel.addEventListener('click', () => {
    confirmSection.classList.add('hidden');
    acceptedSection.classList.remove('hidden');
    target.happiness = 1; // 开心到起飞
    updateBoi();
});

btnDelete.addEventListener('click', () => {
    rejectCount++;
    if (rejectCount >= 10) {
        btnDelete.style.position = 'absolute';
        btnDelete.style.left = `${Math.random() * 80}%`;
        btnDelete.style.top = `${Math.random() * 80}%`;

        // 展示拒绝界面
        confirmSection.classList.add('hidden');
        rejectedSection.classList.remove('hidden');
    }
    target.happiness = Math.max(0.1, target.happiness - 0.1); // 每次点击拒绝，表情更委屈
    btnCancel.style.transform = `scale(${1 + rejectCount * 0.1})`; // 接受按钮变大
    updateBoi();
});

acceptedSection.querySelector('a').addEventListener('click', () => {
    acceptedSection.classList.add('hidden');
    confirmSection.classList.remove('hidden');
    resetBoi();
});

rejectedSection.querySelector('a').addEventListener('click', () => {
    rejectedSection.classList.add('hidden');
    confirmSection.classList.remove('hidden');
    resetBoi();
});

function onMouseMove({ clientX: x, clientY: y }) {
    let dx1 = x - btnDelete.getBoundingClientRect().x - btnDelete.getBoundingClientRect().width * 0.5;
    let dy1 = y - btnDelete.getBoundingClientRect().y - btnDelete.getBoundingClientRect().height * 0.5;
    let dx2 = x - btnCancel.getBoundingClientRect().x - btnCancel.getBoundingClientRect().width * 0.5;
    let dy2 = y - btnCancel.getBoundingClientRect().y - btnCancel.getBoundingClientRect().height * 0.5;
    let px = (x - confirmSection.getBoundingClientRect().x) / confirmSection.getBoundingClientRect().width;
    let py = (y - confirmSection.getBoundingClientRect().y) / confirmSection.getBoundingClientRect().height;
    let distDelete = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    let distCancel = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    let happiness = Math.pow(distDelete / (distCancel + distDelete), 0.75);

    target.happiness = happiness;
    target.derp = 0;
    target.px = px;
    target.py = py;
}

function onMouseLeave() {
    target.happiness = 0.9;
    target.derp = 1;
    target.px = 0.5;
    target.py = 0.5;
}

function updateBoi() {
    for (let prop in target) {
        if (target[prop] === current[prop]) {
            continue;
        } else if (Math.abs(target[prop] - current[prop]) < 0.01) {
            current[prop] = target[prop];
        } else {
            current[prop] += (target[prop] - current[prop]) * 0.1;
        }
        boi.style.setProperty(`--${prop}`, current[prop]);
    }
    requestAnimationFrame(updateBoi);
}

function resetBoi() {
    target.happiness = 0.9;
    target.derp = 1;
    target.px = 0.5;
    target.py = 0.5;
    rejectCount = 0;
    btnCancel.style.transform = 'scale(1)';
    btnDelete.style.position = 'static';
}

updateBoi();
