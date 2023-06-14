# Function Calling Node.js Example with OpenAI GPT-3.5-turbo and Weather API

This code example demonstrates how to use OpenAI GPT-3.5-turbo model for function calling, specifically to retrieve weather information using a weather API.

## Prerequisites

Before running this code, make sure you have the following prerequisites:

- [Node.js](https://nodejs.org/en) installed (version 14 or higher)
- [OpenAI API key ](https://platform.openai.com/account/api-keys)
- [Weather API key](https://www.weatherapi.com/my/) (used for the actual weather data)  

## Setup

1. Clone the repository and navigate to the project directory.

2. Install dependencies by running the following command:

```shell
   npm install
```

3. Create a **.env** file in the project root directory and add the following environment variables:

```shell
OPENAI_API_KEY=your_openai_api_key
WEATHER_API_KEY=your_weather_api_key
```

Replace your_openai_api_key with your actual OpenAI API key and your_weather_api_key with your actual weather API key.

## Usage
To use the code, you can run the following command:

```shell
npm start
```

This will execute the run_conversation function and retrieve weather information using OpenAI GPT-3.5-turbo model and the weather API.

The code starts by calling the OpenAI API with a user query and a set of defined functions. If the model decides to call a function, it invokes the get_current_weather function, which makes a request to the weather API to retrieve weather data for the specified location. The weather information is then returned as a JSON string.

The code uses the response from the OpenAI API to extract the weather information and prints it to the console.

## Customization
If you want to customize the code for your specific use case, you can modify the following parts:

Weather API: In the get_current_weather function, you can replace the API URL and response parsing logic with your actual weather API implementation.

## License
This code is released under the MIT License.
