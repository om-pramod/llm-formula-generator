document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formula-form');
    const resultDiv = document.getElementById('result');
    const loadingSpinner = document.getElementById('loading');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const sourceSpan = document.getElementById('formula-source');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const range = document.getElementById('range').value;

        // Reset UI
        resultDiv.innerHTML = '<p class="placeholder">Generating...</p>';
        sourceSpan.textContent = '';
        sourceSpan.className = 'source-tag';
        copyBtn.style.display = 'none';
        loadingSpinner.style.display = 'block';
        generateBtn.disabled = true;

        try {
            const response = await fetch('/api/generate-formula', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description, range }),
            });

            const data = await response.json();

            if (data.success) {
                resultDiv.innerHTML = `<p>${data.formula}</p>`;
                sourceSpan.textContent = data.source;
                sourceSpan.classList.add(`source-${data.source}`);
                copyBtn.style.display = 'block';
            } else {
                resultDiv.innerHTML = `<p class="error">Error: ${data.error || 'Could not generate formula.'}</p>`;
            }
        } catch (error) {
            resultDiv.innerHTML = `<p class="error">An error occurred while fetching the formula.</p>`;
            console.error('Error:', error);
        } finally {
            loadingSpinner.style.display = 'none';
            generateBtn.disabled = false;
        }
    });

    copyBtn.addEventListener('click', () => {
        const formula = resultDiv.querySelector('p').textContent;
        navigator.clipboard.writeText(formula).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });
});