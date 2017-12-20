# FreeCodeCamp API Basejump: URL Shortener Microservice
## User stories:
1. I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
2. If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
3. When I visit that shortened URL, it will redirect me to my original link.

## Example creation usage:

```js
https://site/https://www.google.com
```

## Example creation output:

```js
{"url":"http://www.google.com","digit":"1"}
```

## Usage:

```
https://site/1
```

### Will redirect to:

```
https://www.google.com/
```
