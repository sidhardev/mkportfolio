document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init();

    // First check if this is a shared portfolio
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('data');
    if (sharedData && window.location.hash === '#preview') {
        try {
            const portfolioData = JSON.parse(decodeURIComponent(atob(sharedData)));
            const portfolioHtml = generatePortfolioHTML(portfolioData);
            document.body.innerHTML = portfolioHtml;
            document.title = `${portfolioData.name}'s Portfolio`;
            return; // Stop here if this is a shared portfolio
        } catch (error) {
            console.error('Failed to load shared portfolio:', error);
        }
    }

    // DOM Elements
    const nameInput = document.getElementById('name');
    const taglineInput = document.getElementById('tagline');
    const bioInput = document.getElementById('bio');
    const profilePicUrlInput = document.getElementById('profilePicUrl');
    const emailInput = document.getElementById('email');
    const linkedinInput = document.getElementById('linkedin');
    const githubInput = document.getElementById('github');

    // Style Customization Elements
    const colorThemeSelect = document.getElementById('colorTheme');
    const fontStyleSelect = document.getElementById('fontStyle');
    const layoutStyleSelect = document.getElementById('layoutStyle');
    const animationStyleSelect = document.getElementById('animationStyle');

    // Skills
    const skillInput = document.getElementById('skillInput');
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillsContainer = document.getElementById('skillsContainer');

    // Projects
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectsContainer = document.getElementById('projectsContainer');
    const projectFormTemplate = document.getElementById('projectFormTemplate');

    // Actions & Preview
    const generatePreviewBtn = document.getElementById('generatePreviewBtn');
    const downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
    const previewFrame = document.getElementById('previewFrame');

    // --- Event Listeners ---

    // Add Skill
    addSkillBtn.addEventListener('click', () => {
        const skillText = skillInput.value.trim();
        if (skillText) {
            addSkillToDom(skillText);
            skillInput.value = '';
            skillInput.focus();
        }
    });

    skillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkillBtn.click();
        }
    });

    // Remove Skill (Event Delegation)
    skillsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-skill-btn')) {
            e.target.closest('.skill-tag').remove();
        }
    });

    // Add Project
    addProjectBtn.addEventListener('click', addProjectForm);

    // Remove Project (Event Delegation)
    projectsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-project-btn')) {
            e.target.closest('.project-form-instance').remove();
        }
    });

    // Generate Preview
    generatePreviewBtn.addEventListener('click', updatePreview);

    // Download HTML
    downloadHtmlBtn.addEventListener('click', downloadPortfolio);

    // Style Customization Event Listeners
    colorThemeSelect.addEventListener('change', updateStyles);
    fontStyleSelect.addEventListener('change', updateStyles);
    layoutStyleSelect.addEventListener('change', updateStyles);
    animationStyleSelect.addEventListener('change', updateStyles);

    // --- Functions ---

    function addSkillToDom(skillText) {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm mr-2 mb-2 flex items-center';
        
        const skillNameSpan = document.createElement('span');
        skillNameSpan.textContent = skillText;
        skillTag.appendChild(skillNameSpan);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-skill-btn ml-2 text-indigo-600 hover:text-indigo-800 font-bold';
        removeBtn.innerHTML = '&times;';
        removeBtn.setAttribute('aria-label', `Remove ${skillText} skill`);
        skillTag.appendChild(removeBtn);

        skillsContainer.appendChild(skillTag);
    }

    function addProjectForm() {
        const templateContent = projectFormTemplate.content.cloneNode(true);
        projectsContainer.appendChild(templateContent);
    }

    function getPortfolioData() {
        const skills = Array.from(skillsContainer.querySelectorAll('.skill-tag span'))
            .map(span => span.textContent.trim());

        const projects = Array.from(projectsContainer.querySelectorAll('.project-form-instance'))
            .map(projectDiv => ({
                title: projectDiv.querySelector('.project-title-input')?.value.trim() || '',
                description: projectDiv.querySelector('.project-description-input')?.value.trim() || '',
                imageUrl: projectDiv.querySelector('.project-imageUrl-input')?.value.trim() || '',
                liveUrl: projectDiv.querySelector('.project-liveUrl-input')?.value.trim() || '',
                repoUrl: projectDiv.querySelector('.project-repoUrl-input')?.value.trim() || '',
                technologies: projectDiv.querySelector('.project-technologies-input')?.value.split(',').map(t => t.trim()).filter(t => t) || []
            }));

        return {
            name: nameInput.value.trim(),
            tagline: taglineInput.value.trim(),
            bio: bioInput.value.trim(),
            profilePicUrl: profilePicUrlInput.value.trim(),
            email: emailInput.value.trim(),
            linkedin: linkedinInput.value.trim(),
            github: githubInput.value.trim(),
            skills,
            projects,
            style: {
                colorTheme: colorThemeSelect.value,
                fontStyle: fontStyleSelect.value,
                layoutStyle: layoutStyleSelect.value,
                animationStyle: animationStyleSelect.value === 'none' ? '' : animationStyleSelect.value
            }
        };
    }

    function generatePortfolioHTML(data) {
        const { name, tagline, bio, profilePicUrl, email, linkedin, github, skills, projects, style } = data;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}'s Portfolio</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <style>
        :root {
            ${Object.entries(getThemeColors(style.colorTheme)).map(([prop, value]) => `${prop}: ${value};`).join(';\n            ')}
        }
        body {
            font-family: '${style.fontStyle}', sans-serif;
        }
        .primary-bg { background-color: var(--primary-color); }
        .primary-text { color: var(--primary-color); }
        .primary-border { border-color: var(--primary-color); }
        .accent-bg { background-color: var(--accent-color); }
        .accent-text { color: var(--accent-color); }
    </style>
