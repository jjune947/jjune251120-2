// Helper function to apply styles
const applyStyles = (element, styles) => {
    for (const key in styles) {
        element.style[key] = styles[key];
    }
};

// Main App Container
const root = document.getElementById('root');

// --- STYLES ---
const bodyStyles = {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    margin: '0',
    backgroundColor: 'transparent', // Make body transparent to see canvas
};

const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '400px',
    margin: 'auto',
    position: 'relative',
    zIndex: '1'
};

const resultContainerStyles = { ...containerStyles, maxWidth: '500px' };

const h1Styles = {
    color: '#333',
    marginBottom: '24px'
};

const resultH1Styles = { ...h1Styles, fontSize: '2.5em', marginBottom: '10px' };

const inputStyles = {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '16px'
};

const buttonStyles = {
    width: '100%',
    padding: '12px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.2s'
};

const backButtonStyles = {
    display: 'inline-block',
    marginTop: '25px',
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'background-color 0.2s'
};

const errorStyles = {
    color: 'red',
    height: '20px'
};

const resultPStyles = {
    fontSize: '1.1em',
    lineHeight: '1.6',
    color: '#333',
    textAlign: 'left'
};

// --- ANIMATED BACKGROUND ---
function initAnimatedBackground() {
    const canvas = document.createElement('canvas');
    applyStyles(canvas, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '-1',
        backgroundColor: '#f0f2f5' // Add a solid background color
    });
    document.body.insertBefore(canvas, root);
    const ctx = canvas.getContext('2d');
    
    let width, height;
    const hearts = [];
    const heartCount = 50;

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };

    function drawHeart(x, y, size, alpha) {
        ctx.fillStyle = `rgba(255, 105, 180, ${alpha})`; // Pink with opacity
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(
            x, y,
            x - size / 2, y,
            x - size / 2, y + topCurveHeight
        );
        // bottom left curve
        ctx.bezierCurveTo(
            x - size / 2, y + (size + topCurveHeight) / 2,
            x, y + (size + topCurveHeight) / 2,
            x, y + size
        );
        // bottom right curve
        ctx.bezierCurveTo(
            x, y + (size + topCurveHeight) / 2,
            x + size / 2, y + (size + topCurveHeight) / 2,
            x + size / 2, y + topCurveHeight
        );
        // top right curve
        ctx.bezierCurveTo(
            x + size / 2, y,
            x, y,
            x, y + topCurveHeight
        );
        ctx.closePath();
        ctx.fill();
    }

    class Heart {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height + height;
            this.size = Math.random() * 20 + 10;
            this.speed = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.y -= this.speed;
            if (this.y < -this.size) {
                this.reset();
                this.y = height + this.size;
            }
        }

        draw() {
            drawHeart(this.x, this.y, this.size, this.alpha);
        }
    }

    const createHearts = () => {
        hearts.length = 0; // Clear existing hearts
        for (let i = 0; i < heartCount; i++) {
            hearts.push(new Heart());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        for (const heart of hearts) {
            heart.update();
            heart.draw();
        }
        requestAnimationFrame(animate);
    };
    
    window.addEventListener('resize', () => {
        resize();
        createHearts();
    });

    resize();
    createHearts();
    animate();
}


// --- RENDER FUNCTIONS ---

function renderHomePage() {
    root.innerHTML = ''; // Clear previous content
    const container = document.createElement('div');
    applyStyles(container, containerStyles);

    const h1 = document.createElement('h1');
    h1.textContent = '당신의 MBTI를 알려주세요!';
    applyStyles(h1, h1Styles);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'mbtiInput';
    input.placeholder = '예: INFP';
    input.maxLength = 4;
    applyStyles(input, inputStyles);

    const button = document.createElement('button');
    button.textContent = '입력';
    applyStyles(button, buttonStyles);
    button.onclick = showResult;
    button.onmouseover = () => button.style.backgroundColor = '#0056b3';
    button.onmouseout = () => button.style.backgroundColor = '#007bff';

    const errorMessage = document.createElement('p');
    errorMessage.id = 'error-message';
    applyStyles(errorMessage, errorStyles);

    input.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            showResult();
        }
    });

    container.append(h1, input, button, errorMessage);
    root.appendChild(container);
}

function renderResultPage() {
    root.innerHTML = ''; // Clear previous content
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const mbti = (params.get('mbti') || 'DEFAULT').toUpperCase();
    const result = mbtiData[mbti] || mbtiData['DEFAULT'];

    const container = document.createElement('div');
    applyStyles(container, resultContainerStyles);
    // Use the result color for the container background for a nice effect
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';


    const h1 = document.createElement('h1');
    h1.textContent = '멋지네요!';
    applyStyles(h1, resultH1Styles);

    const p = document.createElement('p');
    p.textContent = result.description;
    applyStyles(p, resultPStyles);

    const backButton = document.createElement('a');
    backButton.textContent = '돌아가기';
    backButton.href = '#/';
    applyStyles(backButton, backButtonStyles);
    backButton.onmouseover = () => backButton.style.backgroundColor = '#0056b3';
    backButton.onmouseout = () => backButton.style.backgroundColor = '#007bff';

    container.append(h1, p, backButton);
    root.appendChild(container);
}

// --- LOGIC & ROUTER ---

function showResult() {
    const mbtiInput = document.getElementById('mbtiInput');
    const errorMessage = document.getElementById('error-message');
    const mbtiValue = mbtiInput.value.trim();

    if (mbtiValue) {
        window.location.hash = `/result?mbti=${mbtiValue}`;
    } else {
        errorMessage.textContent = 'MBTI를 입력해주세요!';
    }
}

const routes = {
    '/': renderHomePage,
    '/result': renderResultPage
};

function router() {
    const path = window.location.hash.split('?')[0] || '/';
    const renderFunction = routes[path] || routes['/'];
    renderFunction();
}

// --- INITIALIZATION ---

// Listen for hash changes
window.addEventListener('hashchange', router);
// Load initial route
window.addEventListener('load', () => {
    applyStyles(document.body, bodyStyles);
    initAnimatedBackground();

    // Set initial hash if none
    if (!window.location.hash) {
        window.location.hash = '/';
    }
    // Render initial page
    router();
});
