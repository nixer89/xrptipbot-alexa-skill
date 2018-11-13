const esData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
        WELCOME_MESSAGE: 'Bienvenido a la herramienta XRP Tip Bot. Aquí puedes comprobar tu saldo y enviar propinas a tus contactos. ¿En qué puedo ayudarte? ',
        ACCOUNT_LINKING: 'Necesitas conectar tu cuenta primero. Por favor abre el asistente de Alexa para enlazar tu cuenta. ',
        ACCOUNT_BALANCE: 'Tu saldo en XRP Tip Bot es: %(amount)s XRP. ¿En qué puedo ayudarte? ',
        ASK_FOR_AMOUNT: '¿Cuántos XRP quieres enviar? ',
        ASK_FOR_AMOUNT_MAX: 'Lo máximo que puedes enviar son 20XRP cada vez. ',
        ASK_FOR_AMOUNT_FAIL: 'Lo siento, no he entendido la cantidad. ¿Puedes repetirla, por favor?. ',
        ASK_FOR_AMOUNT_CONFIRMATION: '%(amount)s XRP. ¿Correcto? ',
        ASK_FOR_AMOUNT_FALLBACK: 'Lo siento, no te he entendido. Por favor, repite la cantidad. ',
        ASK_FOR_USER: '¿A qué usuario quieres enviar la propina? ',
        ASK_FOR_USER_FAIL: 'Lo siento, no he entendido el nombre de usuario. Por favor repite. ',
        ASK_FOR_USER_CONFIRMATION: '¿Quieres decir %(user)s de %(network)s? ',
        ASK_FOR_USER_FALLBACK: 'Lo siento, no te he entendido. Por favor empieza con: buscar ... y el nombre de usuario. ',
        TIP_CONFIRMATION: 'Quieres enviar %(amount)s XRP a %(user)s . ¿Correcto? ',
        TIP_SENT_RESPONSE: 'Se han enviado %(amount)s XRP a %(user)s . ',
        SENDING_TIP_CANCEL: 'Ok, ningún XRP se ha enviado. ',
        NO_USER_FOUND: 'Lo siento, no he podido encontrar ningún usuario en tu lista de contactos de XRP Tip Bot. ',
        NO_MORE_USERS: 'Lo siento, pero no conozcon ningún usuario con ese nombre. Prueba otra vez por favor. ',
        ANSWER_YES_NO: 'Por favor responde sí, no o cancelar.',
        HELP_MESSAGE: 'Puedes decir... cuál es mi saldo, o, puedes decir... envía 0.1 XRP. Así que, ¿en qué puedo ayudarte? ',
        HELP_REPROMPT: '¿En qué puedo ayudarte? ',
        FALLBACK_MESSAGE: 'XRP Tip Bot no puede ayudarte con eso. Puede ayudarte a enviar propinas a tus contactos de XRP Tip Bot o darte tu saldo de XRP Tip Bot. Así que, ¿en qué puedo ayudarte? ',
        FALLBACK_REPROMPT: '¿En qué puedo ayudarte? ',
        ERROR_MESSAGE: 'Lo siento, ha ocurrido un error. Por favor, informa de este problema e inténtalo de nuevo. ',
        STOP_MESSAGE: '¡Adiós! ¡Hasta la próxima! ',
        RESPONSE_ERROR_404: 'El usuario destinatario nunca se conectó a la web de XRP Tip Bot. ',
        RESPONSE_ERROR_403: 'No se ha especificado ninguna cantidad. Algo salió mal. Por favor informa de este problema. ',
        RESPONSE_ERROR_401_WITH_AMOUNT: 'No tienes saldo suficiente para enviar %(amount)s XRP. Por favor recarga tu cuenta XRP Tip Bot e inténtalo de nuevo. ',
        RESPONSE_ERROR_413: 'Has excedido el límite por propina. No puedo enviar esa cantidad de XRP. ',
        RESPONSE_ERROR_500: 'La dirección de destino no es válida. Por favor informa de este problema. ',
        RESPONSE_ERROR_300: 'Lo siento, pero no puedes enviarte propinas a ti mismo. ',
        RESPONSE_ERROR_400: 'El usuario de destino ha desactivado el XRP Tip Bot. ',

        API_NOT_AVAILABLE: 'Lo siento, pero la API de XRPTipBot no se encuentra disponible. Por favor inténtalo más tarde.'
    },
};
  
const esesData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
    },
};
  
exports.esData = function() {
    return esData;
}

exports.esESData = function() {
    return esesData;
}
