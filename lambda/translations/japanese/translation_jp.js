const jpData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
        WELCOME_MESSAGE: 'ようこそXRP Tip Bot Skillへ 。ここで残高照会またはあなたが通信する人にチップを送ることができます。なにかお困りでしょうか。',
        ACCOUNT_LINKING: 'まずあなたのアカウントに接続する必要があります。アレクサの連動 アプリを起動してあなたのアカウントに接続してください。',
        ACCOUNT_BALANCE: 'あなたの XRP Tip Bot 残高は: %(amount)s XRPです。なにかお困りでしょうか。 ',
        ASK_FOR_AMOUNT: 'いくらのXRPを送りたいですか. ',
        ASK_FOR_AMOUNT_MAX: '一度に送信できるのは20XRPまでです。',
        ASK_FOR_AMOUNT_FAIL: '申し訳ございません。金額を確認できません。もう一度繰り返してください。',
        ASK_FOR_AMOUNT_CONFIRMATION: '%(amount)s XRPで合っていますか? ',
        ASK_FOR_AMOUNT_FALLBACK: ', 申し訳ありません。確認できませんでした。もう一度金額を繰り返してください。',
        ASK_FOR_USER: 'どのユーザーにチップを送信したいですか? ',
        ASK_FOR_USER_FAIL: '申し訳ございません。ユーザー名を確認できませんでした。もう一度繰り返してください。',
        ASK_FOR_USER_CONFIRMATION: ' %(user)sのユーザー%(network)sで間違いありませんか？ ',
        ASK_FOR_USER_FALLBACK: '申し訳ございません。確認できませんでした。ユーザー名を指定して....へ送信ではじめてください。',
        TIP_CONFIRMATION: 'あなたは%(amount)s XRP をユーザー %(user)s へ送信します。よろしいですか？',
        TIP_SENT_RESPONSE: '%(amount)s XRPは %(user)s .へ送信されました',
        SENDING_TIP_CANCEL: 'かしこまりましたXRPは送信されていません',
        NO_USER_FOUND: '申し訳ございません。その名前ではユーザーを見つけることが出来ませんでした ',
        NO_MORE_USERS: '申し訳ございません, この名前ではこれ以上わかりません。もう一度試してください。',
        ANSWER_YES_NO: 'はい。かいいえ、または取り消しで答えてください。',
        HELP_MESSAGE: '私の残高はと言ってみてください。もしくは 0.1 XRPを送信と言ってみて下さい。それでなにかお困りですか？ ',
        HELP_REPROMPT: 'なにかお困りですか？ ',
        FALLBACK_MESSAGE: ' XRP Tip Bot skillではそれはできません。 この機能でできることは XRP Tip Bot の接続先にチップを送信するか XRP Tip Botの残高照会 です。他になにかお困りですか？ ',
        FALLBACK_REPROMPT: 'なにかお困りですか? ',
        ERROR_MESSAGE: '申し訳ありません。エラーが発生しました。問題を報告しもう一度試してください。',
        STOP_MESSAGE: 'さようなら。またお会いしましょう。 ',
        RESPONSE_ERROR_404: '宛先のユーザーは XRP Tip Botのウェブサイトに一度もログインしていません。',
        RESPONSE_ERROR_403: '金額が指定されていません。なにかが間違っています。この問題を報告してください。',
        RESPONSE_ERROR_401_WITH_AMOUNT: ' %(amount)s XRPを送信するには残高が不足しています。残高をいっぱいにしてもう一度試してください。',
        RESPONSE_ERROR_413: '1度に送信できるチップの制限を超えています。その金の XRPを送信することはできません。',
        RESPONSE_ERROR_500: '宛先に指定したアドレスは無効です。この問題を報告してください。',
        RESPONSE_ERROR_300: '申し訳ありません。ご自分にチップを送信することはできません。',
        RESPONSE_ERROR_400: '宛先に指定したユーザーは XRP Tip Botを利用することができません. ',

        API_NOT_AVAILABLE: 'Sorry, but the XRPTipBot API is currently not available. Please try again later.'
    },
};
  
const jpjpData = {
    translation: {
        SKILL_NAME: 'XRP Tip Bot',
    },
};

exports.jpData = function() {
    return jpData;
}

exports.jpJPData = function() {
    return jpjpData;
}
