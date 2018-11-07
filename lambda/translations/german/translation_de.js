const deData = {
    translation: {
      SKILL_NAME: 'XRP Tip Bott',
      WELCOME_MESSAGE: 'Willkommen zum XRP Tip Bott Skill. Du kannst deinen Kontostand abfragen oder Tips an deine Kontakte aus der XRP Tip Bott App senden. Wie kann ich dir helfen? ',
      ACCOUNT_LINKING: 'Du musst erst deinen Alexa skill mit dem XRP Tip Bott verbinden. Bitte schaue dazu in die Alexa App. ',
      ACCOUNT_BALANCE: 'Dein XRP Tip Bott Kontostand ist: %s XRP. Wie kann ich dir sonst noch helfen? ',
      ASK_FOR_AMOUNT: 'Wie viele XRP willst du senden? ',
      ASK_FOR_AMOUNT_MIN: 'Es müssen mindestens 0,001 XRP gesendet werden. ',
      ASK_FOR_AMOUNT_MAX: 'Es können maximal 20 XRP gesendet werden. ',
      ASK_FOR_AMOUNT_FAIL: 'Sorry, ich habe die Zahl nicht verstanden. Bitte wiederhole. ',
      ASK_FOR_AMOUNT_CONFIRMATION: '%s XRP. Richtig? ',
      ASK_FOR_AMOUNT_FALLBACK: 'Sorry, das habe ich leider nicht verstanden. Bitte wiederhole den Betrag. ',
      ASK_FOR_USER: 'An welchen User willst du deinen Tipp senden? ',
      ASK_FOR_USER_FAIL: 'Sorry, ich habe den User nicht verstanden. Bitte wiederhole. ',
      ASK_FOR_USER_CONFIRMATION: 'Meinst du den user %s von %s? ',
      ASK_FOR_USER_FALLBACK: 'Das habe ich leider nicht verstanden. Bitte sage: an ... und dann den Usernamen. ',
      TIP_CONFIRMATION: 'Du willst %s XRP an den User %s senden, korrekt? ',
      TIP_SENT_RESPONSE: '%s XRP wurden an %s gesendet. ',
      SENDING_TIP_CANCEL: 'Ok, der Vorgang wurde abgebrochen und keine XRP gesendet. ',
      NO_USER_FOUND: 'Tut mir leid ich konnte keinen User mit diesem Namen finden. ',
      NO_MORE_USERS: 'Tut mir leid, ich kann dir keine weiteren User anbieten. Bitte versuche es erneut. ',
      ANSWER_YES_NO: 'Bitte antworte mit Ja, Nein oder sage abbrechen. ',
      HELP_MESSAGE: 'Du kannst sagen, „Wie ist mein Kontostand“, oder „Sende 0,1 XRP“. Wie kann ich dir helfen? ',
      HELP_REPROMPT: 'Wie kann ich dir helfen? ',
      FALLBACK_MESSAGE: 'Der XRP Tip Bott Skill kann dir dabei nicht helfen. Ich kann XRP Tips an deine XRP Tip Bott Kontakte senden oder deinen XRP Tip Bott Kontostand abfragen. Wie kann ich dir helfen? ',
      FALLBACK_REPROMPT: 'Wie kann ich dir helfen? ',
      ERROR_MESSAGE: 'Es ist ein Fehler aufgetreten Bitte melde das Problem dem Entwickler und versuche es erneut. ',
      STOP_MESSAGE: 'Auf Wiedersehen! Bis zum nächsten mal. ',
      RESPONSE_ERROR_404: 'Der User, an den du die XRP senden willst, hat sich noch nie auf der XRP Tip Bot Webseite angemeldet. ',
      RESPONSE_ERROR_403: 'Es wurde kein Betrag angegeben. Etwas ist schief gelaufen. Bitte melde das Problem dem Entwickler. ',
      RESPONSE_ERROR_401_WITH_AMOUNT: 'Du hast nicht genügend XRP um %s XRP zu senden. ',
      RESPONSE_ERROR_413: 'Der Betrag ist zu groß. So viele XRP kann ich leider nicht senden. ',
      RESPONSE_ERROR_500: 'Die Empfänger Addresse ist nicht gültig. Bitte sende das Problem an den Entwickler. ',
      RESPONSE_ERROR_300: 'Du kannst keine XRP zu dir selbst senden. ',
      RESPONSE_ERROR_400: 'Der User, an den du den Tipp senden willst, hat den XRP Tip Bot deaktiviert. ',
    },
};
  
const dedeData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
    },
};

exports.deData = function() {
    return deData;
}

exports.deDEData = function() {
    return dedeData;
}