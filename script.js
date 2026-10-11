const arrayContainer = document.getElementById('array-container');
const arrayValuesText = document.getElementById('array-values-text');
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const algorithmSelect = document.getElementById('algorithm-select');
const speedSlider = document.getElementById('speed-slider');
const statusMessage = document.getElementById('status-message');
const customInput = document.getElementById('custom-input');
const setArrayBtn = document.getElementById('set-array-btn');

let array = [];
const defaultSize = 15;
let stopRequested = false;

// අහඹු අංක මාලාවක් සෑදීම
function generateArray() {
    stopRequested = false;
    statusMessage.style.opacity = '0';
    array = [];
    for (let i = 0; i < defaultSize; i++) {
        array.push(Math.floor(Math.random() * 80) + 15);
    }
    renderArray();
}

// Custom Array සැකසීම
setArrayBtn.addEventListener('click', () => {
    let inputText = customInput.value.trim();
    if (!inputText) {
        alert("කරුණාකර අංක කිහිපයක් ඇතුළත් කරන්න!");
        return;
    }

    let rawArray = inputText.split(',').map(num => parseInt(num.trim()));

    if (rawArray.some(isNaN)) {
        alert("කරුණාකර වලංගු අංක පමණක් Comma (,) මඟින් වෙන් කර ඇතුළත් කරන්න!");
        return;
    }

    if (rawArray.length > 25) {
        alert("කරුණාකර අංක 25කට වඩා අඩු ප්‍රමාණයක් ඇතුළත් කරන්න.");
        return;
    }

    stopRequested = true;
    statusMessage.style.opacity = '0';
    array = rawArray;
    renderArray();
    customInput.value = '';
});

// UI එකට Bars සහ Text අංක ඇතුළත් කිරීම
function renderArray() {
    arrayContainer.innerHTML = '';
    arrayValuesText.textContent = `[ ${array.join(', ')} ]`;

    array.forEach((value) => {
        const bar = document.createElement('div');
        bar.style.height = `${value * 3}px`;
        bar.className = 'bar';
        bar.innerText = value;
        arrayContainer.appendChild(bar);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 1. Bubble Sort
async function bubbleSort() {
    let bars = arrayContainer.children;
    let delay = 510 - speedSlider.value;

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (stopRequested) return;
            
            bars[j].style.backgroundColor = '#fbbf24'; 
            bars[j + 1].style.backgroundColor = '#fbbf24';

            await sleep(delay);

            if (array[j] > array[j + 1]) {
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;

                bars[j].style.height = `${array[j] * 3}px`;
                bars[j].innerText = array[j];
                
                bars[j + 1].style.height = `${array[j + 1] * 3}px`;
                bars[j + 1].innerText = array[j + 1];

                arrayValuesText.textContent = `[ ${array.join(', ')} ]`;
            }

            bars[j].style.backgroundColor = '#6366f1';
            bars[j + 1].style.backgroundColor = '#6366f1';
        }
        bars[array.length - i - 1].style.backgroundColor = '#10b981';
    }
}

// 2. Selection Sort
async function selectionSort() {
    let bars = arrayContainer.children;
    let delay = 510 - speedSlider.value;

    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        bars[minIndex].style.backgroundColor = '#ec4899';

        for (let j = i + 1; j < array.length; j++) {
            if (stopRequested) return;

            bars[j].style.backgroundColor = '#fbbf24';
            await sleep(delay);

            if (array[j] < array[minIndex]) {
                if (minIndex !== i) bars[minIndex].style.backgroundColor = '#6366f1';
                minIndex = j;
                bars[minIndex].style.backgroundColor = '#ec4899';
            } else {
                bars[j].style.backgroundColor = '#6366f1';
            }
        }

        if (minIndex !== i) {
            let temp = array[i];
            array[i] = array[minIndex];
            array[minIndex] = temp;

            bars[i].style.height = `${array[i] * 3}px`;
            bars[i].innerText = array[i];
            bars[minIndex].style.height = `${array[minIndex] * 3}px`;
            bars[minIndex].innerText = array[minIndex];
            arrayValuesText.textContent = `[ ${array.join(', ')} ]`;
        }

        bars[minIndex].style.backgroundColor = '#6366f1';
        bars[i].style.backgroundColor = '#10b981';
    }
}

