const deData = {
    translation: {
      SKILL_NAME: 'XRP Tip Bott',
      WELCOME_MESSAGE: 'Willkommen zum XRP Tip Bott Skill. Du kannst deinen Kontostand abfragen oder Tips an deine Kontakte aus der XRP Tip Bott App senden. Wie kann ich dir helfen? ',
      ACCOUNT_LINKING: 'Du musst erst deinen Alexa skill mit dem XRP Tip Bott verbinden. Bitte schaue dazu in die Alexa App. ',
      ACCOUNT_BALANCE: 'Dein XRP Tip Bott Kontostand ist: %(amount)s XRP. Wie kann ich dir sonst noch helfen? ',
      ASK_FOR_AMOUNT: 'Wie viele XRP willst du senden? ',
      ASK_FOR_AMOUNT_MAX: 'Es können maximal 20 XRP gesendet werden. ',
      ASK_FOR_AMOUNT_FAIL: 'Sorry, ich habe die Zahl nicht verstanden. Bitte wiederhole. ',
      ASK_FOR_AMOUNT_CONFIRMATION: '%(amount)s XRP. Richtig? ',
      ASK_FOR_AMOUNT_FALLBACK: 'Sorry, das habe ich leider nicht verstanden. Bitte wiederhole den Betrag. ',
      ASK_FOR_USER: 'An welchen User willst du deinen Tip senden? ',
      ASK_FOR_USER_FAIL: 'Sorry, ich habe den User nicht verstanden. Bitte wiederhole. ',
      ASK_FOR_USER_CONFIRMATION: 'Meinst du den user %(user)s von %(network)s? ',
      ASK_FOR_USER_FALLBACK: 'Das habe ich leider nicht verstanden. Bitte sage: suche nach ... und dann den Usernamen. ',
      TIP_CONFIRMATION: 'Du willst %(amount)s XRP an den User %(user)s senden, korrekt? ',
      TIP_SENT_RESPONSE: '%(amount)s XRP wurden an %(user)s gesendet. ',
      SENDING_TIP_CANCEL: 'Ok, der Vorgang wurde abgebrochen und keine XRP gesendet. ',
      NO_USER_FOUND: 'Tut mir leid, ich konnte keinen User in deiner XRP Tip Bott Kontaktliste finden. ',
      NO_MORE_USERS: 'Tut mir leid, ich kann dir keine weiteren User anbieten. Bitte versuche es erneut. ',
      ANSWER_YES_NO: 'Bitte antworte mit Ja, Nein oder sage abbrechen. ',
      HELP_MESSAGE: 'Du kannst sagen, „Wie ist mein Kontostand“, oder „Sende 0,1 XRP“. Wie kann ich dir helfen? ',
      HELP_REPROMPT: 'Wie kann ich dir helfen? ',
      FALLBACK_MESSAGE: 'Der XRP Tip Bott Skill kann dir dabei nicht helfen. Ich kann XRP Tips an deine XRP Tip Bott Kontakte senden oder deinen XRP Tip Bott Kontostand abfragen. Wie kann ich dir helfen? ',
      FALLBACK_REPROMPT: 'Wie kann ich dir helfen? ',
      ERROR_MESSAGE: 'Es ist ein Fehler aufgetreten. Bitte melde das Problem dem Entwickler und versuche es erneut. ',
      STOP_MESSAGE: 'Auf Wiedersehen! Bis zum nächsten mal. ',
      RESPONSE_ERROR_404: 'Der User, an den du die XRP senden willst, hat sich noch nie auf der XRP Tip Bot Webseite angemeldet. ',
      RESPONSE_ERROR_403: 'Es wurde kein Betrag angegeben. Etwas ist schief gelaufen. Bitte melde das Problem dem Entwickler. ',
      RESPONSE_ERROR_401_WITH_AMOUNT: 'Du hast nicht genügend Guthaben um %(amount)s XRP zu senden. Bitte lade dein XRP Tip Bott Konto auf und versuche es erneut.',
      RESPONSE_ERROR_413: 'Der Betrag ist zu groß. So viele XRP kann ich leider nicht senden. ',
      RESPONSE_ERROR_500: 'Die Empfänger Addresse ist nicht gültig. Bitte sende das Problem an den Entwickler. ',
      RESPONSE_ERROR_300: 'Du kannst keine XRP zu dir selbst senden. ',
      RESPONSE_ERROR_400: 'Der User, an den du den Tip senden willst, hat den XRP Tip Bot deaktiviert. ',

      API_NOT_AVAILABLE: 'Sorry, die XRPTipBott API kann gerade nicht erreicht werden. Bitte versuche es später nocheinmal.'
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
