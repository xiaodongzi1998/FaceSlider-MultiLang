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
