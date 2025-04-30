'use strict'
const trigGraph = document.getElementById('trigGraph');
let myChart;

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function calculateTrigFunction(angleDegrees, func) {
    const angleRadians = toRadians(angleDegrees);
    switch (func) {
        case 'csc':
            const sinValue = Math.sin(angleRadians);
            return sinValue === 0 ? Infinity : 1 / sinValue;
        case 'sec':
            const cosValue = Math.cos(angleRadians);
            return cosValue === 0 ? Infinity : 1 / cosValue;
        case 'cot':
            const tanValue = Math.tan(angleRadians);
            return tanValue === 0 ? Infinity : 1 / tanValue;
        default:
            return NaN;
    }
}

function calculate() {
    const angleInput = document.getElementById('angle');
    const functionSelect = document.getElementById('function');
    const resultDiv = document.getElementById('result');
    const angle = parseFloat(angleInput.value);
    const func = functionSelect.value;

    if (isNaN(angle)) {
        resultDiv.textContent = 'Por favor, digite um ângulo válido.';
        return;
    }

    const result = calculateTrigFunction(angle, func);

    if (isNaN(result)) {
        resultDiv.textContent = 'Função inválida.';
    } else if (Math.abs(result) === Infinity) {
        resultDiv.textContent = `${func}(${angle}°) é indefinido.`;
    } else {
        resultDiv.textContent = `${func}(${angle}°) ≈ ${result.toFixed(4)}`;
    }
}

function generateGraphData(func) {
    const dataPoints = [];
    const step = Math.PI / 180; // Step de 1 grau em radianos

    for (let i = -2 * Math.PI; i <= 2 * Math.PI; i += step) {
        let yValue;
        switch (func) {
            case 'csc':
                const sinValue = Math.sin(i);
                yValue = Math.abs(sinValue) < 1e-10 ? NaN : 1 / sinValue;
                break;
            case 'sec':
                const cosValue = Math.cos(i);
                yValue = Math.abs(cosValue) < 1e-10 ? NaN : 1 / cosValue;
                break;
            case 'cot':
                const tanValue = Math.tan(i);
                yValue = Math.abs(tanValue) < 1e-10 ? NaN : 1 / tanValue;
                break;
            default:
                yValue = NaN;
        }
        dataPoints.push({ x: i, y: yValue });
    }
    return dataPoints;
}

function updateGraph() {
    const selectedFunctions = Array.from(document.querySelectorAll('#functionSelector input:checked'))
        .map(input => input.value);

    const datasets = selectedFunctions.map(func => {
        const graphData = generateGraphData(func);
        const color = getColorForFunction(func);
        return {
            label: `${func}(x)`,
            data: graphData,
            borderColor: color,
            tension: 0.4, // Curvatura suave da linha
            pointRadius: 0,
            borderWidth: 2
        };
    });

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(trigGraph, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Ângulo (radianos)'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            if (value === 0) return '0';
                            const multiplesOfPi = [-2, -3/2, -1, -1/2, 1/2, 1, 3/2, 2];
                            for (const multiple of multiplesOfPi) {
                                if (Math.abs(value - multiple * Math.PI) < 0.1) {
                                    return `${multiple}π`;
                                }
                            }
                            return '';
                        }
                    },
                    min: -2 * Math.PI,
                    max: 2 * Math.PI
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Valor da Função'
                    },
                    // Não limitar o eixo Y para mostrar as assíntotas corretamente
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

function getColorForFunction(func) {
    const colors = {
        csc: '#dc3545', // Vermelho
        sec: '#198754', // Verde
        cot: '#0d6efd'  // Azul
    };
    return colors[func] || 'black';
}

document.querySelectorAll('#functionSelector input').forEach(input => {
    input.addEventListener('change', updateGraph);
});

// Inicializar o gráfico com todas as funções por padrão
updateGraph();