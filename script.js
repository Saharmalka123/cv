const apiDataset = {
    "baseUrl": "https://7108d06018a445ca84ac72f2a8612818.flow.pstmn.io/",
    "functions": [
        {
            "method": "GET",
            "functionName": "PersonalDetails",
            "functionDesc": "Return resume attendee personal details"
        },
        {
            "method": "GET",
            "functionName": "ProfessionalExperience",
            "functionDesc": "Return resume attendee professional experience",
            "params": [
                {
                    "key": "Year",
                    "values": ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'
                    ]
                }
            ]
        },
        {
            "method": "GET",
            "functionName": "Skills",
            "functionDesc": "Return resume attendee relevant skills"
        },
        {
            "method": "GET",
            "functionName": "Education",
            "functionDesc": "Return resume attendee education"
        },
        {
            "method": "GET",
            "functionName": "Langauges",
            "functionDesc": "Return resume attendee proficiency level in languages"
        },
        {
            "method": "GET",
            "functionName": "MilitaryService",
            "functionDesc": "Return resume attendee military service"
        },
        {
            "method": "GET",
            "functionName": "Hobbies",
            "functionDesc": "Return resume attendee hobbies"
        },
        {
            "method": "GET",
            "functionName": "FullResume",
            "functionDesc": "Return resume attendee full resume"
        },
        {
            "method": "POST",
            "functionName": "KeepInTouch",
            "functionDesc": "Post the attendee your interest",
			"bodyDefaultText":'"email": "example@email.com"'
			
        },
	{
            "method": "POST",
            "functionName": "",
            "functionDesc": "Post the attendee your interest",
			"bodyDefaultText":'"email": "example@email.com"'
			
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    createTerminals(apiDataset);
});


function toggleTerminal(boxElement) {
    boxElement.classList.toggle('expanded');
}
// Setup event listeners for .custom-box .content
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.terminal-container .custom-box .content').forEach(contentDiv => {
        contentDiv.addEventListener('click', function() {
            const customBox = this.closest('.custom-box');
            if (customBox) {
                toggleTerminal(customBox);
            }
        });
    });
});

let terminalParams = {};
let terminalBody= {};

function updateTerminalParams(terminalId, paramName, value) {
    if (!terminalParams[terminalId
    ]) {
        terminalParams[terminalId
        ] = {};
    }
    // Check if the value is the default one (e.g., an empty string)
    if (value === "" || value === "Select " + paramName) {
        // If it's the default value, remove the parameter
        delete terminalParams[terminalId
        ][paramName
        ];
    } else {
        // Otherwise, update the parameter value
        terminalParams[terminalId
        ][paramName
        ] = value;
    }
}
function updateTerminalBody(terminalId, value) {
    if (!terminalBody[terminalId
    ]) {
        terminalBody[terminalId
        ] = {};
    }

    if (value === "") {
        // If it's the default value, remove the parameter
        delete terminalBody[terminalId
        ];
    } else {
        // Otherwise, update the parameter value
        terminalBody[terminalId] = value;
    }
}

