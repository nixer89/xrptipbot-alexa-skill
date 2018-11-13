const esMXData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
        WELCOME_MESSAGE: ' bien venido a la havilidad del XRP Bot aqui puedes verificar tu balance o mandar propinas a tus contactos. ',
        ACCOUNT_LINKING: 'Nesecitas enlazar tu cuenta antes que nada, Por favor habre la aplicacion asistente Alexa para enlazar tu cuenta. ',
        ACCOUNT_BALANCE: 'Tu balance de propinas XRP Bot es: %(amount)s XRP, Con que te puedo ayudar? ',
        ASK_FOR_AMOUNT: 'Cuanto XRP quieres mandar? ',
        ASK_FOR_AMOUNT_MAX: 'Solo un monto maximo de 20 XRP puede ser mandado a la vez. ',
        ASK_FOR_AMOUNT_FAIL: 'Perdon, no entendi el monto, por favor repitelo? ',
        ASK_FOR_AMOUNT_CONFIRMATION: '%(amount)s XRP, correcto? ',
        ASK_FOR_AMOUNT_FALLBACK: 'Lo siento no entendi. Por favor repite el monto. ',
        ASK_FOR_USER: 'A que usuario deseas mandar la propina? ',
        ASK_FOR_USER_FAIL: 'Lo siento, no entendi el nombre de usuario, Repitelo por favor. ',
        ASK_FOR_USER_CONFIRMATION: 'Te refieres usuario %(user)s de %(network)s? ',
        ASK_FOR_USER_FALLBACK: 'Perdon, no entendi. Por favor empieza con: busca a ... y el nombre de usuario ',
        TIP_CONFIRMATION: 'Quieres mandar %(amount)s XRP al el usuario %(user)s . Correcto? ',
        TIP_SENT_RESPONSE: '%(amount)s XRP ha sido mandado a %(user)s . ',
        SENDING_TIP_CANCEL: 'Ok, no XRP ha sido mandado. ',
        NO_USER_FOUND: 'Lo siento, no pude encontrar ningun usuario en tu lista de contactos de Bot XRP de propinas. ',
        NO_MORE_USERS: 'Lo siento, pero no reconosco ningunos otros usuarios con ese nombre, Por favor intentalo otra vez. ',
        ANSWER_YES_NO: 'por favor contesta si, no o cancela. ',
        HELP_MESSAGE: 'Puedes decir… cual es mi balance, o puedes decir… manda 0.1 XRP. Con que te puedo ayudar?',
        HELP_REPROMPT: 'Con que te puedo ayudar? ',
        FALLBACK_MESSAGE: 'El Bot XRP de propinas no te puede ayudar con eso. Te puende ayudar a mandar propinas a tu lista de contactos de propinas de Bot XRP o verificar tu balance, Asi que, con que te puedo ayudar? ',
        FALLBACK_REPROMPT: 'con que te puedo ayudar? ',
        ERROR_MESSAGE: 'Lo siento ocurrio un error, Por favor reporta lo que ocurrio y trata otra vez. ',
        STOP_MESSAGE: 'Adios! Nos vemos la siguiente vez. ',
        RESPONSE_ERROR_404: 'El destinatario nunca inicio una sesion en el sitio Bot XRP de propinas. ',
        RESPONSE_ERROR_403: 'El monto no fue especificado. Un evento desconocido ocurrio. Por favor reporta el problema. ',
        RESPONSE_ERROR_401_WITH_AMOUNT: 'No tienes el monto suficiente para mandar %(amount)s XRP. Por favor recarga el balance de tu cuenta Bot XRP de propinas e intentalo otra vez. ',
        RESPONSE_ERROR_413: 'has excedido el monto limite de propina. No puedo mandar ese mono de XRP. ',
        RESPONSE_ERROR_500: 'La direccion destinataria es invalida. Por favor reporta este problema. ',
        RESPONSE_ERROR_300: 'Lo siento, pero no te puedes propinar a ti mismo. ',
        RESPONSE_ERROR_400: 'El destinatario deshabilito el Bot XRP de propinas. ',
        API_NOT_AVAILABLE: 'Lo siento, pero el programa interface de la aplicación Bot XRP de propinas no esta disponible, por favor intentalo otra vez mas tarde.'
    },
};

exports.esMXData = function() {
    return esMXData;
}
