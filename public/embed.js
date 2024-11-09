// Constants and Configuration
const CONFIG = {
    IFRAME: {
        id: 'chatWidgetIframe',
        defaultWidth: '500px',
        smallWidth: '300px',
        maxDesktopWidth: '80vw',
        maxDesktopHeight: '800px',
        smallMaxHeight: '480px',
        borderRadius: {
            default: '25px',
            small: '12px'
        }
    },
    BUTTON: {
        id: 'chatWidgetButton',
        defaultSize: '4rem',
        smallSize: '3.2rem',
        defaultPadding: '0.25rem',
        smallPadding: '0.2rem',
        hoverRotation: 'rotate(15deg)',
        transitionDuration: '150ms',
        defaultColor: '#FFFFFF'
    },
    WELCOME_MESSAGE: {
        id: 'chatWidgetWelcomeMessage',
        closeButtonId: 'chatWidgetWelcomeMessageClose',
        defaultWidth: '300px',
        smallWidth: '225px',
        defaultDelay: 500,
        typeDelay: 20,
        defaultEmbedPingMessage: '👋 Hey... ask questions here!',
        animations: {
            enterDuration: 150,
            exitDuration: 150,
            closeButton: {
                color: '#6B7280',
                hoverColor: '#F3F4F6'
            }
        }
    },
    POSITION: {
        defaultOffset: {
            right: 0,
            left: 0,
            bottom: 0
        },
        defaultPosition: 'bottom-right'
    },
    ANIMATION: {
        duration: 100,
        defaultDelay: 500
    }
};

class ChatWidget {
    constructor(options) {
        this.options = {
            botId: options.botId,
            baseUrl: options.baseUrl || 'http://localhost:3000',
            parentId: options.parentId || null,
            smallMode: options.smallMode || false,
            embedPage: options.embedPage || false,
        };

        this.elements = {
            iframe: null,
            button: null,
            welcomeMessage: null
        };

        this.state = {
            openCount: 0,
            isMobile: window.matchMedia('(max-width: 475px)').matches
        };
    }

    async init() {
        try {
            const botData = await this.fetchBotData();
            this.createElements(botData);
            this.setupEventListeners();
            this.handleInitialDisplay(botData);
        } catch (error) {
            console.error('Failed to initialize chat widget:', error);
        }
    }

