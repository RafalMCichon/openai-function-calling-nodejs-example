import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Example dummy function hard coded to return the same weather
/* const get_current_weather = async (location, unit = 'fahrenheit') => {
    // Implement your actual API call here. This is a mock-up.
    // console.log(location);
    return JSON.stringify({
        location: location,
        temperature: '72',
        unit: unit,
        forecast: ['sunny', 'windy']
    });
}; */


// Example production function that calls the Weather API
const get_current_weather = async (location, unit = 'fahrenheit') => {
    const WEATHER_API_KEY = `${process.env.WEATHER_API_KEY}`
    const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}&aqi=no`;

    const response = await fetch(url);
    const data = await response.json();
    // console.log(location);
    // console.log(data);

    const weather = {
        location: data.location.name,
        temperature: unit === 'fahrenheit' ? data.current.temp_f : data.current.temp_c,
        unit: unit,
        forecast: [data.current.condition.text]
    };

    return JSON.stringify(weather);
};

const run_conversation = async () => {
    const request = {
        model: 'gpt-3.5-turbo-0613',
        messages: [{ role: 'user', content: 'What\'s the weather like in Boston?' }],
        functions: [
            {
                name: 'get_current_weather',
                description: 'Get the current weather in a given location',
                parameters: {
                    type: 'object',
                    properties: {
                        location: { type: 'string', description: 'The city and state, e.g. San Francisco, CA' },
                        unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
                    },
                    required: ['location'],
                },
            },
        ],
        function_call: 'auto',
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const data = await response.json();

    // console.log(data['choices'][0]['message']['function_call']);

    const message = data['choices'][0]['message'];

    if (message['function_call']) {
        const function_name = message['function_call']['name'];
        const function_arguments = JSON.parse(message['function_call']['arguments']);
        const { location, unit } = function_arguments;

        const function_response = await get_current_weather(location, unit);

        const second_request = {
            model: 'gpt-3.5-turbo-0613',
            messages: [
                { role: 'user', content: 'What is the weather like in Boston?' },
                message,
                { role: 'function', name: function_name, content: function_response },
            ],
        };

        const second_response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(second_request),
        });

        const second_data = await second_response.json();
        return second_data;
    }

};

run_conversation().then(data => {
    const content = data['choices'][0]['message']['content'];
    console.log(content);
}).catch(console.error);