// 3. Insertion Sort
async function insertionSort() {
    let bars = arrayContainer.children;
    let delay = 510 - speedSlider.value;

    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        bars[i].style.backgroundColor = '#fbbf24';
        await sleep(delay);

        while (j >= 0 && array[j] > key) {
            if (stopRequested) return;

            array[j + 1] = array[j];
            bars[j + 1].style.height = `${array[j + 1] * 3}px`;
            bars[j + 1].innerText = array[j + 1];
            
            j--;
            arrayValuesText.textContent = `[ ${array.join(', ')} ]`;
            await sleep(delay);
        }

        array[j + 1] = key;
        bars[j + 1].style.height = `${key * 3}px`;
        bars[j + 1].innerText = key;
        arrayValuesText.textContent = `[ ${array.join(', ')} ]`;

        for (let k = 0; k <= i; k++) {
            bars[k].style.backgroundColor = '#10b981';
        }
    }
}

// 4. Merge Sort
async function mergeSort() {
    let delay = 510 - speedSlider.value;
    await mSort(0, array.length - 1, delay);
}

async function mSort(l, r, delay) {
    if (l >= r || stopRequested) return;
    let m = Math.floor(l + (r - l) / 2);
    await mSort(l, m, delay);
    await mSort(m + 1, r, delay);
    await merge(l, m, r, delay);
}

async function merge(l, m, r, delay) {
    let bars = arrayContainer.children;
    let leftArr = array.slice(l, m + 1);
    let rightArr = array.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < leftArr.length && j < rightArr.length) {
        if (stopRequested) return;
        bars[k].style.backgroundColor = '#fbbf24';
        await sleep(delay);

        if (leftArr[i] <= rightArr[j]) {
            array[k] = leftArr[i];
            i++;
        } else {
            array[k] = rightArr[j];
            j++;
        }
        bars[k].style.height = `${array[k] * 3}px`;
        bars[k].innerText = array[k];
        arrayValuesText.textContent = `[ ${array.join(', ')} ]`;
        bars[k].style.backgroundColor = '#10b981';
        k++;
    }

    while (i < leftArr.length) {
        if (stopRequested) return;
        array[k] = leftArr[i];
        bars[k].style.height = `${array[k] * 3}px`;
        bars[k].innerText = array[k];
        arrayValuesText.textContent = `[ ${array.join(', ')} ]`;
        bars[k].style.backgroundColor = '#10b981';
        i++; k++;
        await sleep(delay);
    }

    while (j < rightArr.length) {
        if (stopRequested) return;
        array[k] = rightArr[j];
        bars[k].style.height = `${array[k] * 3}px`;
        bars[k].innerText = array[k];
        arrayValuesText.textContent = `[ ${array.join(', ')} ]`;
        bars[k].style.backgroundColor = '#10b981';
        j++; k++;
        await sleep(delay);
    }
}

// 5. Shell Sort
async function shellSort() {
    let bars = arrayContainer.children;
    let delay = 510 - speedSlider.value;
    let n = array.length;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = array[i];
            let j;

            bars[i].style.backgroundColor = '#fbbf24';
            await sleep(delay);

            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                if (stopRequested) return;
                array[j] = array[j - gap];
                bars[j].style.height = `${array[j] * 3}px`;
                bars[j].innerText = array[j];
                arrayValuesText.textContent = `[ ${array.join(', ')} ]`;
                await sleep(delay);
            }

            array[j] = temp;
            bars[j].style.height = `${temp * 3}px`;
            bars[j].innerText = temp;
            arrayValuesText.textContent = `[ ${array.join(', ')} ]`;
            bars[i].style.backgroundColor = '#6366f1';
        }
    }

    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = '#10b981';
    }
}

// Event Listeners
window.onload = generateArray;
generateBtn.addEventListener('click', generateArray);

stopBtn.addEventListener('click', () => {
    stopRequested = true;
    generateBtn.disabled = false;
    setArrayBtn.disabled = false;
    startBtn.disabled = false;
    algorithmSelect.disabled = false;
    stopBtn.disabled = true;
});

startBtn.addEventListener('click', async () => {
    stopRequested = false;
    generateBtn.disabled = true;
    setArrayBtn.disabled = true;
    startBtn.disabled = true;
    algorithmSelect.disabled = true;
    stopBtn.disabled = false;
    statusMessage.style.opacity = '0';

    const selectedAlgo = algorithmSelect.value;
    if (selectedAlgo === 'bubble') await bubbleSort();
    else if (selectedAlgo === 'selection') await selectionSort();
    else if (selectedAlgo === 'insertion') await insertionSort();
    else if (selectedAlgo === 'merge') await mergeSort();
    else if (selectedAlgo === 'shell') await shellSort();

    if (!stopRequested) {
        let bars = arrayContainer.children;
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.backgroundColor = '#10b981';
        }
        statusMessage.style.opacity = '1';
    }

    generateBtn.disabled = false;
    setArrayBtn.disabled = false;
    startBtn.disabled = false;
    algorithmSelect.disabled = false;
    stopBtn.disabled = true;
});