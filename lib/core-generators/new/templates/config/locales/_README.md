# Internationalization / Localization Settings

## Introduction
See **[Concepts > Internationalization](http://sailsjs.com/docs/concepts/internationalization)**.

## Locales
All locale files live under `config/locales`. Here is where you can add translations
as JSON key-value pairs. The name of the file should match the language that you are supporting.
This allows for automatic language detection based on request headers.

Here is an example locale stringfile for the Spanish language (`config/locales/es.json`):
```json
{
    "Hello!": "Hola!",
    "Hello %s, how are you today?": "¿Hola %s, como estas?",
}
```
## Usage
Locales can be accessed in controller actions and policies through `res.i18n()`, or in views through the `__(key)` or `i18n(key)` functions.
Remember that the keys are case sensitive and require exact matches when accessed from your view, e.g.

```ejs
<h1> <%= __('Welcome to PencilPals!') %> </h1>
<h2> <%= i18n('Hello %s, how are you today?', 'Pencil Maven') %> </h2>
<p> <%= i18n('That\'s right-- you can use either i18n() or __()') %> </p>
```

## Configuration
Localization/internationalization support in Sails can be globally configured using [`sails.config.i18n`](http://sailsjs.com/docs/reference/configuration/sails-config-i-18-n).
By convention, this is set in `config/i18n.js`, from where you can set your supported locales.
