import {Connection, createConnection} from "typeorm"

let connection: Connection

(async () => {
    try {
        connection = await createConnection()
        console.log('Connection to DB')
    } catch(error) {
        throw error
    }
})()
