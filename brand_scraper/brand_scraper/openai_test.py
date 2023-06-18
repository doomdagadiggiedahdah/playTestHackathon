from utils import run_prompt, num_tokens_from_messages_cl100kbase
import openai
prompt_chain = [
    {"role": "user", "content": "what is the meaning of life"}
]
num_tokens = num_tokens_from_messages_cl100kbase(prompt_chain)
response = completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo-16k",
    messages=[{"role": "user", "content": "What is the weather like in Boston?"}],
    functions=[
        {
            "name": "get_current_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
        }
    ],
)

print(response)