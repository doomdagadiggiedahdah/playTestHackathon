import json
import time
import openai
import tiktoken
from bs4 import BeautifulSoup

NUM_RETRIES = 5
DELAY = 60 # in seconds

def num_tokens_from_messages_cl100kbase(messages):
    """Returns the number of tokens used by a list of messages."""
    encoding = tiktoken.get_encoding("cl100k_base")
    
    tokens_per_message = 4  # every message follows <|start|>{role/name}\n{content}<|end|>\n
    tokens_per_name = -1  # if there's a name, the role is omitted
    
    num_tokens = 0
    for message in messages:
        num_tokens += tokens_per_message
        for key, value in message.items():
            num_tokens += len(encoding.encode(value))
            if key == "name":
                num_tokens += tokens_per_name
    num_tokens += 3  # every reply is primed with <|start|>assistant<|message|>
    return num_tokens

def run_prompt(messages, message_tokens, N=1):
    # OpenAI doc on all available params for Chat Completions: https://platform.openai.com/docs/guides/chat/introduction
    # model = params['model']
    model = 'gpt-3.5-turbo-16k'
    temperature = 0
    top_p = 0.85
    frequency_penalty = 0
    presence_penalty = 0
    
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        stream=False,
        n=N,
        temperature=temperature,
        top_p=top_p,
        max_tokens=16_384 - message_tokens,
        frequency_penalty=frequency_penalty,
        presence_penalty=presence_penalty)
    
    response_json = json.loads(str(response))
    
    return response_json.get('choices')[0].get('message').get('content')

def run_prompt_with_retry(messages, message_tokens, N=1, retries=NUM_RETRIES, delay=DELAY):
    for retry_count in range(retries):
        try:
            return run_prompt(messages, message_tokens, N=N)
        except openai.error.RateLimitError as e:
            if retry_count < retries - 1:
                print(f"Rate limit exceeded, retrying after {delay} seconds...")
                time.sleep(delay)
            else:
                raise e

def read_prompt_text(prompt_txt_path, text_input=None):
    with open(prompt_txt_path, 'r') as file:
        template_prompt = file.read()

    if text_input:
        actual_prompt = template_prompt
        for key, value in text_input.items():
            actual_prompt = actual_prompt.replace(key, value)
    else:
        actual_prompt = template_prompt

    return actual_prompt

def clean_html(html_text):
    soup = BeautifulSoup(html_text, features="html.parser")

    # kill all script and style elements
    for script in soup(["script", "style"]):
        script.extract()    # rip it out

    # insert space before each tag
    for tag in soup.find_all():
        tag.insert_before(" ")

    # extract the body tag
    body = soup.body

    # iterate through all remaining tags to get_text
    text_parts = []
    for tag in body.children:
        if tag.name:
            tag_text = ' '.join(tag.get_text().split())  # clean up whitespace
            if tag_text:
                text_parts.append(tag_text)

    # Join text parts with proper spacing
    text = ' '.join(text_parts)
        
    return text