</head>
<body class="bg-gray-50 layout-${style.layoutStyle}">
    <!-- Rest of the portfolio HTML with applied styles -->
    <header class="primary-bg text-white py-20">
        <div class="container mx-auto px-4 text-center">
            ${profilePicUrl ? `<img src="${profilePicUrl}" alt="${name}" class="w-32 h-32 mx-auto rounded-full mb-6 border-4 border-white shadow-lg">` : ''}
            <h1 class="text-4xl font-bold mb-4" ${style.animationStyle ? `data-aos="${style.animationStyle}"` : ''}>${name}</h1>
            <p class="text-xl mb-4 text-gray-100" ${style.animationStyle ? `data-aos="${style.animationStyle}" data-aos-delay="100"` : ''}>${tagline}</p>
            <div class="flex justify-center space-x-4">
                ${email ? `<a href="mailto:${email}" class="text-white hover:text-gray-200"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg></a>` : ''}
                ${linkedin ? `<a href="${linkedin}" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-200"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.329C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"></path></svg></a>` : ''}
                ${github ? `<a href="${github}" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-200"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 .333C4.475.333 0 4.808 0 10.333c0 4.42 2.865 8.166 6.839 9.49.5.092.683-.217.683-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 5.38c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.495 20 14.751 20 10.333 20 4.808 15.525.333 10 .333z" clip-rule="evenodd"></path></svg></a>` : ''}
            </div>
        </div>
    </header>

    <main class="container mx-auto px-4 py-12">
        <!-- Bio Section -->
        <section class="mb-12 text-center max-w-3xl mx-auto" ${style.animationStyle ? `data-aos="${style.animationStyle}"` : ''}>
            <p class="text-lg text-gray-700">${bio}</p>
        </section>

        <!-- Skills Section -->
        <section class="mb-12" ${style.animationStyle ? `data-aos="${style.animationStyle}"` : ''}>
            <h2 class="text-2xl font-bold mb-6 text-center primary-text">Skills & Technologies</h2>
            <div class="flex flex-wrap justify-center gap-3">
                ${skills.map(skill => `
                    <span class="px-4 py-2 rounded-full text-sm font-medium primary-bg text-white">${skill}</span>
                `).join('')}
            </div>
        </section>

        <!-- Projects Section -->
        <section class="mb-12">
            <h2 class="text-2xl font-bold mb-8 text-center primary-text">Featured Projects</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                ${projects.map((project, index) => `
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden" ${style.animationStyle ? `data-aos="${style.animationStyle}" data-aos-delay="${index * 100}"` : ''}>
                        ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="w-full h-48 object-cover">` : ''}
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2 primary-text">${project.title}</h3>
                            <p class="text-gray-600 mb-4">${project.description}</p>
                            <div class="flex flex-wrap gap-2 mb-4">
                                ${project.technologies.split(',').map(tech => `
                                    <span class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">${tech.trim()}</span>
                                `).join('')}
                            </div>
                            <div class="flex space-x-4">
                                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="text-sm primary-text hover:underline">Live Demo</a>` : ''}
                                ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="text-sm primary-text hover:underline">Source Code</a>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    </main>

    <footer class="py-8 text-center text-gray-500">
        <p>&copy; ${new Date().getFullYear()} ${name}. All rights reserved.</p>
    </footer>

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            duration: 800,
            once: true
        });
    </script>
</body>
</html>`;
    }

    function updatePreview() {
        const portfolioData = getPortfolioData();
        const portfolioHtml = generatePortfolioHTML(portfolioData);
        previewFrame.srcdoc = portfolioHtml;
        
        // Create sharable link
        const portfolioDataStr = JSON.stringify(portfolioData);
        const portfolioDataB64 = btoa(encodeURIComponent(portfolioDataStr));
        const shareableUrl = `${window.location.origin}${window.location.pathname}?data=${portfolioDataB64}#preview`;

        // Show share dialog
        const dialog = document.createElement('div');
        dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        dialog.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
                <h3 class="text-xl font-bold mb-4">Share Your Portfolio</h3>
                <p class="mb-4">Your portfolio is ready! Copy this link to share:</p>
                <div class="flex gap-2 mb-4">
                    <input type="text" value="${shareableUrl}" class="flex-1 p-2 border rounded" readonly onclick="this.select()">
                    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onclick="navigator.clipboard.writeText('${shareableUrl}').then(() => this.textContent = 'Copied!')">Copy</button>
                </div>
                <button class="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200" onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(dialog);
    }

    function downloadPortfolio() {
        const portfolioData = getPortfolioData();
        const portfolioHtml = generatePortfolioHTML(portfolioData);
        const blob = new Blob([portfolioHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(portfolioData.name || 'portfolio').toLowerCase().replace(/\s+/g, '-')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function updateStyles() {
        const portfolioData = collectFormData();
        if (previewFrame.contentDocument) {
            applyStylesToPreview(previewFrame.contentDocument, portfolioData.style);
        }
    }

    function applyStylesToPreview(doc, style) {
        // Apply color theme
        const root = doc.documentElement;
        const themeColors = getThemeColors(style.colorTheme);
        Object.entries(themeColors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Apply font style
        doc.body.style.fontFamily = `'${style.fontStyle}', sans-serif`;

        // Apply layout style
        doc.body.className = `layout-${style.layoutStyle}`;

        // Apply animation style
        const elements = doc.querySelectorAll('[data-aos]');
        elements.forEach(el => {
            el.setAttribute('data-aos', style.animationStyle === 'none' ? '' : style.animationStyle);
        });
    }

    function getThemeColors(theme) {
        const themes = {
            blue: {
                '--primary-color': '#0284c7',
                '--primary-dark': '#0369a1',
                '--primary-light': '#bae6fd',
                '--accent-color': '#3b82f6'
            },
            purple: {
                '--primary-color': '#8b5cf6',
                '--primary-dark': '#7c3aed',
                '--primary-light': '#ddd6fe',
                '--accent-color': '#a855f7'
            },
            green: {
                '--primary-color': '#10b981',
                '--primary-dark': '#059669',
                '--primary-light': '#a7f3d0',
                '--accent-color': '#34d399'
            },
            orange: {
                '--primary-color': '#f97316',
                '--primary-dark': '#ea580c',
                '--primary-light': '#fed7aa',
                '--accent-color': '#fb923c'
            },
            gray: {
                '--primary-color': '#4b5563',
                '--primary-dark': '#374151',
                '--primary-light': '#e5e7eb',
                '--accent-color': '#6b7280'
            }
        };
        return themes[theme] || themes.blue;
    }

    function collectFormData() {
        const portfolioData = {
            // ...existing code for collecting other form data...
            style: {
                colorTheme: colorThemeSelect.value,
                fontStyle: fontStyleSelect.value,
                layoutStyle: layoutStyleSelect.value,
                animationStyle: animationStyleSelect.value === 'none' ? '' : animationStyleSelect.value
            }
        };
        return portfolioData;
    }
});