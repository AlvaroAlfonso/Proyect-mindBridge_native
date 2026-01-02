document.addEventListener('DOMContentLoaded', () => {
            const chatbox = document.getElementById('chatbox');
            const userInput = document.getElementById('userInput');
            const sendBtn = document.getElementById('sendBtn');
    
            let user = {
                name: null,
                age: null,
                gender: null,
                responses: []
            };
            let currentQuestionIndex = 0;
            let ratingValue = 0;
    
            const questions = [
                { type: 'text', text: '¡Hola! Soy Calma-Bot. Para empezar, ¿cuál es tu nombre?' },
                { type: 'text', text: '¿Qué edad tienes?' },
                { type: 'text', text: '¿Cuál es tu género (masculino, femenino, otro)?' },
    
                {
                    type: 'multiple_choice',
                    text: '¿Cómo te sientes del 1 al 5 hoy? (1=muy mal, 5=muy bien)',
                    options: ['1', '2', '3', '4', '5']
                },
                {
                    type: 'multiple_choice',
                    text: '¿Cuál es tu nivel de energía del 1 al 5? (1=nada, 5=mucha)',
                    options: ['1', '2', '3', '4', '5']
                },
                {
                    type: 'multiple_choice',
                    text: '¿Cómo evalúas tu productividad del 1 al 5? (1=baja, 5=alta)',
                    options: ['1', '2', '3', '4', '5']
                },
                {
                    type: 'multiple_choice',
                    text: '¿Qué tan feliz te sientes del 1 al 5? (1=nada, 5=mucho)',
                    options: ['1', '2', '3', '4', '5']
                },
    
                { type: 'open_ended', text: '¿Qué evento de hoy influyó más en tu estado de ánimo?' },
                { type: 'open_ended', text: '¿Hay algo que te preocupa en este momento?' },
                { type: 'open_ended', text: '¿Qué emoción predomina en tu día a día?' },
                { type: 'open_ended', text: 'Si pudieras cambiar una cosa de hoy, ¿cuál sería?' },
                { type: 'open_ended', text: 'Describe cómo te sientes en una sola palabra.' },
                { type: 'open_ended', text: '¿Hay algo que te haga sentir orgulloso de ti mismo hoy?' }
            ];
    
            function addMessage(message, sender, isHtml = false) {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message', `${sender}-message`);
                if (isHtml) {
                    messageDiv.innerHTML = message;
                } else {
                    messageDiv.textContent = message;
                }
                chatbox.appendChild(messageDiv);
                chatbox.scrollTop = chatbox.scrollHeight;
            }
    
            function addTypingIndicator() {
                const typingDiv = document.createElement('div');
                typingDiv.classList.add('message', 'bot-message', 'typing-indicator');
                typingDiv.innerHTML = `<span>Pensando...</span>`;
                chatbox.appendChild(typingDiv);
                chatbox.scrollTop = chatbox.scrollHeight;
            }
    
            function removeTypingIndicator() {
                const typingDiv = chatbox.querySelector('.typing-indicator');
                if (typingDiv) {
                    typingDiv.remove();
                }
            }
            
            async function askQuestion() {
                if (currentQuestionIndex < questions.length) {
                    const question = questions[currentQuestionIndex];
                    let message = question.text;
                    if (question.type === 'multiple_choice') {
                        message += '<br><strong>(Responde con un número del 1 al 5)</strong>';
                    }
                    addMessage(message, 'bot', true);
                } else {
                    addTypingIndicator();
                    userInput.disabled = true;
                    sendBtn.disabled = true;
                    await analyzeAndSuggest();
                }
            }
    
            // FUNCIÓN 1 y 2: Análisis y Sugerencias con IA
            async function analyzeAndSuggest() {
                const prompt = `Actúa como un profesional de la salud mental, creativo y compasivo. Analiza las siguientes respuestas de una persona y genera una respuesta personalizada en formato JSON.

                Información de la persona:
                Nombre: ${user.name}
                Edad: ${user.age}
                Género: ${user.gender}

                Respuestas a las preguntas:
                1. Calificación de estado de ánimo: ${user.responses[0]}
                2. Nivel de energía: ${user.responses[1]}
                3. Productividad: ${user.responses[2]}
                4. Nivel de felicidad: ${user.responses[3]}
                5. Evento influyente: ${user.responses[4]}
                6. Preocupación: ${user.responses[5]}
                7. Emoción predominante: ${user.responses[6]}
                8. Cosa que cambiaría: ${user.responses[7]}
                9. Cómo se siente en una palabra: ${user.responses[8]}
                10. Orgullo de sí mismo: ${user.responses[9]}

                Instrucciones para la respuesta JSON:
                Genera un solo objeto JSON con una clave "messages" que contiene un array de objetos. Cada objeto en el array representa un mensaje a mostrar.
                Cada mensaje debe tener las siguientes claves:
                - "type": el tipo de mensaje ("heading", "paragraph", "suggestion", "closing").
                - "content": el texto del mensaje.
                - "emoji": un emoji relevante para el mensaje (ej: "✨", "🌱", "😌", "📝", "💖").
                
                La estructura del JSON debe ser:
                {
                    "messages": [
                        { "type": "paragraph", "content": "Hola ${user.name}, gracias por compartir esto conmigo. Estoy aquí para acompañarte.", "emoji": "👋" },
                        { "type": "paragraph", "content": "Aquí tienes un análisis de lo que me contaste. Espero que te ayude a reflexionar:", "emoji": "🤔" },
                        { "type": "heading", "content": "Análisis de tu estado actual", "emoji": "🌿" },
                        { "type": "paragraph", "content": "Basándome en tus respuestas, veo una calificación de ánimo de ${user.responses[0]}/5 y un nivel de energía de ${user.responses[1]}/5. Esto indica que es un buen momento para enfocarte en tu bienestar, sin importar los altibajos que hayas sentido hoy. Lo importante es que estás aquí, buscando un espacio para reflexionar, y eso ya es un gran paso.", "emoji": "😌" },
                        { "type": "heading", "content": "Sugerencias para tu bienestar", "emoji": "💖" },
                        { "type": "suggestion", "title": "Caminata de los Sentidos", "description": "Sal a caminar a un lugar tranquilo y concéntrate en uno de tus sentidos a la vez. Camina 5 minutos prestando atención solo a los sonidos, luego 5 minutos a los olores, y así sucesivamente. Esto te ayudará a anclarte en el presente.", "emoji": "🌳" },
                        { "type": "suggestion", "title": "El Diario de los Pequeños Logros", "description": "Toma un cuaderno y escribe un logro (por pequeño que sea) por cada hora de tu día. Desde levantarte de la cama hasta beber un vaso de agua. Reconocer estos 'mini-triunfos' puede mejorar tu sensación de productividad y orgullo.", "emoji": "✍️" },
                        { "type": "closing", "content": "Recuerda que estas son solo ideas para empezar. ¿Te gustaría profundizar en alguna de ellas?", "emoji": "💡" }
                    ]
                }
                Asegúrate de que la respuesta sea un JSON válido, sin texto adicional antes o después del objeto.`;
                
                try {
                    const apiKey = "AIzaSyArRIsCWPDZUoB7DyPsoRqtcxn9mT7Kilw";
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
                    const payload = {
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            responseMimeType: "application/json",
                        },
                    };
    
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    
                    const result = await response.json();
    
                    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
                        const jsonString = result.candidates[0].content.parts[0].text;
                        const data = JSON.parse(jsonString);
                        
                        removeTypingIndicator();
                        
                        // Enviar los mensajes uno por uno con un pequeño retraso
                        let delay = 0;
                        data.messages.forEach(msg => {
                            setTimeout(() => {
                                let htmlContent = "";
                                if (msg.type === "heading") {
                                    htmlContent = `<h3 class="text-lg font-bold mt-4 mb-2">${msg.emoji} ${msg.content}</h3>`;
                                } else if (msg.type === "suggestion") {
                                    htmlContent = `
                                        <div class="mt-2 p-3 bg-indigo-100 rounded-lg">
                                            <h4 class="font-semibold text-indigo-800">${msg.emoji} ${msg.title}</h4>
                                            <p class="text-sm text-indigo-700 mt-1">${msg.description}</p>
                                        </div>
                                    `;
                                } else {
                                    htmlContent = `<p>${msg.emoji ? msg.emoji + ' ' : ''}${msg.content}</p>`;
                                }
                                addMessage(htmlContent, 'bot', true);
                            }, delay);
                            delay += 1000; // 1 segundo de retraso entre mensajes
                        });

                        setTimeout(promptForRating, delay + 500); // Iniciar la calificación después del último mensaje
    
                    } else {
                        removeTypingIndicator();
                        addMessage("Lo siento, hubo un problema al generar la respuesta. Por favor, intenta de nuevo más tarde.", 'bot');
                    }
                } catch (error) {
                    console.error('Error al llamar a la API:', error);
                    removeTypingIndicator();
                    addMessage("Hubo un problema de conexión. Por favor, verifica tu internet y vuelve a intentarlo.", 'bot');
                }
            }
    
            // FUNCIÓN 3 y 4: Cierre y Calificación
            function promptForRating() {
                userInput.disabled = true;
                sendBtn.disabled = true;
                addMessage("Finalmente, para ayudarnos a mejorar, ¿puedes calificar nuestra conversación? Haz clic en las estrellas para dejar tu opinión.", 'bot');
                
                const ratingDiv = document.createElement('div');
                ratingDiv.classList.add('message', 'bot-message');
                ratingDiv.innerHTML = `
                    <div class="rating-container">
                        <span class="star" data-value="1">&#9733;</span>
                        <span class="star" data-value="2">&#9733;</span>
                        <span class="star" data-value="3">&#9733;</span>
                        <span class="star" data-value="4">&#9733;</span>
                        <span class="star" data-value="5">&#9733;</span>
                    </div>
                    <div class="rating-message"></div>
                `;
                chatbox.appendChild(ratingDiv);
    
                const stars = ratingDiv.querySelectorAll('.star');
                const messageEl = ratingDiv.querySelector('.rating-message');
    
                stars.forEach(star => {
                    star.addEventListener('click', () => {
                        const value = parseInt(star.dataset.value);
                        ratingValue = value;
                        stars.forEach(s => {
                            if (parseInt(s.dataset.value) <= value) {
                                s.classList.add('filled');
                            } else {
                                s.classList.remove('filled');
                            }
                        });
                        messageEl.textContent = `¡Gracias por tu calificación de ${ratingValue} estrellas!`;
                        addMessage(`Has calificado con ${ratingValue} estrellas. ¡Gracias! Puedes refrescar la página para empezar de nuevo.`, 'bot');
                        chatbox.scrollTop = chatbox.scrollHeight;
                    });
                });
            }
    
            sendBtn.addEventListener('click', () => {
                const userMessage = userInput.value.trim();
                if (userMessage === '') return;
    
                // VALIDACIÓN 4: Lógica para validar entradas
                let isValid = true;
                const currentQuestion = questions[currentQuestionIndex];
    
                if (currentQuestionIndex < 3) {
                    if (userMessage.length < 2) {
                        isValid = false;
                        addMessage("Por favor, ingresa una respuesta más clara. Intenta de nuevo.", 'bot');
                    }
                } else if (currentQuestion.type === 'multiple_choice') {
                    const value = parseInt(userMessage);
                    if (isNaN(value) || value < 1 || value > 5) {
                        isValid = false;
                        addMessage("Por favor, responde con un número del 1 al 5. Intenta de nuevo.", 'bot');
                    }
                } else if (currentQuestion.type === 'open_ended') {
                    if (userMessage.length < 5) {
                        isValid = false;
                        addMessage("Por favor, dame una respuesta más detallada. Intenta de nuevo.", 'bot');
                    }
                }
    
                if (!isValid) {
                    userInput.value = '';
                    return;
                }
                
                addMessage(userMessage, 'user');
                
                if (currentQuestionIndex === 0) {
                    user.name = userMessage;
                } else if (currentQuestionIndex === 1) {
                    user.age = userMessage;
                } else if (currentQuestionIndex === 2) {
                    user.gender = userMessage;
                } else {
                    user.responses.push(userMessage);
                }
                
                userInput.value = '';
                currentQuestionIndex++;
                setTimeout(askQuestion, 1000);
            });
    
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendBtn.click();
                }
            });
    
            askQuestion();
        });

        document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('auth-form');

    // Muestra un mensaje de error para el campo específico
    const displayError = (fieldId, message) => {
        const errorElement = document.querySelector(`.error-message[data-field="${fieldId}"]`);
        const inputElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = message;
            if (message) {
                inputElement.classList.add('error');
            } else {
                inputElement.classList.remove('error');
            }
        }
    };

    // Función principal de validación para todo el formulario
    const validateForm = () => {
        let isValid = true;

        // ------------------ 1. Nombre y Apellido (full-name) ------------------
        const fullNameInput = document.getElementById('full-name');
        const fullNameValue = fullNameInput.value.trim();
        const fullNameFieldId = 'full-name';
        displayError(fullNameFieldId, ''); // Limpiar error previo

        if (fullNameValue === '') {
            displayError(fullNameFieldId, '❌ El nombre y apellido no puede estar vacío.');
            isValid = false;
        } else if (fullNameValue.length < 10 || fullNameValue.length > 50) {
            displayError(fullNameFieldId, '❌ Debe tener entre 10 y 50 caracteres.');
            isValid = false;
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(fullNameValue)) {
            displayError(fullNameFieldId, '❌ Solo se permiten letras y espacios.');
            isValid = false;
        }

        // ------------------ 2. Correo Electrónico (correo-electronico) ------------------
        const emailInput = document.getElementById('correo-electronico');
        const emailValue = emailInput.value.trim();
        const emailFieldId = 'correo-electronico';
        displayError(emailFieldId, '');

        // Expresión regular para validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        if (emailValue === '') {
            displayError(emailFieldId, '❌ El correo electrónico es obligatorio.');
            isValid = false;
        } else if (!emailRegex.test(emailValue)) {
            displayError(emailFieldId, '❌ Por favor, ingrese un formato de correo válido (ej. tu@dominio.com).');
            isValid = false;
        }


        // ------------------ 3. Número Telefónico (phone-number) ------------------
        const phoneInput = document.getElementById('phone-number');
        const phoneValue = phoneInput.value.trim();
        const phoneFieldId = 'phone-number';
        displayError(phoneFieldId, '');
        
        // Expresión regular para aceptar solo dígitos
        const numberRegex = /^\d{10}$/; 

        if (phoneValue === '') {
            displayError(phoneFieldId, '❌ El número telefónico es obligatorio.');
            isValid = false;
        } else if (!/^\d+$/.test(phoneValue)) {
            displayError(phoneFieldId, '❌ Solo se permiten números (dígitos).');
            isValid = false;
        } else if (phoneValue.length !== 10) {
            displayError(phoneFieldId, '❌ Debe tener exactamente 10 dígitos.');
            isValid = false;
        }

        // ------------------ 4. Tu Mensaje (motivation) ------------------
        const motivationInput = document.getElementById('motivation');
        const motivationValue = motivationInput.value.trim();
        const motivationFieldId = 'motivation';
        displayError(motivationFieldId, '');

        if (motivationValue === '') {
            displayError(motivationFieldId, '❌ El mensaje es obligatorio. Por favor, describe tu solicitud.');
            isValid = false;
        } else if (motivationValue.length < 10) {
            displayError(motivationFieldId, '❌ El mensaje es muy corto. Mínimo 10 caracteres.');
            isValid = false;
        } else if (motivationValue.length > 800) {
            // Esta validación se superpone con el atributo maxlength del HTML, pero es buena práctica de JS.
            displayError(motivationFieldId, '❌ El mensaje es demasiado largo. Máximo 800 caracteres.');
            isValid = false;
        }
        // Nota: Solo se requieren datos de texto. Como es un textarea, permite todos los caracteres excepto los que rompen el formato (que no es el caso aquí).

        return isValid;
    };

    // Escucha el evento de envío del formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Detener el envío por defecto

        if (validateForm()) {
            // Si el formulario es válido, aquí puedes enviar los datos.
            alert('✅ Formulario válido. ¡Mensaje enviado con éxito!');
            // Aquí iría el código para enviar los datos (ej. fetch, axios, etc.)
            // form.submit(); // Si quieres enviarlo de forma tradicional después de la validación.
            // form.reset(); // Opcional: Limpiar el formulario después del envío exitoso.
        } else {
            // Si no es válido, los mensajes de error ya se han mostrado.
            console.log('Formulario no válido. Revise los errores.');
        }
    });
});