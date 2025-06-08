(function() {
    const currentScript = document.currentScript;
    const scriptSrc = currentScript.src;
    
    const url = new URL(scriptSrc);
    const widgetId = url.searchParams.get('id');
    
    if (!widgetId) {
        console.error('Widget ID not provided');
        return;
    }

    const styles = document.createElement('style');
    styles.textContent = `
        .askme-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            width: 60px;
            height: 60px;
        }
        
        .askme-widget-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgb(18.5714285714, 76.1428571429, 202.4285714286) 0%, #2563eb 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }

        .askme-widget-button:hover {
            transform: scale(1.05);
        }

        .askme-widget-icon {
            width: 50px;
            height: 50px;
            fill: white;
        }

        .askme-widget-iframe {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 400px;
            height: 600px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: none;
            display: none;
            z-index: 999999;
            background: white;
        }

        .askme-widget-loader {
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 400px;
            height: 600px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: none;
            z-index: 999999;
            background: white;
            align-items: center;
            justify-content: center;
        }

        .askme-widget-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styles);

    const container = document.createElement('div');
    container.className = 'askme-widget-container';

    const button = document.createElement('button');
    button.className = 'askme-widget-button';
    button.innerHTML = `
        <svg class="askme-widget-icon"  width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="24" height="24" rx="8" stroke="#2563eb" stroke-width="2"/>
            <circle cx="16" cy="20" r="2" fill="#2563eb"/>
            <circle cx="24" cy="20" r="2" fill="#2563eb"/>
            <line x1="20" y1="4" x2="20" y2="8" stroke="#2563eb" stroke-width="2"/>
            <circle cx="20" cy="4" r="2" fill="#2563eb"/>
        </svg> 
    `;

    const loader = document.createElement('div');
    loader.className = 'askme-widget-loader';
    loader.innerHTML = '<div class="askme-widget-spinner"></div>';

    const iframe = document.createElement('iframe');
    iframe.className = 'askme-widget-iframe';
    iframe.src = `${url.origin}/chat?botId=${widgetId}&embedded=true`;

    let isOpen = false;
    let isWidgetLoaded = false;
    button.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            if (isWidgetLoaded) {
                loader.style.display = 'flex';
                iframe.style.display = 'none';
            } else {
                loader.style.display = 'none';
                iframe.style.display = 'block';
            }
        } else {
            loader.style.display = 'none';
            iframe.style.display = 'none';
        }
    });

    iframe.addEventListener('load', () => {
        if (isOpen) {
            loader.style.display = 'none';
            iframe.style.display = 'block';
        }

    });

    container.appendChild(button);
    container.appendChild(loader);
    container.appendChild(iframe);
    document.body.appendChild(container);
})(); 