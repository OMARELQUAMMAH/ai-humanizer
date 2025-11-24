// DeepSeek API Configuration
const DEEPSEEK_API_KEY = 'YOUR_DEEPSEEK_API_KEY_HERE'; // ← YOU WILL CHANGE THIS LATER
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

async function humanizeText() {
    const inputElement = document.getElementById('inputText');
    const outputElement = document.getElementById('outputText');
    const button = document.getElementById('humanizeBtn');
    const buttonText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.loading-spinner');
    
    const inputText = inputElement.value.trim();
    
    // Validation
    if (!inputText) {
        alert('Please enter some text to humanize');
        return;
    }

    if (DEEPSEEK_API_KEY === 'YOUR_DEEPSEEK_API_KEY_HERE') {
        outputElement.value = '⚠️ Please set up your DeepSeek API key first!\n\n1. Go to platform.deepseek.com\n2. Get your free API key\n3. Replace "YOUR_DEEPSEEK_API_KEY_HERE" in script.js';
        return;
    }

    // Show loading state
    button.disabled = true;
    buttonText.style.display = 'none';
    spinner.style.display = 'inline';
    outputElement.value = '🔄 Humanizing your text... This may take a few seconds.';

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert at making AI-generated text sound natural and human. 
                                 Rewrite the text to be more conversational, engaging, and natural while 
                                 preserving the original meaning and information. 
                                 Keep the same length and format. 
                                 Output ONLY the rewritten text without any additional comments or explanations.`
                    },
                    {
                        role: 'user',
                        content: `Please humanize this text to sound more natural and human:\n\n${inputText}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            outputElement.value = data.choices[0].message.content;
        } else {
            throw new Error('Unexpected API response format');
        }
        
    } catch (error) {
        console.error('Error:', error);
        outputElement.value = `❌ Error: ${error.message}\n\nPlease check your API key and try again.`;
    } finally {
        // Reset button state
        button.disabled = false;
        buttonText.style.display = 'inline';
        spinner.style.display = 'none';
    }
}

// Add keyboard shortcut (Ctrl + Enter)
document.getElementById('inputText').addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        humanizeText();
    }
});

// Add sample text for testing
document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    inputText.placeholder = "Example: Furthermore, it is imperative that we utilize these resources to optimize our operational efficiency. Additionally, we must consider the various methodologies available to us in order to achieve our desired outcomes...";
});
