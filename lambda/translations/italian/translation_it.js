const itData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
        WELCOME_MESSAGE: 'Benvenuto alla Skill di XRP Tip Bot. Qui puoi controllare il tuo saldo residuo e inviare mance ai tuoi contatti. Come posso aiutarti? ',
        ACCOUNT_LINKING: 'Per cominciare è necessario collegare il tuo account. Per procedere, apri la companion app di Alexa. ',
        ACCOUNT_BALANCE: 'Il tuo saldo residuo di XRP Tip Bot è pari a: %(amount)s XRP. Come posso aiutarti? ',
        ASK_FOR_AMOUNT: 'Quante XRP vorresti inviare? ',
        ASK_FOR_AMOUNT_MAX: 'Si possono inviare un massimo di 20 XRP per volta. ',
        ASK_FOR_AMOUNT_FAIL: 'Mi dispiace ma non ho capito l\'importo. Puoi ripetere? ',
        ASK_FOR_AMOUNT_CONFIRMATION: '%(amount)s XRP. L\'importo è corretto? ',
        ASK_FOR_AMOUNT_FALLBACK: 'Mi dispiace ma non ho capito. Puoi ripetere l\'importo? ',
        ASK_FOR_USER: 'A quale utente vorresti inviare una mancia? ',
        ASK_FOR_USER_FAIL: 'Mi dispiace ma non ho capito il nome dell\'utente. Puoi ripetere? ',
        ASK_FOR_USER_CONFIRMATION: 'Vuoi dire l\'utente %(user)s in %(network)s? ',
        ASK_FOR_USER_FALLBACK: 'Mi dispiace ma non ho capito. Ricominciare dicendo: ricerca ... seguito dal nome dell\'utente. ',
        TIP_CONFIRMATION: 'Vuoi inviare %(amount)s XRP all\'utente %(user)s . È corretto? ',
        TIP_SENT_RESPONSE: '%(amount)s XRP sono state inviate a %(user)s. ',
        SENDING_TIP_CANCEL: 'Ok, nessuna XRP è stata inviata. ',
        NO_USER_FOUND: 'Mi dispiace ma non ho trovato nessun utente nella lista contatti della tua XRP Tip Bot. ',
        NO_MORE_USERS: 'Mi dispiace ma non conosco nessun altro utente con questo nome. Riprovare. ',
        ANSWER_YES_NO: 'Rispondere con sì, no o cancella',
        HELP_MESSAGE: 'Puoi dire... a quanto ammonta il mio saldo residuo, oppure, puoi dire... invia 0.1 XRP. Come posso dunque aiutarti? ',
        HELP_REPROMPT: 'Come posso aiutarti? ',
        FALLBACK_MESSAGE: 'La Skill XRP Tip Bot non può esserti d\'aiuto con questa richiesta, ma può aiutarti ad inviare mance ai contatti della XRP Tip Bot o a farti sapere qual è il tuo saldo residuo. ',
        FALLBACK_REPROMPT: 'Come posso aiutarti? ',
        ERROR_MESSAGE: 'Mi dispiace ma si è verificato un errore. Segnalare l\'errore e riprovare. ',
        STOP_MESSAGE: 'Arrivederci! Alla prossima volta! ',
        RESPONSE_ERROR_404: 'L\'utente destinatario non si è ancora registrato al sito web di XRP Tip Bot. ',
        RESPONSE_ERROR_403: 'Nessun importo specificato. Si è verificato un problema. Segnalare l\'errore. ',
        RESPONSE_ERROR_401_WITH_AMOUNT: 'Il saldo residuo non è sufficiente per inviare %(amount)s XRP. Ricarica il tuo account di XRP Tip Bot e riprova. ',
        RESPONSE_ERROR_413: 'Hai superato il limite massimo per mancia. Non puoi inviare l\'importo richiesto. ',
        RESPONSE_ERROR_500: 'L\'indirizzo di destinazione non è corretto. Per favore segnalare il problema. ',
        RESPONSE_ERROR_300: 'Mi dispiace ma non puoi inviare una mancia a te stesso. ',
        RESPONSE_ERROR_400: 'L\'utente destinatario ha disabilitato XRP Tip Bot. ',
        API_NOT_AVAILABLE: 'L\'API di XRPTipBot non è al momento disponibile. Riprova più tardi.'
    },
};
  
const ititData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
    },
};
  
exports.itData = function() {
    return itData;
}

exports.itITData = function() {
    return ititData;
}
