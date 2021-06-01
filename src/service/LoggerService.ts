import {Service} from "typedi"
import {ILogInfo} from "../type/ILogInfo"
import moment from "moment";

@Service()
export class LoggerService {

    public info(text: string | ILogInfo, data?: object): void {

        let message = `INFO: ${this.getDate()}`

        if (typeof text == 'string') {
            message += ` | ${text}`
        } else {
            if(text.text) message += ` | ${text}`
            if(text.user) message += ` | userId: ${text.user.id}`
            if(text.id) message += ` | requestId: ${text.id}`
            if(text.data) message += ` | ${this.objToString(text.data)}`
        }
        if(data) message += ` | ${this.objToString(data)}`
        console.log(message)
    }

    public error(text: string | ILogInfo, error?: Error, data?: object): void {
        let message = `ERROR: ${this.getDate()}`

        if (typeof text != 'object') {
            message += ` | ${text}`
        } else {
            if(text.text) message += ` | ${text}`
            if(text.user) message += ` | userId: ${text.user.id}`
            if(text.id) message += ` | requestId: ${text.id}`
            if(text.data) message += ` | ${this.objToString(text.data)}`
        }
        if(data) message += ` | ${this.objToString(data)}`

        if(error && error.name) message += ` | errorName: ${error.name}`
        if(error && error.message) message += ` | errorMessage: ${error.message}`
        if(error && error.stack) message += ` | errorStack: ${error.stack}`

        console.error(message)
    }

    private getDate() {
        return moment().format("DD-MM-YYYY HH:mm:ss")
    }

    private objToString(data: object): string {
        let str = ''

        const entries = Object.entries(data)

        for (let i=0; i<entries.length; i++) {
            str += `${entries[0][0]}: ${entries[0][1]}`
            if(i < entries.length-1) str += ', '
        }

        return str
    }
}