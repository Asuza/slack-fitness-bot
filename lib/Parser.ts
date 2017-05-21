export default class Parser {

    decide (message: string) {
        if (/(add me|join)/i.test(message)) {
            return {
                type: 'participant',
                action: 'add'
            }
        }

        if (/(remove me|i( a|')?m done)/i.test(message)) {
            return {
                type: 'participant',
                action: 'remove'
            }
        }

        return false;
    }

}