function createTerminals(apiDataset) {
    const terminalsContainer = document.getElementById('terminals');

    apiDataset.functions.forEach((func, index) => {
        const terminalId = 'terminal-' + index;
        terminalParams[terminalId] = {};
        const url = apiDataset.baseUrl + '/' + func.functionName;

        let dropdownsHtml = '';
        let terminalBodyHtml = '';

        if (func.bodyDefaultText) {
            terminalBodyHtml = `
                <textarea id="${terminalId}-body" class="terminal-body-input">{${'\n'}${'\t'}${func.bodyDefaultText}${'\n'}}</textarea>
            `;
			
        }

        let parametersTitleHtml = '<h3 class="parametersBody-title"></h3>';
        if (func.params && func.params.length > 0) {
            parametersTitleHtml = '<h3 class="parametersBody-title">Parameters</h3>';
        } else if (func.bodyDefaultText) {
            parametersTitleHtml = '<h3 class="parametersBody-title">Body</h3>';
        }

        if (func.params && func.params.length > 0) {
            func.params.forEach(param => {
                dropdownsHtml += `<div class="parameter-container">`;
                dropdownsHtml += `<label for="${terminalId}-param-${param.key}">${param.key}</label>`;
                dropdownsHtml += `<select id="${terminalId}-param-${param.key}" onchange="updateTerminalParams('${terminalId}', '${param.key}', this.value)">`;
                dropdownsHtml += `<option value="">Select ${param.key}</option>`;

                param.values.forEach(value => {
                    dropdownsHtml += `<option value="${value}">${value}</option>`;
                });

                dropdownsHtml += `</select>`;
                dropdownsHtml += `</div>`;
            });
        }

        let paramString = JSON.stringify(func.params || []).replace(/"/g, "&quot;");
        terminalsContainer.innerHTML += `
            <div class="custom-box">
                <div class="content">
                    <h3>
                        <div class="styled-text">
                            <span class="bold">${func.method}</span>
                            <span class="regular">${func.functionName}</span>
                            <span class="italic">${func.functionDesc}</span>
                        </div>
                    </h3>
                </div>
                <div class="more-content">
                    <div class="parameters-header">
                        ${parametersTitleHtml}
                        <button class="try-button" onclick="fetchData('${url}', '${func.method}', '${terminalId}')">Try it out</button>
                    </div>
                    ${dropdownsHtml}
                    ${terminalBodyHtml}
                    <div id="${terminalId}" class="terminal"></div>
                </div>
            </div>
        `;

        if (func.params && func.params.length > 0) {
            func.params.forEach(param => {
                document.getElementById(`${terminalId}-param-${param.key}`).addEventListener('change', function() {
                    updateTerminalParams(terminalId, param.key, this.value);
                });
            });
        }

        if (func.bodyDefaultText) {
            document.getElementById(`${terminalId}-body`).addEventListener('input', function() {
                updateTerminalBody(`${terminalId}-body`, this.value);
            });
        }
    });
}


function fetchData(url, method, terminalId) {
    const terminal = document.getElementById(terminalId);
    const params = terminalParams[terminalId
    ];
    // Construct the query string for GET requests
    if (method === 'GET' && !(params && Object.keys(params).length === 0 && params.constructor === Object)) {
		const queryParams = Object.entries(params).map(([key, value
        ]) => `${encodeURIComponent(key)
        }=${encodeURIComponent(value)
        }`).join('&');
		url += `?${queryParams
        }`;
    }
    // Set up request options
    let requestOptions = {
        method: method,
        headers: { 'Accept': 'application/json', 'Content-Type':'application/json'
        }
    };

    // Handle POST request body
    if (method === 'POST' ) {
        requestOptions.headers['Content-Type'
        ] = 'application/json';
		const requestBody = terminalBody[`${terminalId}-body`];
        if (requestBody) {
            requestOptions.body = JSON.stringify({ body: requestBody });
        }
    }
    // Clear the terminal content
    terminal.innerHTML = '<pre>' + 'Fetching data...' + '</pre>';
console.log("url: ", url)
	
console.log("request options: ",requestOptions )
    fetch(url, requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        terminal.innerHTML = '<pre>' + JSON.stringify(data,
        null,
        2) + '</pre>';
        // Add click event listener to open the content in a new window
        terminal.addEventListener('click', () => openInNewWindow(terminal.textContent));
    })
    .catch(error => {
        terminal.innerHTML = '<pre>' + 'Error: ' + error.message + '\n' + '</pre>';
    });
}
function openInNewWindow(content) {

    const newWindow = window.open('', '_blank');

    // Include the viewport meta tag for mobile responsiveness
    const viewportMeta = `<meta name="viewport" content="width=device-width, initial-scale=1">`;

    // CSS with responsive design considerations
    const css = `	
        :root {
            --background-color-light: #ffffff;
            --text-color-light: #5D5A8E;
            --background-color-dark: #191826;
            --text-color-dark: #ffffff;
            --color1-light: #AAA6DB;
            --color1-dark: #73738d;
            --border-color: var(--color1-light); 
            --box-color-dark: #222134;
            --box-color-light: #f2f2f9;
            --button-color-dark: #ece9ff;
            --button-text-color-dark: #191826;
            --button-text-color-light: #ece9ff; 
            --bold-text-color: var(--button-text-color-light); 
            --button-hoover: #ffffff;
    }

        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: var(--background-color-light);
            color: var(--text-color-light);
            transition: background-color 0.3s, color 0.3s;
            font-size: 1em; /* Responsive font size */
    }

        pre {
            padding: 1em;
            overflow-x: auto; /* For wider content */
    }
    /* ... include all other CSS rules ... */

        @media (prefers-color-scheme: dark) {
            body {
                background-color: var(--background-color-dark);
                color: var(--text-color-dark);
        }
        /* ... other dark mode specific rules ... */
    }

        @media (prefers-color-scheme: light) {
        /* ... light mode specific rules ... */
    }

        @media (max-width: 768px) {
            body {
                font-size: 0.9em; /* Smaller font size on smaller screens */
        }
    }
    `;

    // Write the viewport meta, style, and content to the new window
    newWindow.document.write(viewportMeta + '<style>' + css + '</style><pre>' + content + '</pre>');
}

function updateButtonText() {
    const buttons = document.querySelectorAll('.try-button');
    buttons.forEach(button => {
        button.textContent = window.innerWidth <= 600 ? 'Try' : 'Try it out';
    });
}
// Update the text on initial load
document.addEventListener('DOMContentLoaded', updateButtonText);
window.addEventListener('resize', updateButtonText);