    async fetchBotData() {
        const response = await fetch(`${this.options.baseUrl}/api/bots/${this.options.botId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error('Failed to fetch bot data');
        return response.json();
    }

    createElements(botData) {
        this.createIframe(botData);
        this.createButton(botData);
        this.createWelcomeMessage(botData);
    }

    createIframe(botData) {
        const iframe = document.createElement('iframe');
        iframe.id = CONFIG.IFRAME.id;
        iframe.src = `${this.options.baseUrl}/chats/${this.options.botId}?embed=true`;

        const styles = this.calculateIframeStyles(botData);
        Object.assign(iframe.style, styles);

        this.elements.iframe = iframe;
        this.appendToParent(iframe);
    }

    calculateIframeStyles(botData) {
        const baseStyles = {
            display: 'none',
            opacity: '0',
            position: this.options.parentId ? 'absolute' : 'fixed',
            border: 'none',
            zIndex: this.options.embedPage ? '1' : '2147483647',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px rgba(150, 150, 150, 0.2)'
        };

        if (this.state.isMobile) {
            return {
                ...baseStyles,
                width: '100dvw',
                height: this.options.smallMode ? '60dvh' : '100dvh',
                bottom: '0',
                top: 'auto',
                right: '0',
                left: '0',
                maxWidth: '100%',
                borderRadius: '0'
            };
        }

        return {
            ...baseStyles,
            width: this.options.smallMode ? `calc(${CONFIG.IFRAME.defaultWidth} * 0.6)` : CONFIG.IFRAME.defaultWidth,
            maxWidth: this.options.smallMode ? '48vw' : CONFIG.IFRAME.maxDesktopWidth,
            height: this.options.smallMode ? '48vh' : '80vh',
            maxHeight: this.options.smallMode ? CONFIG.IFRAME.smallMaxHeight : CONFIG.IFRAME.maxDesktopHeight,
            borderRadius: this.options.smallMode ? CONFIG.IFRAME.borderRadius.small : CONFIG.IFRAME.borderRadius.default,
            ...(this.calculateIframePosition(botData))
        };
    }

    calculateIframePosition(botData) {
        const buttonSize = botData.configurations?.embedWidgetSize || 1;
        const position = {};

        position.bottom = this.options.smallMode
            ? `${buttonSize * 3.6}rem`
            : `${buttonSize * (CONFIG.POSITION.defaultOffset.bottom || 6)}rem`;

        if ((botData.configurations?.embedAngle || CONFIG.POSITION.defaultPosition) === 'bottom-right') {
            position.right = `${CONFIG.POSITION.defaultOffset.right + 2.5 || 2.5}rem`;
        } else if ((botData.configurations?.embedAngle || CONFIG.POSITION.defaultPosition) === 'bottom-left') {
            position.left = `${CONFIG.POSITION.defaultOffset.left + 2.5 || 2.5}rem`;
        }

        return position;
    }

    createButton(botData) {
        const button = document.createElement('button');
        button.id = CONFIG.BUTTON.id;

        const styles = this.calculateButtonStyles(botData);
        Object.assign(button.style, styles);

        const buttonIcon = this.createButtonIcon(botData.configurations?.embedWidgetIconURL);
        button.appendChild(buttonIcon);

        // Add hover effects
        this.addButtonHoverEffects(button, buttonIcon);

        this.elements.button = button;
        this.appendToParent(button);
    }
    addButtonHoverEffects(button, buttonIcon) {
        button.addEventListener('mouseenter', () => {
            buttonIcon.style.transform = CONFIG.BUTTON.hoverRotation;
            buttonIcon.style.transition = `transform ${CONFIG.BUTTON.transitionDuration} ease-in`;
            button.style.transition = `transform ${CONFIG.BUTTON.transitionDuration} ease-in`;
        });

        button.addEventListener('mouseleave', () => {
            buttonIcon.style.transform = 'rotate(0deg)';
            buttonIcon.style.transition = `transform ${CONFIG.BUTTON.transitionDuration} ease-out`;
            button.style.transition = `transform ${CONFIG.BUTTON.transitionDuration} ease-out`;
        });
    }

    calculateButtonStyles(botData) {
        const buttonSize = botData.configurations?.embedWidgetSize || 1;

        const baseStyles = {
            display: 'none',
            opacity: '0',
            position: this.options.parentId ? 'absolute' : 'fixed',
            outline: 'none',
            zIndex: this.options.embedPage ? '1' : '2147483647',
            fontSize: '0',
            textContent: '',
            cursor: 'pointer',
            transformOrigin: 'bottom right',
            scale: buttonSize,
            alignItems: 'center',
            boxSizing: 'border-box',
            justifyContent: 'center',
            overflow: "hidden",
            color: '#FFFFFF',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            transitionDuration: '150ms',
            ...this.calculateButtonPosition(botData),
            ...this.calculateButtonDimensions()
        };

        return baseStyles;
    }
    calculateButtonPosition(botData) {
        const buttonSize = botData.configurations?.embedWidgetSize || 1;
        const position = {
            left: 'auto',
            right: 'auto',
            bottom: `${buttonSize * (CONFIG.POSITION.defaultOffset.bottom || 1.25)}rem`
        };

        if (((botData.configurations?.embedAngle || CONFIG.POSITION.defaultPosition) || CONFIG.POSITION.defaultPosition) === 'bottom-right') {
            position.right = `${CONFIG.POSITION.defaultOffset.right + 1.25 || 1.25}rem`;
        } else if ((botData.configurations?.embedAngle || CONFIG.POSITION.defaultPosition) === 'bottom-left') {
            position.left = `${CONFIG.POSITION.defaultOffset.left + 1.25 || 1.25}rem`;
        }

        return position;
    }

    calculateButtonDimensions() {
        return {
            height: this.options.smallMode ? CONFIG.BUTTON.smallSize : CONFIG.BUTTON.defaultSize,
            width: this.options.smallMode ? CONFIG.BUTTON.smallSize : CONFIG.BUTTON.defaultSize,
            padding: this.options.smallMode ? CONFIG.BUTTON.smallPadding : CONFIG.BUTTON.defaultPadding
        };
    }

    createButtonIcon(iconUrl) {
        const img = document.createElement('img');
        img.src = iconUrl || `${this.options.baseUrl}/images/chat-icon.png`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.transition = 'transform 150ms ease';
        return img;
    }
    calculateWelcomeMessageStyles(botData) {
        const baseStyles = {
            position: this.options.parentId ? 'absolute' : 'fixed',
            fontFamily: this.getFontFamily(botData.configurations?.fontId),
            display: 'none',
            opacity: '0',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            overflowY: 'hidden',
            zIndex: this.options.embedPage ? '1' : '2147483647',
            transitionDuration: '150ms',
            ...this.calculateWelcomeMessageDimensions(),
            ...this.calculateWelcomeMessagePosition(botData),
            ...this.calculateWelcomeMessageDecorations()
        };

        return baseStyles;
    }

    calculateWelcomeMessageDimensions() {
        return {
            width: this.options.smallMode ? CONFIG.WELCOME_MESSAGE.smallWidth : CONFIG.WELCOME_MESSAGE.defaultWidth,
            maxWidth: 'fit-content',
            padding: this.options.smallMode ? '0.7rem' : '1rem',
            paddingRight: this.options.smallMode ? '1.5rem' : '2rem',
            fontSize: this.options.smallMode ? '0.75rem' : '1rem',
            lineHeight: this.options.smallMode ? '1.2' : '1.5'
        };
    }

    calculateWelcomeMessagePosition(botData) {
        const buttonSize = botData.configurations?.embedWidgetSize || 1;
        const position = {
            left: 'auto',
            right: 'auto',
            bottom: `${buttonSize * (CONFIG.POSITION.defaultOffset.bottom || 4)}rem`
        };

        if ((botData.configurations?.embedAngle || CONFIG.POSITION.defaultPosition) === 'bottom-right') {
            position.right = this.options.smallMode
                ? `${CONFIG.POSITION.defaultOffset.right + 3.75 || 3.75}rem`
                : `${CONFIG.POSITION.defaultOffset.right + 5 || 5}rem`;
        } else if ((botData.configurations?.embedAngle || CONFIG.POSITION.defaultPosition) === 'bottom-left') {
            position.left = this.options.smallMode
                ? `${CONFIG.POSITION.defaultOffset.left + 3.75 || 3.75}rem`
                : `${CONFIG.POSITION.defaultOffset.left + 5 || 5}rem`;
        }

        return position;
    }

    calculateWelcomeMessageDecorations() {
        return {
            borderRadius: this.options.smallMode ? '12px' : '15px',
            boxShadow: this.options.smallMode
                ? '0 8px 12px -2px rgba(0, 0, 0, 0.1), 0px 0px 0px 0.7px rgba(150, 150, 150, 0.2)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px rgba(150, 150, 150, 0.2)'
        };
    }

    createWelcomeMessage(botData) {
        const container = document.createElement('div');
        container.id = CONFIG.WELCOME_MESSAGE.id;

        const styles = this.calculateWelcomeMessageStyles(botData);
        Object.assign(container.style, styles);

        const message = document.createElement('div');
        this.typeMessage(message, botData.configurations?.embedPingMessage || CONFIG.WELCOME_MESSAGE.defaultEmbedPingMessage);

        container.appendChild(message);
        
        this.elements.welcomeMessage = container;
        this.appendToParent(container);

        container.appendChild(this.createCloseButton(this.elements.welcomeMessage));
    }
    createCloseButton(element, position = "bottom", fadeInElements= [], thenFadeMeOut= false) {
        const closeButton = document.createElement('button');
        closeButton.id = CONFIG.WELCOME_MESSAGE.closeButtonId;

        const closeButtonStyles = {
            position: 'absolute',
            right: this.options.smallMode ? '0.1rem' : '0.25rem',
            padding: this.options.smallMode ? '0.15rem' : '0.25rem',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            color: CONFIG.WELCOME_MESSAGE.animations.closeButton.color,
            transition: 'all 0.2s ease',
            zIndex: this.options.embedPage ? '1' : '2147483647'
        };
        let newPosition = {};
        if (position == "top") {
            newPosition = {
                top: this.options.smallMode ? '40.5dvh' : '0.25rem'
            }
        } else {
            newPosition = { 
                bottom: this.options.smallMode ? '1rem' : '1.4rem'
            }
        }
        newPosition = {
            ...newPosition,
            ...closeButtonStyles
        }
        Object.assign(closeButton.style, newPosition);

        // Add hover effects
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.backgroundColor = CONFIG.WELCOME_MESSAGE.animations.closeButton.hoverColor;
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.backgroundColor = 'transparent';
        });

        // Add click handler
        closeButton.onclick = (e) => {
            e.stopPropagation();
            this.fadeOut(element);
            fadeInElements.forEach((el) => {
                this.fadeIn(el)
            })
            if(thenFadeMeOut) {
                this.fadeOut(closeButton)
            }
        };

        // Add close icon
        closeButton.innerHTML = this.getCloseButtonSVG();

        return closeButton;
    }

    getCloseButtonSVG() {
        const size = this.options.smallMode ? 16 : 24;
        const strokeWidth = this.options.smallMode ? 1.5 : 2;

        return `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="${size}"
            height="${size}"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="${strokeWidth}"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        `;
    }

    getFontFamily(fontId) {
        // Map of font IDs to font families - extend as needed
        const fontMap = {
            '14': 'Inter, system-ui, sans-serif',
            // Add more font mappings as needed
        };
        return fontMap[fontId] || 'system-ui, sans-serif';
    }

    setupEventListeners() {
        // Window message listener for iframe close events
        window.addEventListener('message', (event) => {
            if (event.data === 'closeme') {
                this.fadeOut(this.elements.iframe);
                if (this.state.isMobile) {
                    this.fadeIn(this.elements.button);
                }
            }
        });

        // Button click handler
        this.elements.button.onclick = () => {
            if (this.elements.iframe.style.opacity === '1') {
                this.fadeOut(this.elements.iframe);
            } else {
                this.fadeIn(this.elements.iframe);
                this.fadeOut(this.elements.welcomeMessage);
                if (this.state.isMobile) {
                    this.fadeOut(this.elements.button);
                    this.appendToParent(this.createCloseButton(this.elements.iframe, "top", [this.elements.button], true));
                }
            }
        };

        // Welcome message click handler
        this.elements.welcomeMessage.onclick = () => {
            this.fadeIn(this.elements.iframe);
            this.fadeOut(this.elements.welcomeMessage);
            if (this.state.isMobile) {
                this.fadeOut(this.elements.button);
                this.appendToParent(this.createCloseButton(this.elements.iframe, "top", [this.elements.button], true));
            }
        };
    }

    handleInitialDisplay(botData) {
        // Initial display sequence
        this.fadeIn(this.elements.button, CONFIG.ANIMATION.defaultDelay, 0);
        this.fadeIn(this.elements.welcomeMessage, CONFIG.ANIMATION.defaultDelay, 0);
        if (botData.configurations?.embedAutoOpen) {
            this.fadeIn(
                this.elements.iframe,
                this.state.openCount++ === 0 ? CONFIG.ANIMATION.defaultDelay : 0
            );
        }
    }

    // Animation utilities
    fadeIn(element, delay = 0) {
        element.style.display = 'block';
        setTimeout(() => {
            element.animate(
                [
                    { opacity: 0, transform: 'translateY(10px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ],
                {
                    duration: CONFIG.ANIMATION.duration,
                    easing: 'ease-in',
                    fill: 'forwards'
                }
            );
            element.style.opacity = '1';
        }, delay);
    }

    fadeOut(element) {
        const animation = element.animate(
            [
                { opacity: 1, transform: 'translateY(0)' },
                { opacity: 0, transform: 'translateY(10px)' }
            ],
            {
                duration: CONFIG.ANIMATION.duration,
                easing: 'ease-out',
                fill: 'forwards'
            }
        );

        animation.finished.then(() => {
            element.style.opacity = '0';
            element.style.display = 'none';
        });
    }

    typeMessage(element, text) {
        let index = 0;
        const typeCharacter = () => {
            if (index < text.length) {
                element.innerHTML += text[index];
                index++;
                setTimeout(typeCharacter, CONFIG.WELCOME_MESSAGE.typeDelay);
            }
        };
        setTimeout(typeCharacter, CONFIG.ANIMATION.defaultDelay);
    }

    appendToParent(element) {
        const parent = this.options.parentId
            ? document.getElementById(this.options.parentId)
            : document.body;
        parent.appendChild(element);
    }
}

const botId = document.currentScript.id;
const chatWidget = new ChatWidget({
    botId: botId,
    baseUrl: window.location.origin,
    smallMode: false,
});
chatWidget.init()