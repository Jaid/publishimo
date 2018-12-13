const templates = {
  de: greetee => `Guten Morgen, ${greetee || "Welt"}!`,
  fi: greetee => `Hei, ${greetee || "maailma"}!`,
  en: greetee => `Hello, ${greetee || "world"}!`
}

export default (language, greetee) => {
  const template = templates[language]
  if (template) {
    return template(greetee)
  } else {
    return templates.en(greetee)
  }
}
